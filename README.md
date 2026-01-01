<div align="center">
  <img src="./logo.svg" width="128" alt="AI Selector Logo" />
  <h1>AI Selector</h1>
  <p><strong>通用 AI 模型配置组件 & 统一接口适配器</strong></p>
  <p>为 React 和 Vue 提供一致的、美观的 AI 服务接入体验</p>

  <!-- GitHub Badges -->
  <p>
    <a href="https://github.com/tombcato/ai-provider-selector/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.3+-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white" alt="React" />
    </a>
    <a href="https://vuejs.org/">
      <img src="https://img.shields.io/badge/Vue-3+-4FC08D?logo=vue.js&logoColor=white" alt="Vue" />
    </a>
  </p>

  <p>
    <a href="https://tombcato.github.io/">🚀 在线演示 (Live Demo)</a>
    ·
    <a href="#-快速开始">📖 快速开始</a>
    ·
    <a href="#-aiconfigform-参数详解">🔧 API 文档</a>
  </p>
</div>

---

## 📸 演示预览

<div align="center">

![Demo Preview](./docs/demo.gif)

</div>

---

## ✨ 核心特性

| 特性 | 描述 |
|------|------|
| 🎨 **统一设计系统** | 基于 Tailwind CSS，支持深色模式 |
| 🔌 **多框架支持** | 同时提供 React 和 Vue 适配器 |
| 🤖 **20+ 厂商支持** | OpenAI, Claude, Gemini, DeepSeek 等 |
| ⚡ **智能模型发现** | 自动获取厂商最新模型列表 |
| 📡 **连接诊断** | 内置连通性测试与延迟检测 |
| 💾 **配置持久化** | 自动保存到 LocalStorage |

---

## 🤖 支持的 AI 厂商 (20+)

所有图标均支持深色/浅色主题自动切换。

| 图标 | 厂商 | ID | API 格式 | 需要 Key | Models API |
|:----:|------|----|---------:|:--------:|:----------:|
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/openai.svg" width="20"> | **OpenAI** | `openai` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/anthropic.svg" width="20"> | **Anthropic (Claude)** | `anthropic` | Anthropic | ✅ | ❌ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/gemini.svg" width="20"> | **Google Gemini** | `gemini` | Gemini | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/openrouter.svg" width="20"> | **OpenRouter** | `openrouter` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/deepseek.svg" width="20"> | **DeepSeek** | `deepseek` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/moonshot.svg" width="20"> | **Moonshot (Kimi)** | `moonshot` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/qwen.svg" width="20"> | **通义千问 (Qwen)** | `qwen` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/zhipu.svg" width="20"> | **智谱 AI (GLM)** | `zhipu` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/siliconcloud.svg" width="20"> | **硅基流动** | `siliconflow` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/doubao.svg" width="20"> | **火山方舟 (Doubao)** | `doubao` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/minimax.svg" width="20"> | **MiniMax** | `minimax` | OpenAI | ✅ | ❌ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/grok.svg" width="20"> | **xAI (Grok)** | `xai` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/groq.svg" width="20"> | **Groq** | `groq` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/mistral.svg" width="20"> | **Mistral AI** | `mistral` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/together.svg" width="20"> | **Together AI** | `together` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/fireworks.svg" width="20"> | **Fireworks AI** | `fireworks` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/deepinfra.svg" width="20"> | **DeepInfra** | `deepinfra` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/perplexity.svg" width="20"> | **Perplexity** | `perplexity` | OpenAI | ✅ | ❌ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/cohere.svg" width="20"> | **Cohere** | `cohere` | Cohere | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/ollama.svg" width="20"> | **Ollama (Local)** | `ollama` | OpenAI | ❌ | ✅ |

> 💡 支持通过 `config.custom` 添加自定义增删改厂商

---



## 🖥️ 前后端职责

### 前端 (React / Vue)

| 职责 | 说明 |
|------|------|
| UI 渲染 | 配置表单、模型选择、状态展示 |
| 状态管理 | LocalStorage 持久化 |
| 请求组装 | 根据厂商格式构建请求 |
| 直连调用 | 默认模式下直接请求 API |

### 后端 (可选)

