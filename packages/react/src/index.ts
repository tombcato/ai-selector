/**
 * @ai-selector/react
 * React adapter for AI Provider Selector
 */

// Hook
export { useAIConfig, type UseAIConfigOptions } from './useAIConfig';

// Component
export { AIConfigForm, type AIConfigFormProps } from './AIConfigForm';

// Re-export core types for convenience
export type {
    AIConfig,
    Provider,
    Model,
    ProviderConfig,
    CustomProviderDefinition,
    TestConnectionResult,
} from '@ai-selector/core';
