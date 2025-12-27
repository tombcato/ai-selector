import { useState, useEffect, useMemo } from 'react'
import { resolveProviderConfig } from '../lib/providerConfig'

// 后端代理地址
const PROXY_URL = 'http://localhost:8000'

export default function ConnectionTester({
    providerId,
    apiKey,
    model,
    baseUrl,
    testConnection, // IoC: 外部注入的测试函数 (可选)
    config,
}) {
    const [status, setStatus] = useState('idle') // idle | testing | success | error
    const [errorMsg, setErrorMsg] = useState(null)

    // 从配置获取 provider
    const { providers } = useMemo(() => resolveProviderConfig(config), [config])
    const provider = providerId ? providers[providerId] : null

    // 成功/失败后自动恢复 idle 状态（错误信息保留）
    useEffect(() => {
        if (status === 'success' || status === 'error') {
            const timer = setTimeout(() => {
                setStatus('idle')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [status])

    // 切换 provider 时清除错误
    useEffect(() => {
        setErrorMsg(null)
        setStatus('idle')
    }, [providerId])

    const handleTest = async () => {
        if (!provider) return

        setStatus('testing')
        setErrorMsg(null)

        try {
            // 优先使用外部注入的测试函数
            if (testConnection) {
                await testConnection({
                    providerId,
                    apiKey,
                    model,
                    baseUrl: baseUrl || provider.baseUrl,
                    authType: provider.authType,
                    apiFormat: provider.apiFormat
                })
                setStatus('success')
            } else {
                // 使用后端代理测试
                const res = await fetch(`${PROXY_URL}/test`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        provider_id: providerId,
                        api_key: apiKey,
                        model: model,
                        base_url: baseUrl || null,
                        api_format: provider.apiFormat,
                    })
                })

                const data = await res.json()

                if (data.success) {
                    setStatus('success')
                } else {
                    setStatus('error')
                    setErrorMsg(data.message || '连接失败')
                }
            }
        } catch (err) {
            setStatus('error')
            setErrorMsg(err.message || '连接失败 (后端服务未启动？)')
        }
    }

    const canTest = provider && (provider.authType === 'none' || apiKey)

    // 按钮样式和内容
    const getButtonContent = () => {
        switch (status) {
            case 'testing':
                return (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        测试中...
                    </>
                )
            case 'success':
                return (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        连接成功
                    </>
                )
            case 'error':
                return (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        连接失败
                    </>
                )
            default:
                return (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        测试连通性
                    </>
                )
        }
    }

    const getButtonClass = () => {
        const base = 'w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2'
        if (!canTest) return `${base} bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed`
        if (status === 'testing') return `${base} bg-blue-600 text-white cursor-wait`
        if (status === 'success') return `${base} bg-green-600 text-white`
        if (status === 'error') return `${base} bg-red-600 text-white`
        return `${base} bg-blue-600 hover:bg-blue-500 text-white`
    }

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={handleTest}
                disabled={!canTest || status === 'testing'}
                className={getButtonClass()}
            >
                {getButtonContent()}
            </button>

            {/* 错误信息持久显示 */}
            {errorMsg && (
                <div className="p-3 rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-300/50 dark:border-red-700/50 text-red-600 dark:text-red-400 text-sm">
                    {errorMsg}
                </div>
            )}

            {/* 后端提示 */}
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                需运行后端: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">python backend/server.py</code>
            </p>
        </div>
    )
}
