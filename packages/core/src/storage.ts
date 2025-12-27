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
export interface StorageOptions {
    serialize?: (data: any) => string;
    deserialize?: (data: string) => any;
}

export function createConfigStorage(
    adapter: StorageAdapter = localStorageAdapter,
    options: StorageOptions = {}
) {
    const serialize = options.serialize || JSON.stringify;
    const deserialize = options.deserialize || JSON.parse;

    return {
        /**
         * Save AI config
         */
        save(config: AIConfig): void {
            try {
                const serialized = serialize(config);
                adapter.set(STORAGE_KEY, serialized);
            } catch (e) {
                console.error('Failed to save config:', e);
            }
        },

        /**
         * Load AI config
         */
        load(): AIConfig | null {
            const raw = adapter.get(STORAGE_KEY);
            if (!raw) return null;
            try {
                return deserialize(raw) as AIConfig;
            } catch (e) {
                console.error('Failed to load config:', e);
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

