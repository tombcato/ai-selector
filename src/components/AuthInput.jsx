import { useState, useEffect, useMemo, useRef } from 'react'
import { resolveProviderConfig } from '../lib/providerConfig'

const PROXY_URL = 'http://localhost:8000'

const AUTH_LABELS = {
    'bearer': 'API Key',
    'x-api-key': 'API Key',
    'query-param': 'API Key',
    'none': '无需认证'
}

export default function AuthInput({
    providerId,
    apiKey,
    baseUrl,
    model,
    onApiKeyChange,
    config
}) {
    const [status, setStatus] = useState('idle') // idle | testing | success | error
    const [errorMsg, setErrorMsg] = useState(null)
    const debounceRef = useRef(null)
    const lastTestedRef = useRef('')

    // 从配置获取 provider
    const { providers } = useMemo(() => resolveProviderConfig(config), [config])
    const provider = providerId ? providers[providerId] : null

    // 切换 provider 时重置状态
    useEffect(() => {
        setStatus('idle')
        setErrorMsg(null)
        lastTestedRef.current = ''
    }, [providerId])

    // 防抖自动测试
    useEffect(() => {
        if (!provider || provider.authType === 'none') return
        if (!apiKey || apiKey.length < 3) {
            setStatus('idle')
            setErrorMsg(null)
            return
        }

        // 组合 key：apiKey + baseUrl，任一变化都重新测试
        const testKey = `${apiKey}|${baseUrl || ''}`
        if (testKey === lastTestedRef.current) return

        // 清除之前的定时器
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        // 1秒防抖
        debounceRef.current = setTimeout(() => {
            runTest()
        }, 1000)

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [apiKey, provider, baseUrl, model])

    const runTest = async () => {
        if (!provider) return

        console.log('开始测试连接...', { providerId, apiKey, baseUrl })
        lastTestedRef.current = `${apiKey}|${baseUrl || ''}`
        setStatus('testing')
        setErrorMsg(null)

        try {
            const res = await fetch(`${PROXY_URL}/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider_id: providerId,
                    api_key: apiKey,
                    model: model || null,
                    base_url: baseUrl || null,
                    api_format: provider.apiFormat,
                })
            })

            const data = await res.json()
            console.log('测试结果:', data)

            if (data.success) {
                setStatus('success')
            } else {
                setStatus('error')
                setErrorMsg(data.message || '连接失败')
            }
        } catch (err) {
            console.error('测试出错:', err)
            setStatus('error')
            setErrorMsg(err.message || '网络错误')
        }
    }

    if (!provider) {
        return (
            <div className="py-3 px-4 bg-gray-50 dark:bg-zinc-800/50 rounded-md border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-500 text-center text-sm">
                请先选择 Provider
            </div>
        )
    }

    const authType = provider.authType
    const needsApiKey = authType !== 'none'

    // 输入框边框颜色
    const getBorderClass = () => {
        switch (status) {
            case 'success': return 'border-green-500 dark:border-green-600 focus-visible:ring-green-500'
            case 'error': return 'border-red-400 dark:border-red-600 focus-visible:ring-red-500'
            default: return 'border-gray-200 dark:border-zinc-800 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600'
        }
    }



    return (
        <div className="space-y-2">
            {/* API Key Field */}
            {needsApiKey && (
                <>
                    <label className="text-sm font-medium leading-none">
                        {AUTH_LABELS[authType] || 'API Key'}
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => onApiKeyChange(e.target.value)}
                            placeholder={`输入 ${provider.name} API Key...`}
                            className={`flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 pr-10 transition-colors ${getBorderClass()}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            {status === 'testing' && (
                                <svg className="w-4 h-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {status === 'success' && (
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            )}
                            {status === 'error' && (
                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                            )}
                            {status === 'idle' && apiKey && (
                                <button
                                    type="button"
                                    onClick={runTest}
                                    className="p-1 -m-1 text-gray-400 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                    title="点击测试连通性"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            )}
                        </span>
                    </div>

                    {/* 错误信息 - 带动画 */}
                    <div
                        className="grid transition-all duration-200 ease-out"
                        style={{ gridTemplateRows: errorMsg ? '1fr' : '0fr' }}
                    >
                        <div className="overflow-hidden">
                            <div className="pt-1 text-xs text-red-500 dark:text-red-400 space-y-0.5">
                                <p>连通性测试失败，请检查 API Key 的有效性</p>
                                <p className="text-red-400 dark:text-red-500 line-clamp-2">{errorMsg}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* 无需认证提示 */}
            {!needsApiKey && (
                <div className="py-2 px-3 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="truncate min-w-0">{provider.name} 无需 API Key</span>
                </div>
            )}
        </div>
    )
}
