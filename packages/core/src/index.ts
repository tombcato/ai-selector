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

    ApiFormat,
    TestConnectionOptions,
    TestConnectionResult,
    FetchModelsOptions,
    StorageAdapter,
    // New config types
    ProviderConfig,
    CustomProviderDefinition,
    AIConfigFormProps,
    // Fetcher types
    ModelFetcher,
    FetcherParams,
    FetcherActionType,
} from './types';

// Providers
export {
    PROVIDERS,
    PROVIDER_ID,
    type ProviderId,
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

// Strategies
export {
    type ProviderStrategy,
    strategyRegistry,
    getStrategy
} from './strategies';
