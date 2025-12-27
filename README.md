# AI Provider Selector UI

一个现代化的 AI Provider 选择器组件，支持 18+ 主流 AI 服务商，包括连通性测试和动态模型列表获取。

## ✨ 特性

- 🎨 **现代 UI** - 基于 React + Tailwind CSS，支持亮色/暗色主题
- 🔌 **18+ Provider** - OpenAI, Anthropic, Gemini, DeepSeek, OpenRouter 等
- ✅ **连通性测试** - 自动验证 API Key 有效性
- 📋 **动态模型列表** - 从 API 实时获取，带内存缓存
- 💾 **配置持久化** - 保存到 localStorage
- 🚀 **开箱即用** - 内置 Python 后端代理

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Python 3.8+ (后端)

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/ai-provider-model-selector-ui.git
cd ai-provider-model-selector-ui
```

### 2. 安装前端依赖

```bash
npm install
```

### 3. 安装后端依赖

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 4. 启动后端

```bash
cd backend
python server.py
```

后端会在 `http://localhost:8000` 启动，提供以下接口：
- `POST /test` - 测试 API Key 连通性
- `POST /models` - 获取模型列表
- API 文档: `http://localhost:8000/docs`

### 5. 启动前端

新开一个终端：

```bash
npm run dev
```

访问 `http://localhost:5173` 即可使用。

## 📁 项目结构

```
ai-provider-model-selector-ui/
├── src/
│   ├── App.jsx                    # 主应用入口
│   ├── components/
│   │   ├── ProviderSelector.jsx   # Provider 下拉选择
│   │   ├── AuthInput.jsx          # API Key 输入 + 自动验证
│   │   ├── ModelSelector.jsx      # Model 下拉选择
│   │   └── ConnectionTester.jsx   # 连通性测试按钮
│   ├── data/
│   │   ├── provider-meta.json     # Provider 元数据
│   │   └── static-models.json     # 静态模型列表 (兜底)
│   ├── lib/
│   │   ├── providerConfig.js      # 配置解析逻辑
│   │   └── storage.js             # localStorage 封装
│   └── icons/                     # Provider SVG 图标
├── backend/
│   ├── server.py                  # FastAPI 后端
│   └── requirements.txt           # Python 依赖
└── package.json
```

## 🔧 自定义配置

### 添加/修改 Provider

编辑 `src/data/provider-meta.json`：

```json
{
    "custom_provider": {
        "id": "custom_provider",
        "name": "My Custom Provider",
        "baseUrl": "https://api.example.com/v1",
        "authType": "bearer",
        "apiFormat": "openai",
        "supportsModelsApi": true,
        "icon": "custom_provider"
    }
}
```

### 自定义主题

修改 `src/index.css` 和 `tailwind.config.js`。

## 📋 支持的 Provider

| Provider | API Format | 模型列表 API |
|----------|-----------|-------------|
| OpenAI | openai | ✅ |
| Anthropic | anthropic | ❌ |
| Google Gemini | gemini | ✅ |
| DeepSeek | openai | ✅ |
| OpenRouter | openai | ✅ |
| Groq | openai | ✅ |
| Mistral | openai | ✅ |
| Moonshot (Kimi) | openai | ✅ |
| 通义千问 (Qwen) | openai | ✅ |
| 智谱 AI (GLM) | openai | ✅ |
| 硅基流动 | openai | ✅ |
| xAI (Grok) | openai | ✅ |
| Together AI | openai | ✅ |
| Fireworks AI | openai | ✅ |
| DeepInfra | openai | ✅ |
| Perplexity | openai | ❌ |
| Cohere | cohere | ✅ |
| Ollama (Local) | openai | ✅ |

## 🛠️ 开发

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📄 License

MIT
