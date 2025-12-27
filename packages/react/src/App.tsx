import { useState, useEffect } from 'react'
import { AIConfigForm } from './index'
import type { AIConfig, TestConnectionResult, ProviderConfig } from '@ai-selector/core'

// 示例配置
const providerConfig: ProviderConfig = {
    mode: 'default',
}

function App() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return false
    })

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark)
    }, [isDark])

    const handleSave = (config: AIConfig) => {
        console.log('配置已保存:', config)
        alert('配置已保存！')
    }

    const handleTestResult = (result: TestConnectionResult) => {
        console.log('测试结果:', result)
    }

    const handleChange = (config: Partial<AIConfig>) => {
        console.log('配置变化:', config)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
            <div className="max-w-2xl mx-auto p-8 space-y-8">
                <header className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-700 bg-clip-text text-transparent">
                            React Adapter Demo
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-500 mt-2">
                            Powered by @ai-selector/react + AIConfigForm 组件
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                        title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
                    >
                        {isDark ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                </header>

                <AIConfigForm
                    proxyUrl="http://localhost:8000"
                    config={providerConfig}
                    title="AI 配置"
                    showPreview
                    saveButtonText="保存配置"
                    onSave={handleSave}
                    onTestResult={handleTestResult}
                    onChange={handleChange}
                />

                <div className="text-xs text-gray-400 dark:text-zinc-500 space-y-1">
                    <p>✨ 一行代码即可集成完整的 AI 配置表单</p>
                    <p>📦 支持通过 JSON 配置自定义 Providers</p>
                    <p>🎨 使用共享样式系统，React/Vue 样式统一</p>
                </div>
            </div>
        </div>
    )
}

export default App
