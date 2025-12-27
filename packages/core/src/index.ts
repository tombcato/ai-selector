/**
 * AI Provider Selector - Core Package
 * Framework-agnostic logic for AI provider configuration
 */

// I18N
export * from './i18n';

// Types
export type {
    Provider,
    Model,
    AIConfig,
    AuthType,
    ApiFormat,
    TestConnectionOptions,
    TestConnectionResult,
    FetchModelsOptions,
    StorageAdapter,
    // New config types
    ProviderConfig,
    CustomProviderDefinition,
    AIConfigFormProps,
} from './types';

// Providers
export {
    PROVIDERS,
    getProvider,
    getAllProviders,
    getProvidersByFormat
} from './providers';

// Models
export {
    STATIC_MODELS,
    getStaticModels
} from './models';

// API
export {
    testConnection,
    fetchModels
} from './api';

// Storage
export {
    localStorageAdapter,
    createConfigStorage
} from './storage';

// Config Resolution
export {
    resolveProviderConfig,
    getProviderFromConfig,
    type ResolvedConfig
} from './config';
