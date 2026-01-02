import { useRef, useEffect, useState } from 'react';
import type { Model, Provider, Language } from '@tombcato/ai-selector-core';
import { I18N } from '@tombcato/ai-selector-core';
import { SmartText } from './SmartText';

interface ModelSelectProps {
    provider: Provider | null;
    models: Model[];
    selectedModelId: string;
    onSelect: (modelId: string, modelName?: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    hasApiKey: boolean;
    disabled?: boolean;
    language?: Language;
    isFetchingModels?: boolean;
    fetchModelError?: string | null;
    selectedModelName?: string;
}

export function ModelSelect({
    provider,
    models,
    selectedModelId,
    onSelect,
    isOpen,
    setIsOpen,
    hasApiKey,
    disabled,
    language = 'zh',
    isFetchingModels,
    fetchModelError,
    selectedModelName
}: ModelSelectProps) {
    const t = I18N[language];
    const triggerRef = useRef<HTMLDivElement>(null);
    const [modelSearch, setModelSearch] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 200);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setModelSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    const filteredModels = models.filter(m =>
        m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
        m.id.toLowerCase().includes(modelSearch.toLowerCase())
    );

    const activeModelName = models.find(m => m.id === selectedModelId)?.name || selectedModelName || selectedModelId;

    return (
        <div className="apmsu-field" ref={triggerRef}>
            <label className="apmsu-label flex items-center justify-between">
                <span>{t.modelLabel}</span>
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && provider && setIsOpen(!isOpen)}
                    disabled={disabled || !provider}
                    className="apmsu-select-trigger"
                >
                    <SmartText
                        text={activeModelName}
                        placeholder={t.selectModel}
                    />
                    <ChevronIcon isOpen={isOpen} />
                </button>

                <div className={`apmsu-dropdown origin-top ${isOpen ? 'apmsu-dropdown-open' : ''}`}>
                    <div className="p-1.5 apmsu-divider">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={modelSearch}
                            onChange={(e) => setModelSearch(e.target.value)}
                            placeholder={t.searchModel}
                            className="apmsu-select-trigger"
                        />
                    </div>
                    <div className="max-h-60 overflow-auto">
                        {/* Custom model option */}
                        {modelSearch && !filteredModels.some(m => m.id === modelSearch) && (
                            <button
                                type="button"
                                onClick={() => {
                                    onSelect(modelSearch);
                                    setIsOpen(false);
                                    setModelSearch('');
                                }}
                                className="apmsu-dropdown-item bg-blue-50 dark:bg-blue-900/20 border-b"
                            >
                                <span className="text-blue-500">{t.useCustom}: {modelSearch}</span>
                            </button>
                        )}
                        {filteredModels.map((m: Model) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                    onSelect(m.id, m.name);
                                    setIsOpen(false);
                                    setModelSearch('');
                                }}
                                className={`apmsu-dropdown-item ${selectedModelId === m.id ? 'apmsu-dropdown-item-active' : ''}`}
                            >
                                <span>{m.name}</span>
                            </button>
                        ))}
                        {filteredModels.length === 0 && !modelSearch && (
                            <div className="p-4 text-center apmsu-hint-text">{t.noModels}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Messages Container - only for supportsModelsApi providers */}
            {provider?.supportsModelsApi && (
                <div className="min-h-[20px] flex items-center">
                    {isFetchingModels ? (
                        <p className="apmsu-hint-text animate-pulse">
                            {t.refreshingModels}
                        </p>
                    ) : fetchModelError ? (
                        <p className="apmsu-hint-text dark:text-zinc-500">
                            {t[fetchModelError as keyof typeof t] || fetchModelError}
                        </p>
                    ) : (provider?.needsApiKey && !hasApiKey) ? (
                        <p className="apmsu-hint-text">{t.apiKeyTip}</p>
                    ) : (
                        <p className="apmsu-hint-text">{t.modelListUpdated}</p>
                    )}
                </div>
            )}
        </div>
    );
}

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
        className={`apmsu-chevron ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
