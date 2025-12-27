/**
 * AI Provider Selector - Core Types
 * Framework-agnostic type definitions
 */

// ============ Provider Types ============

export type AuthType = 'bearer' | 'x-api-key' | 'query-param' | 'none';
export type ApiFormat = 'openai' | 'anthropic' | 'gemini' | 'cohere';

export interface Provider {
    id: string;
    name: string;
    baseUrl: string;
    authType: AuthType;
    apiFormat: ApiFormat;
    supportsModelsApi: boolean;
    icon?: string;
}

export interface Model {
    id: string;
    name: string;
}

// ============ Config Types ============

export interface AIConfig {
    providerId: string;
    apiKey: string;
    model: string;
    baseUrl?: string;
}

// ============ API Types ============

export interface TestConnectionOptions {
    provider: Provider;
    apiKey: string;
    model?: string;
    baseUrl?: string;
    proxyUrl?: string;
}

export interface TestConnectionResult {
    success: boolean;
    latencyMs?: number;
    message?: string;
}

export interface FetchModelsOptions {
    provider: Provider;
    apiKey?: string;
    baseUrl?: string;
    proxyUrl?: string;
}

// ============ Storage Types ============

export interface StorageAdapter {
    get(key: string): string | null;
    set(key: string, value: string): void;
    remove(key: string): void;
}

// ============ Provider Config Types ============

/** 自定义 Provider 定义 */
export interface CustomProviderDefinition {
    name: string;
    baseUrl: string;
    authType: AuthType;
    apiFormat: ApiFormat;
    supportsModelsApi?: boolean;
    icon?: string;
    /** 静态模型列表（当不支持 /models API 时使用） */
    models?: Model[];
}

/** Provider 配置 JSON */
export interface ProviderConfig {
    /** 模式：default=内置+自定义，customOnly=只用自定义 */
    mode: 'default' | 'customOnly';
    /** 白名单：只显示这些内置 provider（仅 mode=default） */
    include?: string[];
    /** 黑名单：隐藏这些内置 provider（仅 mode=default） */
    exclude?: string[];
    /** 自定义 Providers */
    custom?: Record<string, CustomProviderDefinition>;
}

/** AIConfigForm 组件的 Props */
export interface AIConfigFormProps {
    /** 后端代理地址（必需） */
    proxyUrl: string;
    /** Provider 配置（可选，默认使用全部内置 Providers） */
    config?: ProviderConfig;
    /** 初始配置（可选，用于编辑已有配置） */
    initialConfig?: Partial<AIConfig>;
    /** 表单标题 */
    title?: string;
    /** 是否显示配置预览区域 */
    showPreview?: boolean;
    /** 保存按钮文本 */
    saveButtonText?: string;
    /** 是否禁用整个表单 */
    disabled?: boolean;
}
