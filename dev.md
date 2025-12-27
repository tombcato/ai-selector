# AI Provider Selector UI 组件库开发计划 (Development Plan)

## 0. 设计理念 (Philosophy)
- **Headless First**: 核心逻辑与 UI 分离，确保可以适配 React, Vue 等不同框架。
- **Data Driven**: 基于 [LiteLLM](https://github.com/BerriAI/litellm) 数据源构建，但保持前端独立性，不强依赖 Python 环境。
- **Zero Config Start**: 开箱即用，内置主流 Provider 配置；同时提供高度可定制能力。
- **Proxy Agnostic**: 组件不关心后端实现（Python/Node/Go），通过标准接口（Props）注入网络能力。

## 1. 核心架构 (Architecture)

### 1.1 分层设计
项目采用 Monorepo 结构（或清晰的目录分层）：

```
packages/
├── core/                  # 纯 TypeScript 逻辑层 (无 UI 依赖)
│   ├── data/              # 预处理的 Provider/Model 数据
│   ├── logic/             # 连通性测试, 数据合并, 缓存管理
│   └── types.ts           # 类型定义
├── adapter-react/         # React Hooks 适配层 (useAiSelector)
└── ui-react/              # React UI 组件库 (基于 shadcn/ui 风格)
```

### 1.2 数据源策略 (Data Strategy)
- **Provider 列表**: 
  - **主数据源**: 静态维护一份 `provider-meta.json`，包含 `id`, `name`, `baseUrl`, `authType` (bearer/x-api-key等), `apiFormat` (openai/anthropic等)。
  - **范围**: 仅集成主流且支持 HTTP 调用的 Provider (~30个)。非 HTTP (如 AWS SDK) 暂不集成。
  - **自定义**: 支持用户通过 `props.providers` 覆盖或追加 Provider。
- **Models 列表**:
  - **动态获取**: 优先尝试调用 `props.fetchModels` (通过代理获取实时数据)。
  - **静态兜底**: 内置精简版 LiteLLM Model 列表 (构建时脚本生成)，作为网络不可用或无代理时的兜底。
  - **归并逻辑**: 前端根据 `litellm_provider` 字段将变体（如 `azure_text`, `azure_ai`）归并到同一个 UI 分组（`azure`），但在数据上保留真实 `modelString` 以便后端透传。

### 1.3 网络层 (Network Layer)
组件**不包含**任何具体的后端调用代码，而是通过 **IoC (控制反转)** 接口注入能力：

```typescript
interface ComponentProps {
  // 获取模型列表 (通常需要后端代理解决 CORS)
  fetchModels?: (providerId: string, apiKey?: string, baseUrl?: string) => Promise<Model[]>;
  
  // 测试连通性 (通常调用 chat/completion 接口)
  testConnection?: (config: ConnectionConfig) => Promise<TestResult>;
  
  // 代理地址 (简易模式：组件内部用 fetch POST 到这个地址)
  proxyUrl?: string; 
}
```

## 2. 功能清单 (Features)

- [ ] **Data Core (`@pkg/core`)**
    - [ ] 脚本：从 LiteLLM JSON 提取并生成 `static-models.json`。
    - [ ] 逻辑：Provider 元数据合并逻辑。
    - [ ] 逻辑：Model 分组与搜索逻辑。
    - [ ] 逻辑：Auth Header 构造生成器 (根据 `authType`)。

- [ ] **React Adapter (`@pkg/adapter-react`)**
    - [ ] `useAiProvider`: 管理选中 Provider 状态。
    - [ ] `useAiModel`: 管理模型列表加载状态 (Loading / Error / Data)。

- [ ] **UI Components (`@pkg/ui-react`)**
    - [ ] `ProviderSelector`: 带图标、搜索的下拉选择器。
    - [ ] `AuthInput`: 根据 `authType` 动态变化的输入框 (API Key / Base URL)。
    - [ ] `ModelSelector`: 支持分组展示的下拉框，支持 Loading 状态。
    - [ ] `ConnectionTester`: "测试连通性" 按钮与结果展示 (Latency / Error Msg)。
    - [ ] **布局**: 提供默认的整洁布局，但也导出子组件供深度定制。

## 3. 开发路线图 (Roadmap)

### Phase 1: Core Logic & Data (Current Focus)
1. 建立项目结构。
2. 编写 `scripts/sync-litellm.ts`，生成静态数据。
3. 定义 `ProviderMeta` 和 `Model` 类型。
4. 实现 `Core` 逻辑：输入 Provider ID，输出 BaseUrl, AuthType, 及默认 Models。

### Phase 2: React Implementation
1. 实现 `useAiSelector` hook。
2. 开发 `AiProviderSelector` UI 组件 (React)。
3. 实现简单的 `proxyUrl` 默认 Fetcher。
4. 编写 Demo (Storybook 或 Vite App) 用于调试。

### Phase 3: Documentation & Polish
1. 编写接入文档 (如何配置 Proxy，如何自定义 Provider)。
2. 提供 Python (FastAPI/LiteLLM) 后端接入示例代码。

### Phase 4: Vue Support (Future)
1. 复用 `@pkg/core`。
2. 实现 `adapter-vue` (Composables)。
3. 移植 UI 到 Vue 组件。

## 4. 技术决策 (Technical Decisions)
- **样式方案**: Tailwind CSS + Class Prefix (`aps-`)。
  - **理由**: 避免样式冲突，同时保持高度定制能力（用户可覆盖 `aps-` 类），开发效率高。
- **图标资源**: 手工维护 SVG 图标集。
  - **理由**: LiteLLM 纯后端库不提供 assets。SVG 将内联在组件中，避免额外的 HTTP 请求和 404 问题。
- **UI 框架优先级**: React First。
  - **策略**: 先完成 Core + React Adapter + React UI。Vue 支持将在后续作为独立 Adapter 实现。
