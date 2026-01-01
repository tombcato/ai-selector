<div align="center">
  <img src="./logo.svg" width="128" alt="AI Selector Logo" />
  <h1>AI Selector</h1>
  <p><strong>如果你开发的应用/服务需要用户提供 AI 配置，试试使用 AI Selector 通用 AI 配置开发组件， 简单快速接入 AI </strong></p>
  <p>开箱即用，内置 20+ 主流 AI 厂商配置可自定义扩展、模型列表智能管理、API Key 安全存储、连通性测试和配置持久化。为 React 和 Vue 提供一致的 AI 服务接入体验</p>

  <!-- GitHub Badges -->
  <p>
    <a href="https://www.npmjs.com/package/@tombcato/ai-selector-core">
      <img src="https://img.shields.io/npm/v/@tombcato/ai-selector-core?logo=npm&label=core" alt="npm core" />
    </a>
    <a href="https://www.npmjs.com/package/@tombcato/ai-selector-react">
      <img src="https://img.shields.io/npm/v/@tombcato/ai-selector-react?logo=react&label=react" alt="npm react" />
    </a>
    <a href="https://www.npmjs.com/package/@tombcato/ai-selector-vue">
      <img src="https://img.shields.io/npm/v/@tombcato/ai-selector-vue?logo=vue.js&label=vue" alt="npm vue" />
    </a>
  </p>

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
    <a href="https://tombcato.github.io/ai-selector">🚀 在线演示 (Live Demo)</a>
    ·
    <a href="#-核心组件-aiconfigform-参数详解">🔧 API 文档</a>
    ·
    <a href="#-快速开始">📖 快速开始</a>
    
  </p>
</div>

---

