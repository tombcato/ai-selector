import { useState, useEffect, useMemo, useRef } from 'react'
import { resolveProviderConfig } from '../lib/providerConfig'

// 后端代理地址
const PROXY_URL = 'http://localhost:8000'

// 模型列表缓存 (内存缓存，页面刷新后清空)
const modelsCache = new Map()

export default function ModelSelector({
    providerId,
    apiKey,
    baseUrl,
    value,
    onChange,
    fetchModels,
    config  // 新增：支持配置
}) {
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const dropdownRef = useRef(null)

    // 点击外部关闭弹框
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
                setSearch('')
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // 从配置获取 providers 和 models
    const { providers, models: configModels } = useMemo(() => resolveProviderConfig(config), [config])
    const provider = providerId ? providers[providerId] : null
    const staticModels = configModels

    // 过滤模型列表
    const filteredModels = useMemo(() =>
        models.filter(m =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.id.toLowerCase().includes(search.toLowerCase())
        ), [models, search]
    )

    // 生成缓存 key
    const getCacheKey = () => `${providerId}|${apiKey || ''}|${baseUrl || ''}`

    useEffect(() => {
        if (!providerId) {
            setModels([])
            return
        }

        // 检查缓存
        const cacheKey = getCacheKey()
        if (modelsCache.has(cacheKey)) {
            console.log('使用缓存的模型列表:', cacheKey)
            setModels(modelsCache.get(cacheKey))
            setError(null)
            return
        }

        if (fetchModels) {
            setLoading(true)
            setError(null)
            fetchModels(providerId, apiKey)
                .then(data => {
                    setModels(data)
                    modelsCache.set(getCacheKey(), data) // 写入缓存
                    setLoading(false)
                })
                .catch(err => {
                    console.warn('动态获取模型失败，使用静态列表:', err)
                    setModels(staticModels[providerId] || [])
                    setError('使用离线列表')
                    setLoading(false)
                })
            return
        }

        if (provider?.supportsModelsApi && apiKey) {
            setLoading(true)
            setError(null)

            fetch(`${PROXY_URL}/models`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider_id: providerId,
                    api_key: apiKey,
                    base_url: baseUrl || null,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.models.length > 0) {
                        setModels(data.models)
                        modelsCache.set(getCacheKey(), data.models) // 写入缓存
                        setError(null)
                    } else {
                        setModels(staticModels[providerId] || [])
                        setError('获取列表失败，使用离线模型列表')
                    }
                    setLoading(false)
                })
                .catch(err => {
                    console.warn('后端获取模型失败:', err)
                    setModels(staticModels[providerId] || [])
                    setError('获取列表失败，使用离线模型列表')
                    setLoading(false)
                })
        } else {
            setModels(staticModels[providerId] || [])
            setError(apiKey ? null : '输入 Key 后可获取完整列表')
        }
    }, [providerId, apiKey, baseUrl, fetchModels, provider?.supportsModelsApi])

    const selected = models.find(m => m.id === value)

    if (!providerId) {
        return (
            <div className="p-4 bg-gray-100/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-500 text-center">
                请先选择 Provider
            </div>
        )
    }

    return (
        <div className="space-y-2" ref={dropdownRef}>
            {/* Field Label */}
            <label className="text-sm font-medium leading-none">
                Model
            </label>

            {/* Select Container */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={loading}
                    className="flex h-9 w-full min-w-0 items-center justify-between whitespace-nowrap rounded-md border border-gray-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center gap-2 text-gray-500 dark:text-zinc-500 min-w-0">
                            <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span className="truncate">加载模型...</span>
                        </span>
                    ) : selected ? (
                        <span className="truncate">{selected.name}</span>
                    ) : value ? (
                        <span className="truncate block w-full text-left">{value} <span className="text-xs text-gray-500">(自定义)</span></span>
                    ) : (
                        <span className="text-gray-500 dark:text-zinc-500 truncate">选择 Model...</span>
                    )}
                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                </button>

                {isOpen && !loading && (
                    <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md">
                        {/* 搜索框 */}
                        <div className="p-1.5 border-b border-gray-100 dark:border-zinc-800">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="搜索模型..."
                                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                autoFocus
                            />
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {/* 自定义模型选项 - 当有搜索词且无完全匹配时显示 */}
                            {search && !filteredModels.some(m => m.id === search) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(search)
                                        setIsOpen(false)
                                        setSearch('')
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20"
                                >
                                    <div className="font-medium text-blue-500 dark:text-blue-400">使用自定义模型</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{search}</div>
                                </button>
                            )}
                            {filteredModels.length === 0 && !search ? (
                                <div className="p-4 text-center text-gray-500">暂无模型数据</div>
                            ) : (
                                filteredModels.map(model => (
                                    <button
                                        key={model.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(model.id)
                                            setIsOpen(false)
                                            setSearch('')
                                        }}
                                        className={`w-full flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${value === model.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                                    >
                                        <span className="font-medium">{model.name}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Field Description */}
            {error && (
                <p className="text-xs text-gray-400 dark:text-gray-500 pb-1">{error}</p>
            )}
        </div>
    )
}
