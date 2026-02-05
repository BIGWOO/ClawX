# Commit 15: Fix Gateway WebSocket Handshake

## Summary

Fixed the Gateway WebSocket connection instability by implementing the proper OpenClaw WebSocket handshake protocol.

## Problem

The Gateway connection was failing with errors like:
- `token_mismatch` - Authentication failing despite correct tokens
- `invalid handshake: first request must be connect` - Missing handshake
- Repeated connect/disconnect cycles

Root causes:
1. ClawX was not sending the required `connect` handshake message after WebSocket opens
2. Using standard JSON-RPC 2.0 format instead of OpenClaw's custom protocol format
3. Config file had hardcoded token overriding CLI arguments

## Solution

### 1. Implement Proper Connect Handshake

After WebSocket opens, send a proper connect request:

```typescript
const connectFrame = {
  type: 'req',  // OpenClaw uses 'req' not 'jsonrpc: 2.0'
  id: connectId,
  method: 'connect',
  params: {
    minProtocol: 3,
    maxProtocol: 3,
    client: {
      id: 'gateway-client',
      displayName: 'ClawX',
      version: '0.1.0',
      platform: process.platform,
      mode: 'ui',
    },
    auth: {
      token: gatewayToken,
    },
    caps: [],
    role: 'operator',
    scopes: [],
  },
};
```

### 2. Handle OpenClaw Protocol Format

OpenClaw Gateway uses a custom protocol format:
- Request: `{ type: "req", id, method, params }`
- Response: `{ type: "res", id, ok, payload, error }`
- Event: `{ type: "event", event, payload }`

Updated `handleMessage` to parse these formats correctly.

### 3. Remove Hardcoded Config Token

The `~/.openclaw/openclaw.json` file had a hardcoded token that was overriding the CLI token. Updated to remove the auth.token field so the environment variable takes precedence.

## Files Changed

### `electron/gateway/manager.ts`
- **connect()**: Added proper handshake flow with connect request
- **handleMessage()**: Parse OpenClaw protocol response/event formats
- **handleProtocolEvent()**: New method to handle OpenClaw events
- **rpc()**: Use OpenClaw request format `{ type: "req" }`

## Protocol Flow

```
Before (broken):
  1. Open WebSocket
  2. Immediately mark as "running" ❌
  3. Send RPC requests (rejected - no handshake)

After (fixed):
  1. Open WebSocket
  2. Send connect handshake with auth token
  3. Wait for response { type: "res", ok: true }
  4. Mark as "running" ✓
  5. Send RPC requests (accepted)
```

## Testing

After this fix:
- Gateway connects successfully
- WebSocket stays connected without constant reconnection
- RPC calls work correctly
