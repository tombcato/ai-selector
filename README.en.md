<div align="center">
  <img src="./logo.svg" width="128" alt="AI Selector Logo" />
  <h1>AI Selector</h1>
  <p>
    <a href="./README.md">简体中文</a> | <a href="./README.en.md">English</a>
  </p>
  <p><strong>Need users to configure AI in your app? Try AI Selector - a universal AI configuration component. Works out of the box with consistent React & Vue experience.</strong></p>

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
    <a href="https://tombcato.github.io/ai-selector">🚀 Live Demo</a>
    ·
    <a href="#-aiconfigform-props">🔧 API Docs</a>
    ·
    <a href="#-quick-start">📖 Quick Start</a>
  </p>
</div>

---

## 📑 Table of Contents

- [Demo Preview](#-demo-preview)
- [Features](#-features)
- [Supported Providers](#-supported-ai-providers-20)
- [Quick Start](#-quick-start)
- [AIConfigForm Props](#-aiconfigform-props)
- [Headless Mode (useAIConfig Hook)](#-headless-mode-useaiconfig-hook)
- [Encrypted Storage](#-encrypted-storage)
- [Project Structure](#-project-structure)
- [Changelog](./CHANGELOG.md)

---

## 📸 Demo Preview

<div align="center">

![Demo Preview](./docs/aiconfig-en_compressed.gif)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **20+ Providers** | OpenAI, Claude, Gemini, DeepSeek... Customizable |
| ⚡ **Smart Model Discovery** | Auto-fetch latest models from providers |
| 📡 **Connection Test** | One-click API connectivity & latency check |
| 🔐 **AES Encrypted Storage** | API Key stored encrypted in localStorage |
| 🎨 **Ready-to-use UI** | Tailwind CSS, dark mode, i18n (EN/中文) |
| 🔌 **React + Vue** | Dual-framework adapters, shared core logic |
| 🧩 **Headless Mode** | Use `useAIConfig` Hook only, full UI control |
| 🔄 **Zero Backend Option** | Direct connect / Proxy / Custom fetcher |

---

## 🤖 Supported AI Providers (20+)

| Icon | Provider | ID | API Format | Needs Key | Models API |
|:----:|----------|----|-----------:|:---------:|:----------:|
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/openai.svg" width="20"> | **OpenAI** | `openai` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/anthropic.svg" width="20"> | **Anthropic (Claude)** | `anthropic` | Anthropic | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/gemini.svg" width="20"> | **Google Gemini** | `gemini` | Gemini | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/openrouter.svg" width="20"> | **OpenRouter** | `openrouter` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/deepseek.svg" width="20"> | **DeepSeek** | `deepseek` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/moonshot.svg" width="20"> | **Moonshot (Kimi)** | `moonshot` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/qwen.svg" width="20"> | **Qwen (Tongyi)** | `qwen` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/zhipu.svg" width="20"> | **Zhipu AI (GLM)** | `zhipu` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/siliconcloud.svg" width="20"> | **SiliconFlow** | `siliconflow` | OpenAI | ✅ | ✅ |
| <img src="https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons/doubao.svg" width="20"> | **Doubao (ByteDance)** | `doubao` | OpenAI | ✅ | ✅ |
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

> 💡 Add custom providers via `config.custom`

---

## 🚀 Quick Start

### 1. Install

```bash
npm install @tombcato/ai-selector-core

# Framework Adapters
npm install @tombcato/ai-selector-react
npm install @tombcato/ai-selector-vue
```

### 2. Local Development (Optional)

```bash
git clone https://github.com/tombcato/ai-selector.git
cd ai-selector
npm install
```

### 3. Run Demo

```bash
# React Demo
npm run dev -w packages/react

# Vue Demo
npm run dev -w packages/vue
```

Open `http://localhost:5173` (default: direct mode).

### 4. Enable Proxy (Optional)

```bash
# 1. Start backend
cd backend
pip install -r requirements.txt
python server.py

# 2. Configure proxy URL
# Create packages/react/.env.local:
VITE_PROXY_URL=http://localhost:8000
```

> 💡 **No restart needed** - Vite auto-loads `.env.local` changes.

### 5. Usage

```tsx
// React
import { AIConfigForm } from '@tombcato/ai-selector-react';
import '@tombcato/ai-selector-react/style.css';

// Vue
import { AIConfigForm } from '@tombcato/ai-selector-vue';
import '@tombcato/ai-selector-vue/style.css';

<AIConfigForm
  proxyUrl=""              // Empty = direct mode, or your proxy URL
  showPreview              // Show JSON preview
  language="en"            // 'zh' | 'en'
/>
```

### Custom Provider Configuration

Use the `config` prop to filter, modify, or add custom providers.

```tsx
const providerConfig: ProviderConfig = {
    mode: 'default', // 'default' | 'customOnly'
    
    // Scenario 1: Whitelist filtering
    include: ['openai', 'anthropic'],
    exclude: ['gemini'],
    
    // Scenario 2: Override/add providers
    custom: {
        openai: {
            name: 'Enterprise OpenAI',
            baseUrl: 'https://gateway.company.com/openai/v1',
            apiFormat: 'openai',
            needsApiKey: true,
            models: [{ id: 'gpt-4o', name: 'GPT-4o' }]
        },
        'my-llm': {
            name: 'My Custom LLM',
            baseUrl: 'https://api.example.com/v1',
            apiFormat: 'openai',
            needsApiKey: true,
            models: [{ id: 'model-1', name: 'Model 1' }]
        }
    },
    
    // Scenario 3: Custom only mode
    mode: 'customOnly',
    custom: {
        'internal-ai': {
            name: 'Internal AI',
            baseUrl: 'http://localhost:8080/v1',
            apiFormat: 'openai',
            needsApiKey: false,
            models: [{ id: 'llama-3-8b', name: 'Llama 3 8B' }]
        }
    }
}

<AIConfigForm config={providerConfig} />
```

### proxyUrl: Three Connection Modes

#### 1️⃣ Direct Mode (Default)

Frontend directly requests AI provider API, **no backend required**.

```
Browser ────────────► AI Provider API
```

- ✅ Zero config, works out of the box
- ✅ No backend deployment
- ⚠️ API Key exposed in browser Network tab
- ⚠️ Some providers may block CORS requests

#### 2️⃣ Proxy Mode

Requests routed through backend proxy, **recommended for production**.

```
Browser ───► Backend Proxy ───► AI Provider API
```

- ✅ Hides API Key
- ✅ Bypasses CORS restrictions
- 📦 Requires deploying `backend/server.py`

```tsx
<AIConfigForm proxyUrl="http://localhost:8000" />
```

#### 3️⃣ Custom Mode (ModelFetcher)

Full control over request logic.

```tsx
<AIConfigForm
  modelFetcher={async (params) => {
    if (params.type === 'fetchModels') {
      return await yourCustomFetch(params);
    }
  }}
/>
```

---

## 🔧 AIConfigForm Props

### Basic Props

| Prop | Type | Optional | Default | Description |
|------|------|:--------:|---------|-------------|
| `proxyUrl` | `string` | ✅ | - | Proxy URL (empty = direct mode) |
| `title` | `string` | ✅ | - | Form title |
| `language` | `'zh' \| 'en'` | ✅ | `'zh'` | UI language |
| `showPreview` | `boolean` | ✅ | `false` | Show config preview |
| `disabled` | `boolean` | ✅ | `false` | Disable form |

### Advanced Props

| Prop | Type | Optional | Description |
|------|------|:--------:|-------------|
| `config` | `ProviderConfig` | ✅ | Filter/customize providers |
| `initialConfig` | `Partial<AIConfig>` | ✅ | Initial config |
| `modelFetcher` | `ModelFetcher` | ✅ | Custom request handler |

### Event Callbacks

| Event | Type | Optional | Description |
|-------|------|:--------:|-------------|
| `onSave` | `(config) => void` | ✅ | Triggered on save |
| `onChange` | `(config) => void` | ✅ | Triggered on change |
| `onTestResult` | `(result) => void` | ✅ | Triggered on test complete |

---

## 🔧 Headless Mode (useAIConfig Hook)

For custom UI, use the `useAIConfig` hook directly:

### React

```tsx
import { useAIConfig } from '@tombcato/ai-selector-react';

function MyCustomUI() {
    const {
        // State
        providerId,          // Current provider ID
        apiKey,              // API Key
        model,               // Current model ID
        modelName,           // Model display name
        baseUrl,             // Custom base URL
        models,              // Available models
        provider,            // Current provider object
        providers,           // All available providers
        isValid,             // Is config valid
        testStatus,          // 'idle' | 'testing' | 'success' | 'error'
        testResult,          // Test result object
        isFetchingModels,    // Is fetching models
        fetchModelError,     // Fetch error message
        config,              // Complete config object
        
        // Methods
        setProviderId,       // Set provider
        setApiKey,           // Set API key
        selectModel,         // Select model (id, name)
        setBaseUrl,          // Set base URL
        runTest,             // Run connection test
        save,                // Save to storage
    } = useAIConfig({
        proxyUrl: '',                    // Optional: proxy URL
        providerConfig: {},              // Optional: provider config
        initialConfig: {},               // Optional: initial config
        onSerialize: (data) => data,     // Optional: serialize hook
        onDeserialize: (data) => data,   // Optional: deserialize hook
        modelFetcher: async () => [],    // Optional: custom model fetcher
    });

    return (
        <div>
            <select value={providerId} onChange={e => setProviderId(e.target.value)}>
                {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {/* Your custom UI */}
        </div>
    );
}
```

### Vue

```vue
<script setup lang="ts">
import { useAIConfig } from '@tombcato/ai-selector-vue';

const {
    providerId, apiKey, model, models, providers, isValid,
    setProviderId, setApiKey, selectModel, runTest, save
} = useAIConfig({ proxyUrl: '' });
</script>

<template>
    <!-- Your custom UI -->
</template>
```

---

## 🔐 Encrypted Storage

Config is stored with **AES encryption** by default.

```typescript
import { 
    createConfigStorage, 
    encryptedStorageAdapter,  // Default, AES encrypted
    plainStorageAdapter       // Plain text (not recommended)
} from '@tombcato/ai-selector-core';

// Default: encrypted
const storage = createConfigStorage();

// Plain text (not recommended)
const plainStorage = createConfigStorage(plainStorageAdapter);
```

> ⚠️ Default encryption key is `'aiselector'`. Suitable for basic protection, not for high-security scenarios.

---

## 📁 Project Structure

```
ai-provider-selector/
├── packages/
│   ├── core/           # Core logic (framework-agnostic)
│   ├── react/          # React adapter
│   └── vue/            # Vue adapter
├── backend/            # Python proxy server
│   ├── server.py
│   └── strategies.py
├── index.html          # Landing Page
└── logo.svg
```

---

## 📜 License

[MIT License](./LICENSE) © 2026 AI Selector

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/tombcato">tombcato</a></sub>
</div>
