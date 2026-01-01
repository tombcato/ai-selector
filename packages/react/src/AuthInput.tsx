import { useState } from 'react';
import type { Provider, Language } from '@tombcato/ai-selector-core';
import { I18N } from '@tombcato/ai-selector-core';

interface AuthInputProps {
    provider: Provider | null;
    apiKey: string;
    onChange: (value: string) => void;
    testStatus: 'idle' | 'testing' | 'success' | 'error';
    disabled?: boolean;
    language?: Language;
}

export function AuthInput({
    provider,
    apiKey,
    onChange,
    testStatus,
    disabled,
    language = 'zh'
}: AuthInputProps) {
    const [isVisible, setIsVisible] = useState(false);
    const t = I18N[language];

    if (!provider || !provider.needsApiKey) return null;

    const getInputClass = () => {
        if (testStatus === 'success') return 'apmsu-input apmsu-input-success';
        return 'apmsu-input apmsu-input-default';
    };

    return (
        <div className="space-y-2">
            <label className="apmsu-label">{t.apiKeyLabel}</label>
            <div className="relative">
                <input
                    type={isVisible ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsVisible(true)}
                    onBlur={() => setIsVisible(false)}
                    placeholder={t.apiKeyPlaceholder}
                    disabled={disabled}
                    className={`${getInputClass()} pr-10`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    {isVisible ? (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    )}
                </span>
            </div>
        </div>
    );
}