## 📸 演示预览
本项目 UI 中的文本滚动动效由 **[Smart Ticker](https://github.com/tombcato/smart-ticker)** 提供支持。
<div align="center">

![Demo Preview](./docs/aiconfig_mockup.gif)

</div>

---

## ✨ 核心特性

| 特性 | 描述 |
|------|------|
| 🤖 **20+ 厂商支持** | OpenAI, Claude, Gemini, DeepSeek 等 |
| ⚡ **智能模型发现** | 自动获取厂商最新模型列表 |
| 📡 **连接诊断** | 内置连通性测试与延迟检测 |
| 💾 **配置持久化** | 自动保存到 LocalStorage |
| 🎨 **统一设计系统** | 基于 Tailwind CSS，支持深色模式，中英切换 |
| 🔌 **多框架支持** | 同时提供 React 和 Vue 适配器 |

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





## 🔧 核心组件 AIConfigForm 参数详解

### 基础参数

| 参数名 | 类型 | 可选 | 默认值 | 描述 |
|--------|------|:---:|--------|------|
| `proxyUrl` | `string` | ❌ | `''` | 代理地址，留空则使用直连模式 (必传) |
| `title` | `string` | ✅ | - | 表单标题 |
| `language` | `'zh' \| 'en'` | ✅ | `'zh'` | 界面语言 |
| `showPreview` | `boolean` | ✅ | `false` | 显示配置预览 |
| `disabled` | `boolean` | ✅ | `false` | 禁用表单 |

### 高级配置

| 参数名 | 类型 | 可选 | 描述 |
|--------|------|:---:|------|
| `config` | `ProviderConfig` | ✅ | 厂商过滤与自定义 |
| `initialConfig` | `Partial<AIConfig>` | ✅ | 初始配置 |
| `modelFetcher` | `ModelFetcher` | ✅ | 自定义请求处理器 |

### 事件回调

| 事件名 | 类型 | 可选 | 描述 |
|--------|------|:---:|------|
| `onSave` | `(config) => void` | ✅ | 保存时触发 |
| `onChange` | `(config) => void` | ✅ | 配置变化时触发 |
| `onTestResult` | `(result) => void` | ✅ | 测试完成时触发 |

---
## 🏗️ AIConfigForm组件使用
#### 引入组件
```tsx
// React
import { AIConfigForm } from '@tombcato/ai-selector-react';
import '@tombcato/ai-selector-react/dist/index.css'; // ⚠️ 务必引入样式

// Vue
import { AIConfigForm } from '@tombcato/ai-selector-vue';
import '@tombcato/ai-selector-vue/dist/index.css'; // ⚠️ 务必引入样式

<AIConfigForm
  proxyUrl=""                 // 空字符串表示直连模式，或填入后端代理地址
  showPreview                 // 是否显示配置预览 JSON
  language="zh"               // 界面语言 'zh' | 'en'
  title="AI Configuration"    // 自定义卡片标题
/>
```
#### 进阶：自定义 Provider 配置 (ProviderConfig)

通过 `config` 属性，你可以过滤显示的厂商、修改现有配置或添加全新的自定义厂商。

```tsx
// 示例配置
const providerConfig: ProviderConfig = {
    mode: 'default', // 可选值: 'default' | 'customOnly'
    // custom: customProviders as Record<string, CustomProviderDefinition>, //导入自定义provider

    // ========================================================================
    // 场景 1: 只显示指定的 Provider (白名单过滤)
    // ========================================================================
    include: ['openai', 'anthropic'],
    exclude: ['gemini'], // 或者使用黑名单过滤

    // ========================================================================
    // 场景 2: 覆盖/添加自定义 Provider
    // ========================================================================
    custom: {
        // 覆盖内置配置
        openai: {
            name: 'Enterprise OpenAI',
            baseUrl: 'https://gateway.company.com/openai/v1',
            apiFormat: 'openai',
            needsApiKey: true,
            models: [{ id: 'gpt-4o', name: 'GPT-4o' }]
        },
        // 添加新厂商
        deepseeksssss: {
            name: 'DeepSeekssssss',
            baseUrl: 'https://api.deepseek.com',
            apiFormat: 'openai',
            needsApiKey: true,
            icon: 'https://avatars.githubusercontent.com/u/148330874',
            models: [{ id: 'deepseek-chat', name: 'DeepSeek Chat' }]
        }
    },


    // ========================================================================
    // 场景 3: 仅显示自定义 Provider
    // ========================================================================
    mode: 'customOnly',
    custom: {
        'my-private-model': {
            name: 'Internal AI',
            baseUrl: 'http://localhost:8080/v1',
            apiFormat: 'openai',
            needsApiKey: false,
            icon: 'https://placehold.co/32x32?text=INT',
            models: [
                { id: 'llama-3-8b', name: 'Llama 3 8B' },
                { id: 'mistral-7b', name: 'Mistral 7B' }
            ]
        }
    }
}

<AIConfigForm
  config={providerConfig}
  // ...其他参数
/>
```

### proxyUrl对应的三种接入 AI 厂商 API 的方式

#### 1️⃣ 直连模式 (默认)

前端直接请求 AI 厂商 API，**无需任何后端服务**。

```
浏览器 ────────────► AI 厂商 API
```

- ✅ 零配置，开箱即用
- ✅ 无需部署后端
- ⚠️ API Key 会暴露在浏览器 Network 中
- ⚠️ 部分厂商可能不支持浏览器 CORS
- ⚠️ 部分厂商可能不支持浏览器 CORS



```tsx
import ...
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
import ...
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
import ...
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

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install @tombcato/ai-selector-core

# Optional: Framework Adapters
npm install @tombcato/ai-selector-react
npm install @tombcato/ai-selector-vue
```

### 2. 本地调试（可选）

```bash
git clone https://github.com/tombcato/ai-selector.git
cd ai-selector
npm install
```

### 3. 启动 Demo

```bash
# React Demo
npm run dev -w packages/react

# Vue Demo
npm run dev -w packages/vue
```

打开 `http://localhost:5173` 即可体验（默认直连模式）。

### 4. 启用代理 (可选)

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
