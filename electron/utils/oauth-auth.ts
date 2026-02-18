/**
 * OAuth Authentication Flows
 * - Anthropic: Webview-based login (intercept session token)
 * - GitHub Copilot: Device Flow OAuth
 */
import { BrowserWindow, shell, session } from 'electron';
import { logger } from './logger';
import { saveProviderKeyToOpenClaw } from './openclaw-auth';

// ─── Anthropic OAuth (Webview Login) ───────────────────────────────

export async function anthropicOAuthLogin(): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const partition = 'persist:anthropic-auth';
    const ses = session.fromPartition(partition);

    const authWindow = new BrowserWindow({
      width: 460,
      height: 700,
      title: 'Sign in to Claude',
      show: false,
      webPreferences: {
        partition,
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    let resolved = false;
    const finish = (result: { success: boolean; error?: string }) => {
      if (resolved) return;
      resolved = true;
      if (!authWindow.isDestroyed()) authWindow.close();
      resolve(result);
    };

    // Monitor cookies for session token
    const checkCookies = async () => {
      try {
        const cookies = await ses.cookies.get({ domain: '.claude.ai' });
        // TODO: Determine the exact cookie/token name Anthropic uses
        // Possible candidates: sessionKey, __Secure-next-auth.session-token, clp_*
        const sessionCookie = cookies.find(
          (c) =>
            c.name === 'sessionKey' ||
            c.name.startsWith('clp_') ||
            c.name === '__Secure-next-auth.session-token'
        );

        if (sessionCookie) {
          logger.info('[oauth] Anthropic session cookie found:', sessionCookie.name);
          const token = sessionCookie.value;

          try {
            await saveProviderKeyToOpenClaw('anthropic', token);
            finish({ success: true });
          } catch (err) {
            finish({ success: false, error: `Failed to save token: ${err}` });
          }
        }
      } catch (err) {
        logger.error('[oauth] Cookie check error:', err);
      }
    };

    // Listen for cookie changes
    ses.cookies.on('changed', (_event, cookie, _cause, removed) => {
      if (removed) return;
      if (cookie.domain?.includes('claude.ai')) {
        checkCookies();
      }
    });

    // Listen for navigation to detect successful login
    authWindow.webContents.on('did-navigate', (_event, url) => {
      logger.info('[oauth] Navigated to:', url);
      // If redirected to main Claude page, login likely succeeded
      if (url.startsWith('https://claude.ai/') && !url.includes('/login')) {
        // Give a moment for cookies to settle
        setTimeout(checkCookies, 1500);
      }
    });

    authWindow.on('closed', () => {
      finish({ success: false, error: 'Window closed by user' });
    });

    authWindow.once('ready-to-show', () => authWindow.show());
    authWindow.loadURL('https://claude.ai/login');
  });
}

// ─── GitHub Copilot Device Flow OAuth ──────────────────────────────

const GITHUB_COPILOT_CLIENT_ID = 'Iv1.b507a08c87ecfe98';

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

interface DeviceFlowCallbacks {
  onUserCode: (code: string, verificationUri: string) => void;
}

export async function githubCopilotLogin(
  callbacks?: DeviceFlowCallbacks
): Promise<{ success: boolean; error?: string; userCode?: string; verificationUri?: string }> {
  try {
    // Step 1: Request device code
    const codeRes = await fetch('https://github.com/login/device/code', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_COPILOT_CLIENT_ID,
        scope: 'read:user',
      }),
    });

    if (!codeRes.ok) {
      return { success: false, error: `Device code request failed: ${codeRes.status}` };
    }

    const deviceData: DeviceCodeResponse = await codeRes.json();
    const { device_code, user_code, verification_uri, expires_in, interval } = deviceData;

    logger.info('[oauth] GitHub device code obtained, user_code:', user_code);

    // Notify frontend of user code
    if (callbacks?.onUserCode) {
      callbacks.onUserCode(user_code, verification_uri);
    }

    // Open browser for user to enter code
    await shell.openExternal(verification_uri);

    // Step 2: Poll for access token
    const pollInterval = Math.max((interval || 5) * 1000, 5000);
    const deadline = Date.now() + expires_in * 1000;

    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, pollInterval));

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_COPILOT_CLIENT_ID,
          device_code,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        }),
      });

      if (!tokenRes.ok) continue;

      const tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        logger.info('[oauth] GitHub access token obtained');
        await saveProviderKeyToOpenClaw('copilot', tokenData.access_token);
        return { success: true };
      }

      if (tokenData.error === 'authorization_pending') {
        continue;
      }

      if (tokenData.error === 'slow_down') {
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      if (tokenData.error === 'expired_token' || tokenData.error === 'access_denied') {
        return { success: false, error: tokenData.error_description || tokenData.error };
      }
    }

    return { success: false, error: 'Device code expired' };
  } catch (err) {
    logger.error('[oauth] GitHub Copilot login error:', err);
    return { success: false, error: String(err) };
  }
}
