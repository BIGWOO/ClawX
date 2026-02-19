# Upstream Sync Tracker

> 追蹤 Agent-i Desktop 與上游 ClawX 的同步狀態

## 上游資訊

| 項目 | 值 |
|------|-----|
| **Upstream repo** | [ValueCell-ai/ClawX](https://github.com/ValueCell-ai/ClawX) |
| **Fork repo** | [BIGWOO/ClawX](https://github.com/BIGWOO/ClawX) |
| **Fork point** | `26ce009` (0.1.13, chore(guide): opt guide frontend optimization #88) |
| **Fork date** | 2026-02-18 |
| **同步策略** | Cherry-pick（漸進脫鉤，不做 full merge） |

## 同步原則

- ✅ **Cherry-pick**：bugfix、核心引擎更新、有價值的新功能
- ⏭️ **跳過**：版本號 bump（alpha/beta）、UI 改動（我們已大幅改造）、README 更新
- ⚠️ **謹慎評估**：依賴更新（可能影響我們的改動）

## 我們的主要改動（與上游差異）

| 領域 | 改動內容 | 影響範圍 |
|------|---------|---------|
| **品牌** | ClawX → Agent-i 全域替換 | 全部檔案 |
| **i18n** | 新增 zh-TW 語系，設為預設 | locales/ |
| **Setup Wizard** | OAuth 改造（Anthropic webview + GitHub Copilot） | src/pages/Setup/ |
| **Setup Wizard** | 新增 AI 人設選擇步驟（STEP 4） | src/pages/Setup/ |
| **Setup Wizard** | Telegram Bot Token SOP 引導 | src/components/setup/ |
| **設計系統** | Nordic Daylight 配色（#FAFAF8/#1A1A1A/#5C8C6E） | src/、CSS |
| **Logo/Icon** | 自製 Agent-i Logo（亮/暗雙版） | resources/icons/、src/assets/ |
| **移除功能** | WhatsApp login、Python uv-setup/uv-env | electron/utils/ |
| **Auth** | 新增 oauth-auth.ts（Anthropic + GitHub） | electron/utils/ |
| **URL** | claw-x.com → agent-i.app | 多處 |

## Cherry-pick 記錄

| 日期 | Upstream commit | 說明 | 結果 |
|------|----------------|------|------|
| 2026-02-19 | `5005d40` | chore(deps): update dependencies (#100) | ✅ 已同步（衝突已解決，保留 Agent-i 改動） |
| 2026-02-19 | `1759b98` | fix(chat): optimize chat with pic response (#103) | ✅ 已同步（無衝突） |
| 2026-02-19 | `b9b9eb9` | feat(electron): minimize to tray on close for Windows (#106) | ✅ 已同步（無衝突） |

## 未同步的上游 Commit（需定期檢查）

| Commit | 說明 | 狀態 |
|--------|------|------|
| `5005d40` | chore(deps): update dependencies (#100) | ✅ 已同步 |
| `7360a0a` | 0.1.14-alpha.0 | ⏭️ 跳過（版本號） |
| `1759b98` | fix(chat): optimize chat with pic response (#103) | ✅ 已同步 |
| `c112899` | 0.1.14-alpha.1 | ⏭️ 跳過（版本號） |
| `b9b9eb9` | feat(electron): minimize to tray on close for Windows (#106) | ✅ 已同步 |
| `4483718` | 0.1.14-alpha.2 | ⏭️ 跳過（版本號） |
| `1c418ab` | 0.1.14-alpha.3 | ⏭️ 跳過（版本號） |

## 如何同步

```bash
# 1. 拉最新上游
git fetch upstream main

# 2. 查看新 commit
git log upstream/main --oneline --not main

# 3. Cherry-pick 需要的
git cherry-pick <commit-hash>

# 4. 解衝突（如有）
git add . && git cherry-pick --continue

# 5. 更新此文件！
```

---

*上次檢查：2026-02-19*
*下次建議檢查：每週一次，或上游有重大 release 時*