| 职责 | 说明 |
|------|------|
| 请求转发 | 解决 CORS 问题 |
| 密钥保护 | 隐藏 API Key |
| 格式转换 | 统一不同厂商接口 |

---

## 🔧 AIConfigForm 参数详解

### 基础参数

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `proxyUrl` | `string` | `''` | 代理地址，留空则使用直连模式 |
| `title` | `string` | - | 表单标题 |
| `language` | `'zh' \| 'en'` | `'zh'` | 界面语言 |
| `showPreview` | `boolean` | `false` | 显示配置预览 |
| `disabled` | `boolean` | `false` | 禁用表单 |

### 高级配置

| 参数名 | 类型 | 描述 |
|--------|------|------|
| `config` | `ProviderConfig` | 厂商过滤与自定义 |
| `initialConfig` | `Partial<AIConfig>` | 初始配置 |
| `modelFetcher` | `ModelFetcher` | 自定义请求处理器 |

### 事件回调

| 事件名 | 类型 | 描述 |
|--------|------|------|
| `onSave` | `(config) => void` | 保存时触发 |
| `onChange` | `(config) => void` | 配置变化时触发 |
| `onTestResult` | `(result) => void` | 测试完成时触发 |

---
## 🏗️ 三种接入方式

本项目支持三种方式接入 AI 厂商 API：

### 1️⃣ 直连模式 (默认)

前端直接请求 AI 厂商 API，**无需任何后端服务**。

```
浏览器 ────────────► AI 厂商 API
```

- ✅ 零配置，开箱即用
- ✅ 无需部署后端
- ⚠️ API Key 会暴露在浏览器 Network 中
- ⚠️ 部分厂商可能不支持浏览器 CORS
```tsx
<AIConfigForm
  proxyUrl="" //不设置代理
/>
```
### 2️⃣ 代理模式 (Proxy)

通过后端代理转发请求，**推荐生产环境使用**。

```
浏览器 ───► 后端代理 ───► AI 厂商 API
```

- ✅ 隐藏 API Key
- ✅ 绕过 CORS 限制
- ✅ 前后端架构分离
- 📦 需要部署 `backend/server.py`
```tsx
<AIConfigForm
  proxyUrl="后端代理地址" //backend server.py本地代理为http://localhost:8000
/>
```
**推荐使用代理的场景：**
- 生产环境部署
- 需要隐藏 API Key
- 遇到 CORS 错误

### 3️⃣ 自定义模式 (ModelFetcher)

完全自定义请求逻辑，由开发者接管所有 API 调用。

```tsx
<AIConfigForm
  proxyUrl="" //不设置代理
  modelFetcher={async (params) => {
    // 自定义实现模型列表获取、连接测试等
    if (params.type === 'fetchModels') {
      return await yourCustomFetch(params);
    }
  }}
/>
```

- ✅ 完全控制请求逻辑
- ✅ 可对接任意后端架构
- 💻 需要开发者实现

---

## 🚀 快速开始

### 1. 安装依赖

```bash
git clone https://github.com/tombcato/ai-provider-selector.git
cd ai-provider-selector
npm install
```

### 2. 启动前端

```bash
# React Demo
npm run dev -w packages/react

# Vue Demo
npm run dev -w packages/vue
```

打开 `http://localhost:5173` 即可体验（默认直连模式）。

### 3. 启用代理 (可选)

```bash
# 1. 启动后端
cd backend
pip install -r requirements.txt
python server.py

# 2. 配置代理地址
# 创建 packages/react/.env.local 文件：
VITE_PROXY_URL=http://localhost:8000
```

> 💡 **无需重启前端**，Vite 会自动加载 `.env.local` 中的环境变量。

---

## 📁 项目结构

```
ai-provider-selector/
├── packages/
│   ├── core/           # 核心逻辑 (框架无关)
│   ├── react/          # React 适配器
│   └── vue/            # Vue 适配器
├── backend/            # Python 代理服务
│   ├── server.py
│   └── strategies.py
├── index.html          # Landing Page
└── logo.svg
```

---

## 📜 许可证

[MIT License](./LICENSE) © 2026 AI Selector

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/tombcato">tombcato</a></sub>
</div>
