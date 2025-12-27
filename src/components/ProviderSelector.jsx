import { useState, useMemo, useRef, useEffect } from 'react'
import { getProviderList, isIconUrl } from '../lib/providerConfig'
import ProviderIcon from '../icons'

export default function ProviderSelector({ value, onChange, config, baseUrl, onBaseUrlChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [showBaseUrl, setShowBaseUrl] = useState(false)
    const dropdownRef = useRef(null)

    // 点击外部关闭弹框
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // 根据配置获取 provider 列表
    const allProviders = useMemo(() => getProviderList(config), [config])

    // 当前选中的 provider
    const selected = useMemo(() =>
        allProviders.find(p => p.id === value) || null,
        [allProviders, value]
    )

    // 渲染图标（支持 URL 或本地 SVG）
    const renderIcon = (provider, className = "w-5 h-5") => {
        if (isIconUrl(provider.icon)) {
            return <img src={provider.icon} alt={provider.name} className={className} />
        }
        return <ProviderIcon id={provider.icon || provider.id} className={className} />
    }

    return (
        <div className="space-y-3" ref={dropdownRef}>
            {/* Provider Field */}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                    Provider
                </label>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex h-9 w-full min-w-0 items-center justify-between whitespace-nowrap rounded-md border border-gray-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                    >
                        {selected ? (
                            <span className="flex items-center gap-2 min-w-0">
                                {renderIcon(selected, "w-4 h-4 flex-shrink-0")}
                                <span className="truncate">{selected.name}</span>
                            </span>
                        ) : (
                            <span className="text-gray-500 dark:text-zinc-500 truncate">选择 Provider...</span>
                        )}
                        <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md">
                            <div className="max-h-[300px] overflow-y-auto p-1">
                                {allProviders.map(provider => (
                                    <button
                                        key={provider.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(provider.id)
                                            setIsOpen(false)
                                        }}
                                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm transition-colors ${value === provider.id
                                            ? 'bg-zinc-100 dark:bg-zinc-800'
                                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                    >
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {renderIcon(provider, "w-4 h-4 flex-shrink-0")}
                                            <span className="text-gray-900 dark:text-white whitespace-nowrap font-medium">{provider.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-zinc-600 truncate ml-auto flex-1 text-right min-w-0">{provider.baseUrl?.replace('https://', '')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Base URL 折叠 */}
            {selected && (
                <>
                    <button
                        type="button"
                        onClick={() => setShowBaseUrl(!showBaseUrl)}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
                    >
                        <svg className={`w-3 h-3 transition-transform ${showBaseUrl ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        自定义 Base URL
                    </button>

                    <div
                        className="grid transition-all duration-200 ease-out"
                        style={{ gridTemplateRows: showBaseUrl ? '1fr' : '0fr' }}
                    >
                        <div className="overflow-hidden">
                            <input
                                type="text"
                                value={baseUrl}
                                onChange={(e) => onBaseUrlChange(e.target.value)}
                                placeholder={selected.baseUrl}
                                className="flex h-9 w-full rounded-md border border-gray-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
