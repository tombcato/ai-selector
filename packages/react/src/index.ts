/**
 * @ai-selector/react
 * React adapter for AI Provider Selector
 */

// Import core styles (will be processed by Tailwind during build)
import '../../core/src/styles.css';

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
} from '@tombcato/ai-selector-core';
