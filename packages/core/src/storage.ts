/**
 * AI Provider Selector - Storage Utilities
 * Abstraction layer for config persistence
 */

import CryptoJS from 'crypto-js';
import type { AIConfig, StorageAdapter } from './types';

const STORAGE_KEY = 'ai_provider_config';

// 默认加密密钥（可在初始化时自定义）
const DEFAULT_SECRET = 'aiselector';

// AES 加密/解密
function encrypt(str: string, secret: string = DEFAULT_SECRET): string {
    try {
        return CryptoJS.AES.encrypt(str, secret).toString();
    } catch {
        return str;
    }
}

function decrypt(str: string, secret: string = DEFAULT_SECRET): string {
    try {
        const bytes = CryptoJS.AES.decrypt(str, secret);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
        return str;
    }
}

/**
 * 加密存储适配器（默认）
 * 使用 AES 加密存储，防止 API Key 明文泄露
 */
export const encryptedStorageAdapter: StorageAdapter = {
    get: (key: string) => {
        if (typeof window === 'undefined') return null;
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            return decrypt(encrypted);
        } catch {
            return null;
        }
    },
    set: (key: string, value: string) => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, encrypt(value));
        } catch {
            // ignore
        }
    },
    remove: (key: string) => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    },
};

/**
 * 明文存储适配器（不推荐）
 */
export const plainStorageAdapter: StorageAdapter = {
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

/** @deprecated 使用 encryptedStorageAdapter 或 plainStorageAdapter */
export const localStorageAdapter = plainStorageAdapter;

/** 默认存储适配器（加密） */
export const defaultStorageAdapter = encryptedStorageAdapter;

/**
 * Create a config storage instance
 */
export interface StorageOptions {
    serialize?: (data: any) => string;
    deserialize?: (data: string) => any;
}

export function createConfigStorage(
    adapter: StorageAdapter = defaultStorageAdapter,
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

