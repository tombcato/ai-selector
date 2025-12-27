import { useState, useEffect, useMemo } from 'react'
import ProviderSelector from './components/ProviderSelector'
import AuthInput from './components/AuthInput'
import ModelSelector from './components/ModelSelector'
import { saveConfig, loadConfig } from './lib/storage'
import { resolveProviderConfig } from './lib/providerConfig'

// 示例：Provider 配置
// 可以通过 mode/include/exclude/custom 灵活配置
const PROVIDER_CONFIG = {
    // mode: 'default',              // 'default' | 'custom-only'
    // include: ['openai', 'anthropic'],  // 白名单（仅 mode=default）
    // exclude: ['ollama'],          // 黑名单（仅 mode=default）
    // custom: {}                    // 自定义 provider
}

export default function App() {
    const [providerId, setProviderId] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [baseUrl, setBaseUrl] = useState('')
    const [model, setModel] = useState('')
    const [saveStatus, setSaveStatus] = useState('')
    const [theme, setTheme] = useState(() =>
        localStorage.getItem('theme') || 'dark'
    )

    // 主题切换
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    // 启动时加载配置
    useEffect(() => {
        const config = loadConfig()
        if (config) {
            setProviderId(config.providerId || '')
            setApiKey(config.apiKey || '')
            setBaseUrl(config.baseUrl || '')
            setModel(config.model || '')
        }
    }, [])

    // Provider 变更时重置 model 和 apiKey
    useEffect(() => {
        setModel('')
        setApiKey('')
    }, [providerId])

    const handleSave = () => {
        const success = saveConfig({ providerId, apiKey, baseUrl, model })
        setSaveStatus(success ? 'saved' : 'error')
        setTimeout(() => setSaveStatus(''), 2000)
    }

    // 使用配置系统获取 provider
    const { providers } = useMemo(() => resolveProviderConfig(PROVIDER_CONFIG), [])
    const provider = providerId ? providers[providerId] : null

    return (
        <div className="min-h-screen min-w-[220px] bg-gray-50/50 dark:bg-zinc-950 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-gray-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between">
                    <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white truncate">
                        AI Provider Selector
                    </h1>
                    <div className="flex items-center gap-2">
                        {/* 主题切换按钮 */}
                        <button
                            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                            )}
                        </button>
                        <span className="text-xs text-gray-400 dark:text-zinc-600 font-medium">v0.1.0</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-2xl mx-auto px-4 py-8">
                {/* Card Container */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-soft-lg p-5 space-y-4">

                    {/* Provider + Base URL */}
                    <ProviderSelector
                        value={providerId}
                        onChange={setProviderId}
                        config={PROVIDER_CONFIG}
                        baseUrl={baseUrl}
                        onBaseUrlChange={setBaseUrl}
                    />

                    {/* Auth & Model Collapsible Section */}
                    <div className={`transition-all duration-500 ease-in-out ${providerId ? 'max-h-[1000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <div className="space-y-4">
                            <AuthInput
                                providerId={providerId}
                                apiKey={apiKey}
                                baseUrl={baseUrl}
                                model={model}
                                onApiKeyChange={setApiKey}
                                config={PROVIDER_CONFIG}
                            />

                            <ModelSelector
                                providerId={providerId}
                                apiKey={apiKey}
                                baseUrl={baseUrl}
                                value={model}
                                onChange={setModel}
                                config={PROVIDER_CONFIG}
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div>
                        <button
                            onClick={handleSave}
                            disabled={!providerId || !model || (provider?.authType !== 'none' && !apiKey)}
                            className={`inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 shadow-sm ${saveStatus === 'saved'
                                ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 ring-offset-green-600'
                                : 'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 ring-offset-white dark:ring-offset-zinc-950 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300'
                                }`}
                        >
                            {saveStatus === 'saved' ? (
                                <div className="flex items-center animate-in fade-in zoom-in duration-200">
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    保存成功
                                </div>
                            ) : (
                                "保存配置"
                            )}
                        </button>
                    </div>
                </div>

                {/* Config Preview */}
                {provider && (
                    <div className="mt-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 border border-gray-200/50 dark:border-zinc-800">
                        <h3 className="text-xs font-medium text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wider">配置预览</h3>
                        <pre className="text-xs text-gray-600 dark:text-zinc-400 font-mono overflow-x-auto leading-relaxed">
                            {JSON.stringify({
                                provider: provider.name,
                                apiFormat: provider.apiFormat,
                                baseUrl: baseUrl || provider.baseUrl,
                                model: model || '(未选择)',
                                hasApiKey: !!apiKey
                            }, null, 2)}
                        </pre>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200/50 dark:border-zinc-800/50 mt-12">
                <div className="max-w-2xl mx-auto px-6 py-4 text-center text-xs text-gray-400 dark:text-zinc-600">
                    Based on <a href="https://github.com/BerriAI/litellm" className="text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-400 transition-colors">LiteLLM</a> provider data
                </div>
            </footer>
        </div>
    )
}
