/**
 * @ai-selector/vue
 * Vue adapter for AI Provider Selector
 */

// Import core styles (will be processed by Tailwind during build)
import '../../core/src/styles.css';

// Composable
export { useAIConfig, type UseAIConfigOptions } from './useAIConfig';

// Component
export { default as AIConfigForm } from './AIConfigForm.vue';

// Re-export core types for convenience
export type {
    AIConfig,
    Provider,
    Model,
    ProviderConfig,
    CustomProviderDefinition,
    TestConnectionResult,
    AIConfigFormProps,
} from '@tombcato/ai-selector-core';
