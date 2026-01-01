import { useCallback, useState, useEffect, useMemo } from 'react';
import { useAIConfig } from './useAIConfig';
import { I18N, type Language, type AIConfig, type AIConfigFormProps, type TestConnectionResult } from '@ai-selector/core';
import { ProviderSelect } from './ProviderSelect';
import { AuthInput } from './AuthInput';
import { ModelSelect } from './ModelSelect';
import { BaseUrlInput } from './BaseUrlInput';

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
    modelFetcher,
}: Props) {
    const t = useMemo(() => I18N[language], [language]);

    const {
        providerId,
        apiKey,
        model,
        modelName,
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
        isFetchingModels,
        fetchModelError,
        config: currentConfig,
    } = useAIConfig({
        proxyUrl,
        providerConfig,
        initialConfig,
        onSerialize,
        onDeserialize,
        modelFetcher,
    });

    const [providerOpen, setProviderOpen] = useState(false);
    const [modelOpen, setModelOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

    // Handle save
    const handleSave = useCallback(() => {
        save();
        setSaveStatus('saved');
        onSave?.(currentConfig);
        setTimeout(() => setSaveStatus('idle'), 2000);
    }, [save, onSave, currentConfig]);

    return (
        <div className="apmsu-card">
            {title && (
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
            )}

            <div className="space-y-3">
                <ProviderSelect
                    providers={providers}
                    selectedProviderId={providerId}
                    onSelect={setProviderId}
                    isOpen={providerOpen}
                    setIsOpen={setProviderOpen}
                    disabled={disabled}
                    language={language}
                />

                <BaseUrlInput
                    provider={provider}
                    baseUrl={baseUrl}
                    onChange={setBaseUrl}
                    disabled={disabled}
                    language={language}
                />

                {/* Auth & Model Collapsible Section */}
                <div className={`transition-all duration-500 ease-in-out ${providerId ? 'max-h-[1000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="space-y-4">
                        <AuthInput
                            provider={provider}
                            apiKey={apiKey}
                            onChange={setApiKey}
                            testStatus={testStatus}
                            disabled={disabled}
                            language={language}
                        />

                        <ModelSelect
                            provider={provider}
                            models={models}
                            selectedModelId={model}
                            onSelect={setModel}
                            isOpen={modelOpen}
                            setIsOpen={setModelOpen}
                            hasApiKey={!!apiKey}
                            disabled={disabled}
                            language={language}
                            isFetchingModels={isFetchingModels}
                            fetchModelError={fetchModelError}
                            selectedModelName={modelName}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => runTest()}
                            disabled={!providerId || !apiKey || !model || disabled || testStatus === 'testing'}
                            className={`apmsu-btn flex-1 ${testStatus === 'success' ? 'apmsu-btn-success' :
                                testStatus === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40' :
                                    'apmsu-btn-ghost border border-gray-200 dark:border-zinc-700'
                                }`}
                        >
                            {testStatus === 'testing' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <SpinnerIcon />
                                    {t.testing}
                                </span>
                            ) : testStatus === 'success' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <CheckIcon />
                                    {t.testSuccess} {testResult?.latencyMs && `${testResult.latencyMs}ms`}
                                </span>
                            ) : testStatus === 'error' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <ErrorIcon />
                                    {t.testFailed}
                                </span>
                            ) : (
                                t.testConnection
                            )}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!isValid || disabled}
                            className={`apmsu-btn flex-1 ${saveStatus === 'saved' ? 'apmsu-btn-success' : 'apmsu-btn-primary'}`}
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

                    {/* Error Message */}
                    <div
                        className="grid transition-all duration-200 ease-out"
                        style={{ gridTemplateRows: (!testResult?.success && testResult?.message && testStatus !== 'testing' && testStatus !== 'success') ? '1fr' : '0fr' }}
                    >
                        <div className="overflow-hidden">
                            <div className="p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <p className="text-xs text-red-600 dark:text-red-400 line-clamp-3 text-left">{testResult?.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Config Preview - Collapsible */}
            {showPreview && provider && (
                <div className="mt-6 border border-gray-200/50 dark:border-zinc-800 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                        <h3 className="text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">{t.preview}</h3>
                        <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isPreviewOpen ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        className="grid transition-all duration-200 ease-out"
                        style={{ gridTemplateRows: isPreviewOpen ? '1fr' : '0fr' }}
                    >
                        <div className="overflow-hidden">
                            <pre className="text-xs text-gray-600 dark:text-zinc-400 font-mono overflow-x-auto leading-relaxed p-4 bg-zinc-50 dark:bg-zinc-900/50">
                                {JSON.stringify({
                                    provider: provider.name,
                                    apiFormat: provider.apiFormat,
                                    baseUrl: baseUrl || provider.baseUrl,
                                    model: model || t.unselected,
                                    hasApiKey: !!apiKey
                                }, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Icons
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
