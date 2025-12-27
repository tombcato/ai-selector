/**
 * Provider 配置处理模块
 * 
 * 根据用户配置解析和合并 provider 列表
 */

import defaultProviders from '../data/provider-meta.json'
import defaultModels from '../data/static-models.json'

/**
 * 解析配置并返回最终的 providers 和 models
 * 
 * @param {Object} config - 用户配置
 * @param {string} config.mode - "default" | "custom-only"
 * @param {string[]} config.include - 白名单（mode=default 时）
 * @param {string[]} config.exclude - 黑名单（mode=default 时）
 * @param {Object} config.custom - 自定义 provider 配置
 * @returns {{ providers: Object, models: Object }}
 */
export function resolveProviderConfig(config = {}) {
    const {
        mode = 'default',
        include = [],
        exclude = [],
        custom = {}
    } = config

    let providers = {}
    let models = {}

    if (mode === 'custom-only') {
        // 完全自定义模式：只使用 custom 中的 provider
        Object.entries(custom).forEach(([id, provider]) => {
            providers[id] = {
                id,
                ...provider,
            }
            if (provider.models) {
                models[id] = provider.models
            }
        })
    } else {
        // default 模式：基于默认 provider 进行筛选
        let providerIds = Object.keys(defaultProviders)

        if (include.length > 0) {
            // 白名单模式：只使用 include 中的
            providerIds = providerIds.filter(id => include.includes(id))
        } else if (exclude.length > 0) {
            // 黑名单模式：排除 exclude 中的
            providerIds = providerIds.filter(id => !exclude.includes(id))
        }

        // 添加筛选后的默认 provider
        providerIds.forEach(id => {
            providers[id] = defaultProviders[id]
            if (defaultModels[id]) {
                models[id] = defaultModels[id]
            }
        })

        // 合并自定义 provider
        Object.entries(custom).forEach(([id, provider]) => {
            providers[id] = {
                id,
                ...provider,
            }
            if (provider.models) {
                models[id] = provider.models
            }
        })
    }

    return { providers, models }
}

/**
 * 获取 provider 列表（数组形式，用于渲染）
 */
export function getProviderList(config) {
    const { providers } = resolveProviderConfig(config)
    return Object.values(providers)
}

/**
 * 获取指定 provider 的模型列表
 */
export function getModelList(config, providerId) {
    const { models } = resolveProviderConfig(config)
    return models[providerId] || []
}

/**
 * 检查 icon 是否为 URL
 */
export function isIconUrl(icon) {
    return icon && (icon.startsWith('http://') || icon.startsWith('https://'))
}
