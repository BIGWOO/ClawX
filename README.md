<div align="center">

# 🤖 Agent-i Desktop

### 我的 AI，我做主 — My AI, My Way

**AI 助理桌面安裝程式 · 讓任何人都能部署 AI 助理**

[![Electron](https://img.shields.io/badge/Electron-40-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[🌐 agent-i.app](https://agent-i.app) · [📄 Landing Page Repo](https://github.com/BIGWOO/agent-i)

</div>

---

## ✨ 關於 Agent-i Desktop

Agent-i Desktop 是一個桌面應用程式，讓不懂技術的用戶透過圖形化介面，幾分鐘內完成 AI 助理的部署。

不需要打開終端機、不需要寫程式碼 — 跟著 Setup Wizard 一步步完成，你的 AI 助理就上線了。

<!-- screenshot -->

---

## 🎯 功能亮點

- 🧙 **Setup Wizard（7 步驟）** — 從零到部署完成的引導式設定流程
- 🔐 **多種 AI 驗證方式** — Anthropic OAuth / GitHub Copilot / API Key 自由選擇
- 🎭 **AI 人設選擇** — 預設多種 AI 助理角色風格
- 🤖 **Telegram Bot SOP** — 手把手教你建立 Telegram Bot Token
- 🌐 **Gateway 管理** — 圖形化管理 OpenClaw Gateway 服務
- 💬 **多 Channel 支援** — LINE / Telegram / Discord
- 🌍 **i18n 四語言** — English / 简体中文 / 繁體中文 / 日本語
- 📦 **一鍵安裝** — macOS / Windows 原生安裝包

---

## 📁 專案結構

```
src/
├── pages/
│   ├── Setup/            # Setup Wizard 主流程
│   ├── Dashboard/        # 儀表板
│   ├── Channels/         # Channel 管理（LINE/TG/Discord）
│   ├── Chat/             # 對話介面
│   ├── Settings/         # 設定頁面
│   ├── Skills/           # AI 技能管理
│   └── Cron/             # 排程任務
├── components/
│   ├── setup/            # Setup Wizard 元件
│   ├── layout/           # 佈局元件
│   ├── settings/         # 設定元件
│   ├── common/           # 共用元件
│   └── ui/               # 基礎 UI 元件
├── i18n/
│   └── locales/          # 翻譯檔（en/zh/zh-TW/ja）
├── stores/               # 狀態管理
├── lib/                  # 工具函式
└── types/                # TypeScript 型別定義

electron/                 # Electron 主程序
scripts/                  # 建置腳本
```

---

## 🚀 快速開始

### 前置需求

- **Node.js** ≥ 20
- **pnpm** ≥ 9

### 安裝與開發

```bash
# 初始化（安裝依賴 + 下載 bundled uv）
pnpm init

# 啟動開發模式
pnpm dev

# 型別檢查
pnpm typecheck

# 執行測試
pnpm test
```

### 建置安裝包

```bash
# 完整建置（Vite + Electron Builder）
pnpm build

# 僅建置前端
pnpm build:vite
```

---

## 🛠 開發指令

| 指令 | 說明 |
|------|------|
| `pnpm init` | 初始化專案（安裝依賴 + 下載 uv） |
| `pnpm dev` | 啟動 Vite + Electron 開發模式 |
| `pnpm build` | 建置生產版本 + 打包安裝檔 |
| `pnpm build:vite` | 僅建置前端 |
| `pnpm lint` | ESLint 檢查並自動修復 |
| `pnpm typecheck` | TypeScript 型別檢查 |
| `pnpm test` | 執行 Vitest 單元測試 |
| `pnpm test:e2e` | 執行 Playwright E2E 測試 |

---

## 🎨 設計系統

| Token | 值 | 用途 |
|-------|-----|------|
| 背景色 | `#FAFAF8` | Nordic Daylight 暖米白 |
| 品牌綠 | `#5C8C6E` | 主要品牌色、按鈕、強調 |
| 設計語言 | Nordic Daylight | 溫暖、乾淨、友善 |

---

## 🤝 貢獻

歡迎貢獻！本專案 fork 自 [OpenClaw/ClawX](https://github.com/OpenClaw/ClawX)，品牌與 UI 已重新設計為 Agent-i。

1. Fork 這個 repo
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. Commit 你的修改 (`git commit -m 'feat: 新增很棒的功能'`)
4. Push 到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

---

## 📝 License

MIT © Agent-i Team

---

<div align="center">

**Agent-i** — 我的 AI，我做主

[官網](https://agent-i.app) · [Landing Page](https://github.com/BIGWOO/agent-i) · [回報問題](https://github.com/BIGWOO/ClawX/issues)

</div>
