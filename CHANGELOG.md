# Changelog

所有重要更改都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [0.1.11] - 2026-01-04

### 修复
- 修复 React/Vue 包打包时意外包含 React 代码导致的 `ReactCurrentDispatcher` 版本冲突
- 添加 `react/jsx-runtime` 到 Rollup external 列表

---

## [0.1.10] - 2026-01-04

### 修复
- 修复 `workspace:*` 路径导致 npm 安装失败的问题
- 将依赖改为显式版本号 `^0.1.x`

---

## [0.1.9] - 2026-01-03

### 新增
- 英文版 README (`README.en.md`)
- README 中英文切换链接

### 文档
- 优化核心特性描述
- 补充加密存储 API 文档

---

## [0.1.8] - 2026-01-03

### 新增
- Anthropic 支持浏览器直连 CORS (`anthropic-dangerous-direct-browser-access` header)
- Anthropic 支持 `/models` API 动态获取模型列表
- 连接模式显示（直连/代理模式指示器）
- 详细 API 错误信息显示（如 "API key expired"）
- **加密存储 Adapter**：默认使用 AES 加密存储配置（密钥: `aiselector`），防止 API Key 明文泄露
  - `encryptedStorageAdapter`（默认，AES 加密）
  - `plainStorageAdapter`（明文，不推荐）

### 修复
- Anthropic 策略添加必需的 `max_tokens` 默认值 (1024)
- Cohere 策略改为 v2 API 格式 (使用 `messages` 而非 `message + chat_history`)
- 移除 `types.ts` 中重复的 `CustomProviderDefinition` 定义
- 修复 Ollama 等无需 API Key 的 provider 测试按钮被错误禁用的问题
- i18n 类型安全改进 (`ModelSelect.vue`)

### 优化
- 后端 CORS 白名单改用环境变量配置 (`CORS_ORIGINS`)
- 模型名称解析支持 `display_name` 字段

### 文档
- 新增 `CHANGELOG.md` 版本变更记录
- README 添加目录导航
- README 新增 `useAIConfig` Headless 模式文档

---

## [0.1.7] - 2025-12-30

### 修复
- `ModelSelect` 搜索框自动聚焦延迟增加到 50ms，修复 CSS 动画导致的聚焦失败

---

## [0.1.6] - 2025-12-28

### 新增
- Vue 和 React 双框架支持
- 20+ 内置 AI Provider
- 模型列表动态获取与静态 fallback
- 连接测试功能
- 配置本地持久化
- 深色模式支持
- 中英双语 i18n

### 后端
- FastAPI 代理服务器
- 支持 OpenAI、Anthropic、Gemini、Cohere 四种 API 格式
