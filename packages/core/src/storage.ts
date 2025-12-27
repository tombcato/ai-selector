/**
 * AI Provider Selector - Storage Utilities
 * Abstraction layer for config persistence
 */

import type { AIConfig, StorageAdapter } from './types';

const STORAGE_KEY = 'ai_provider_config';

/**
 * Default localStorage adapter
 */
export const localStorageAdapter: StorageAdapter = {
    get: (key: string) => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(key);
    },
    set: (key: string, value: string) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, value);
    },
    remove: (key: string) => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    },
};

/**
 * Create a config storage instance
 */
export function createConfigStorage(adapter: StorageAdapter = localStorageAdapter) {
    return {
        /**
         * Save AI config
         */
        save(config: AIConfig): void {
            adapter.set(STORAGE_KEY, JSON.stringify(config));
        },

        /**
         * Load AI config
         */
        load(): AIConfig | null {
            const raw = adapter.get(STORAGE_KEY);
            if (!raw) return null;
            try {
                return JSON.parse(raw) as AIConfig;
            } catch {
                return null;
            }
        },

        /**
         * Clear AI config
         */
        clear(): void {
            adapter.remove(STORAGE_KEY);
        },
    };
}
