import { useState, useEffect, useRef } from 'react'
import { AIConfigForm, useAIConfig } from './index'
import type { AIConfig, TestConnectionResult, ProviderConfig } from '@tombcato/ai-selector-core'

// 示例配置
const providerConfig: ProviderConfig = {
    mode: 'default', // 可选值: 'default' | 'customOnly'
    // custom: customProviders as Record<string, CustomProviderDefinition>, //导入自定义provider

    // ========================================================================
    // 场景 1: 只显示指定的 Provider (白名单过滤)
    // ========================================================================
    // include: ['openai', 'anthropic'],
    // exclude: ['gemini'], // 或者使用黑名单过滤

    // ========================================================================
    // 场景 2: 覆盖/添加自定义 Provider
    // ========================================================================
    // custom: {
    //     // 覆盖内置配置
    //     openai: {
    //         name: 'Enterprise OpenAI',
    //         baseUrl: 'https://gateway.company.com/openai/v1',
    //         apiFormat: 'openai',
    //         needsApiKey: true,
    //         models: [{ id: 'gpt-4o', name: 'GPT-4o' }]
    //     },
    //     // 添加新厂商
    //     deepseeksssss: {
    //         name: 'DeepSeekssssss',
    //         baseUrl: 'https://api.deepseek.com',
    //         apiFormat: 'openai',
    //         needsApiKey: true,
    //         icon: 'https://avatars.githubusercontent.com/u/148330874',
    //         models: [{ id: 'deepseek-chat', name: 'DeepSeek Chat' }]
    //     }
    // },


    // ========================================================================
    // 场景 3: 仅显示自定义 Provider
    // ========================================================================
    // mode: 'customOnly',
    // custom: {
    //     'my-private-model': {
    //         name: 'Internal AI',
    //         baseUrl: 'http://localhost:8080/v1',
    //         apiFormat: 'openai',
    //         needsApiKey: false,
    //         icon: 'https://placehold.co/32x32?text=INT',
    //         models: [
    //             { id: 'llama-3-8b', name: 'Llama 3 8B' },
    //             { id: 'mistral-7b', name: 'Mistral 7B' }
    //         ]
    //     }
    // }
}

// 设为空字符串测试纯前端直连模式，设为 'http://localhost:8000' 走后端代理
const PROXY_URL = import.meta.env.VITE_PROXY_URL || ''

// 聊天消息类型
interface Message {
    role: 'user' | 'assistant'
    content: string
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
        setConfigVersion(v => v + 1)  // 触发 ChatDemo 刷新
    }

    const handleTestResult = (result: TestConnectionResult) => {
        console.log('测试结果:', result)
    }

    const handleChange = (config: Partial<AIConfig>) => {
        console.log('配置变化:', config)
    }

    const [lang, setLang] = useState<'zh' | 'en'>('zh');
    const [configVersion, setConfigVersion] = useState(0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
            <div className="max-w-xl mx-auto p-8 space-y-8">
                <header className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-700 bg-clip-text text-transparent">
                            React Adapter Demo
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-500 mt-2">
                            Powered by @tombcato/ai-selector-react + AIConfigForm 组件
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            {lang === 'zh' ? 'English' : '中文'}
                        </button>
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
                    </div>
                </header>

                <AIConfigForm
                    language={lang}
                    proxyUrl={PROXY_URL}
                    config={providerConfig}
                    title="AI Config Form"
                    showPreview
                    onSave={handleSave}
                    onTestResult={handleTestResult}
                    onChange={handleChange}
                />

                <div className="text-xs text-gray-400 dark:text-zinc-500 space-y-1">
                    <p>✨ 一行代码即可集成完整的 AI 配置表单</p>
                    <p>📦 支持通过 JSON 配置自定义 Providers</p>
                    <p>🎨 使用共享样式系统，React/Vue 样式统一</p>
                </div>

                {/* 对话测试区域 */}
                <ChatDemo key={configVersion} proxyUrl={PROXY_URL} />
            </div>
        </div>
    )
}

// ============================================================================
// 对话测试组件
// ============================================================================

function ChatDemo({ proxyUrl }: { proxyUrl?: string }) {
    const aiConfig = useAIConfig({ proxyUrl })
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // 自动滚动到底部
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const canSend = aiConfig.isValid && input.trim() && !isLoading

    const handleSend = async () => {
        if (!canSend) return

        const userMessage = input.trim()
        setInput('')
        setError(null)

        // 添加用户消息
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
        setMessages(newMessages)
        setIsLoading(true)

        try {
            let assistantContent = ''

            if (proxyUrl) {
                // 有代理地址时，走后端
                const response = await fetch(`${proxyUrl}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        provider_id: aiConfig.providerId,
                        api_key: aiConfig.apiKey,
                        model: aiConfig.model,
                        base_url: aiConfig.config.baseUrl,
                        api_format: aiConfig.provider?.apiFormat || 'openai',
                        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                        max_tokens: 2048,
                    }),
                })

                const data = await response.json()
                if (data.success && data.content) {
                    assistantContent = data.content
                } else {
                    setError(data.message || '请求失败')
                }
            } else {
                // 无代理地址时，纯前端直连
                const { sendDirectChat } = await import('@tombcato/ai-selector-core')
                const result = await sendDirectChat({
                    apiFormat: aiConfig.provider?.apiFormat || 'openai',
                    baseUrl: aiConfig.config.baseUrl || aiConfig.provider?.baseUrl || '',
                    apiKey: aiConfig.apiKey,
                    model: aiConfig.model,
                    messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                    maxTokens: 2048,
                })

                if (result.success && result.content) {
                    assistantContent = result.content
                } else {
                    setError(result.message || '请求失败')
                }
            }

            if (assistantContent) {
                setMessages([...newMessages, { role: 'assistant', content: assistantContent }])
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : '网络错误')
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const clearChat = () => {
        setMessages([])
        setError(null)
    }

    return (
        <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                <h2 className="font-semibold text-sm">💬 对话测试</h2>
                <div className="flex items-center gap-2">
                    {aiConfig.isValid ? (
                        <span className="text-xs text-green-600 dark:text-green-400">
                            ✓ {aiConfig.provider?.name} / {aiConfig.model}
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">请先完成上方配置</span>
                    )}
                    {messages.length > 0 && (
                        <button
                            onClick={clearChat}
                            className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                        >
                            清空
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages h-80 overflow-y-auto p-4 space-y-4 bg-white dark:bg-zinc-950">
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-400 dark:text-zinc-600 text-sm">
                        {aiConfig.isValid ? '输入消息开始对话...' : '请先在上方配置 Provider 和 Model'}
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-2xl rounded-bl-md">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-500 text-sm">
                        {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={aiConfig.isValid ? "输入消息... (Enter 发送)" : "请先完成配置"}
                    disabled={!aiConfig.isValid || isLoading}
                    rows={1}
                    className="flex-1 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-zinc-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default App
