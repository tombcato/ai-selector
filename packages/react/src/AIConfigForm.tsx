import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { useAIConfig } from './useAIConfig';
import { I18N, type Language, type AIConfig, type AIConfigFormProps, type TestConnectionResult, type Provider, type Model } from '@ai-selector/core';

// Re-export props type
export type { AIConfigFormProps };

// Event handler types
type OnSaveHandler = (config: AIConfig) => void;
type OnTestResultHandler = (result: TestConnectionResult) => void;
type OnChangeHandler = (config: Partial<AIConfig>) => void;

interface Props extends AIConfigFormProps {
    onSave?: OnSaveHandler;
    onTestResult?: OnTestResultHandler;
    onChange?: OnChangeHandler;
    /** Callback to serialize config before storage (e.g. for encryption) */
    onSerialize?: (data: any) => string;
    /** Callback to deserialize config from storage (e.g. for decryption) */
    onDeserialize?: (data: string) => any;
    /** Interface language (default: 'zh') */
    language?: Language;
}

export function AIConfigForm({
    proxyUrl,
    config: providerConfig,
    initialConfig,
    title,
    showPreview = false,
    saveButtonText,
    disabled = false,
    onSave,
    onTestResult,
    onChange,
    onSerialize,
    onDeserialize,
    language = 'zh',
}: Props) {
    const t = useMemo(() => I18N[language], [language]);

    const {
        providerId,
        apiKey,
        model,
        baseUrl,
        models,
        testStatus,
        testResult,
        provider,
        providers,
        isValid,
        setProviderId,
        setApiKey,
        setModel,
        setBaseUrl,
        runTest,
        save,
        config: currentConfig,
    } = useAIConfig({
        proxyUrl,
        providerConfig,
        initialConfig,
        onSerialize,
        onDeserialize,
    });

    const [providerOpen, setProviderOpen] = useState(false);
    const [modelOpen, setModelOpen] = useState(false);
    const [modelSearch, setModelSearch] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
    const [showBaseUrl, setShowBaseUrl] = useState(false);

    const providerRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (providerRef.current && !providerRef.current.contains(e.target as Node)) {
                setProviderOpen(false);
            }
            if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
                setModelOpen(false);
                setModelSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Notify parent of changes
    useEffect(() => {
        onChange?.({ providerId, apiKey, model, baseUrl });
    }, [providerId, apiKey, model, baseUrl, onChange]);

    // Notify parent of test results
    useEffect(() => {
        if (testResult) {
            onTestResult?.(testResult);
        }
    }, [testResult, onTestResult]);

    // Auto-test on key change (debounced)
    useEffect(() => {
        if (!provider || provider.authType === 'none' || !apiKey || apiKey.length < 3) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            runTest();
        }, 1000);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [apiKey, provider, runTest]);

    // Filter models
    const filteredModels = models.filter(m =>
        m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
        m.id.toLowerCase().includes(modelSearch.toLowerCase())
    );

    // Handle save
    const handleSave = useCallback(() => {
        save();
        setSaveStatus('saved');
        onSave?.(currentConfig);
        setTimeout(() => setSaveStatus('idle'), 2000);
    }, [save, onSave, currentConfig]);

    // Get input class based on status
    const getInputClass = () => {
        if (testStatus === 'success') return 'apmsu-input apmsu-input-success';
        if (testStatus === 'error') return 'apmsu-input apmsu-input-error';
        return 'apmsu-input apmsu-input-default';
    };

    return (
        <div className="apmsu-card">
            {title && (
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
            )}

            <div className="space-y-3">
                {/* Provider Selector */}
                <div className="space-y-2" ref={providerRef}>
                    <label className="apmsu-label">Provider</label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => !disabled && setProviderOpen(!providerOpen)}
                            disabled={disabled}
                            className="apmsu-select-trigger"
                        >
                            {provider ? (
                                <span className="flex items-center gap-2 min-w-0">
                                    <img
                                        src={provider.icon}
                                        alt={provider.name}
                                        className="apmsu-provider-icon"
                                    />
                                    <span className="truncate">{provider.name}</span>
                                </span>
                            ) : (
                                <span className="text-gray-500 dark:text-zinc-500">{t.selectProvider}</span>
                            )}
                            <ChevronIcon />
                        </button>

                        {providerOpen && (
                            <div className="apmsu-dropdown max-h-[300px] overflow-auto p-1">
                                {providers.map((p: Provider) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => {
                                            setProviderId(p.id);
                                            setProviderOpen(false);
                                        }}
                                        className={`apmsu-dropdown-item rounded-sm ${providerId === p.id ? 'apmsu-dropdown-item-active' : ''}`}
                                    >
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <img
                                                src={p.icon}
                                                alt={p.name}
                                                className="apmsu-provider-icon"
                                            />
                                            <span className="font-medium whitespace-nowrap">{p.name}</span>
                                        </div>
                                        <span className="apmsu-hint-text ml-auto text-right truncate flex-1 min-w-0">
                                            {p.baseUrl.replace('https://', '')}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Base URL 折叠 */}
                {provider && (
                    <>
                        <button
                            type="button"
                            onClick={() => setShowBaseUrl(!showBaseUrl)}
                            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
                        >
                            <svg
                                className={`w-3 h-3 transition-transform ${showBaseUrl ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {t.customBaseUrl}
                        </button>

                        <div
                            className="grid transition-all duration-200 ease-out"
                            style={{ gridTemplateRows: showBaseUrl ? '1fr' : '0fr' }}
                        >
                            <div className="overflow-hidden">
                                <input
                                    type="text"
                                    value={baseUrl}
                                    onChange={(e) => setBaseUrl(e.target.value)}
                                    placeholder={provider.baseUrl}
                                    disabled={disabled}
                                    className="apmsu-input apmsu-input-default"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Auth & Model Collapsible Section */}
                <div className={`transition-all duration-500 ease-in-out ${providerId ? 'max-h-[1000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="space-y-4">
                        {/* API Key Input (if needed) */}
                        {provider && provider.authType !== 'none' && (
                            <div className="space-y-2">
                                <label className="apmsu-label">API Key</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder={t.apiKeyPlaceholder}
                                        disabled={disabled}
                                        className={`${getInputClass()} pr-10`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                        {testStatus === 'testing' && <SpinnerIcon />}
                                        {testStatus === 'success' && <CheckIcon />}
                                        {testStatus === 'error' && <ErrorIcon />}
                                        {testStatus === 'idle' && apiKey && (
                                            <button
                                                type="button"
                                                onClick={() => runTest()}
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

                                {/* Error Message with Animation */}
                                <div
                                    className="grid transition-all duration-200 ease-out"
                                    style={{ gridTemplateRows: testStatus === 'error' && testResult?.message ? '1fr' : '0fr' }}
                                >
                                    <div className="overflow-hidden">
                                        <div className="pt-1 text-xs space-y-0.5">
                                            <p className="text-red-500 dark:text-red-400 font-medium">{t.testFailed}</p>
                                            <p className="text-red-500/80 dark:text-red-400/80 line-clamp-2">{testResult?.message}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Model Selector */}
                        <div className="space-y-2" ref={modelRef}>
                            <label className="apmsu-label">Model</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => !disabled && providerId && setModelOpen(!modelOpen)}
                                    disabled={disabled || !providerId}
                                    className="apmsu-select-trigger"
                                >
                                    {model ? (
                                        <span className="truncate">
                                            {models.find((m: Model) => m.id === model)?.name || model}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 dark:text-zinc-500">{t.selectModel}</span>
                                    )}
                                    <ChevronIcon />
                                </button>

                                {modelOpen && (
                                    <div className="apmsu-dropdown">
                                        <div className="p-1.5 border-b border-gray-100 dark:border-zinc-800">
                                            <input
                                                type="text"
                                                value={modelSearch}
                                                onChange={(e) => setModelSearch(e.target.value)}
                                                placeholder={t.searchModel}
                                                className="apmsu-input apmsu-input-default"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="max-h-60 overflow-auto">
                                            {/* Custom model option */}
                                            {modelSearch && !filteredModels.some(m => m.id === modelSearch) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setModel(modelSearch);
                                                        setModelOpen(false);
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
                                                        setModel(m.id);
                                                        setModelOpen(false);
                                                        setModelSearch('');
                                                    }}
                                                    className={`apmsu-dropdown-item ${model === m.id ? 'apmsu-dropdown-item-active' : ''}`}
                                                >
                                                    <span>{m.name}</span>
                                                </button>
                                            ))}
                                            {filteredModels.length === 0 && !modelSearch && (
                                                <div className="p-4 text-center apmsu-hint-text">{t.noModels}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!apiKey && provider?.authType !== 'none' && (
                                <p className="apmsu-hint-text">{t.apiKeyTip}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                    <button
                        onClick={handleSave}
                        disabled={!isValid || disabled}
                        className={`apmsu-btn w-full ${saveStatus === 'saved' ? 'apmsu-btn-success' : 'apmsu-btn-primary'}`}
                    >
                        {saveStatus === 'saved' ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                {t.saved}
                            </span>
                        ) : (saveButtonText || t.save)}
                    </button>
                </div>
            </div>

            {/* Config Preview */}
            {showPreview && provider && (
                <div className="mt-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 border border-gray-200/50 dark:border-zinc-800">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wider">{t.preview}</h3>
                    <pre className="text-xs text-gray-600 dark:text-zinc-400 font-mono overflow-x-auto leading-relaxed">
                        {JSON.stringify({
                            provider: provider.name,
                            apiFormat: provider.apiFormat,
                            baseUrl: baseUrl || provider.baseUrl,
                            model: model || t.unselected,
                            hasApiKey: !!apiKey
                        }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

// Icons
const ChevronIcon = () => (
    <svg className="w-4 h-4 opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="apmsu-icon-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="apmsu-icon-success" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
);

const ErrorIcon = () => (
    <svg className="apmsu-icon-error" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
);
