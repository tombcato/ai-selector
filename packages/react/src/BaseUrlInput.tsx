import { useState } from 'react';
import type { Provider, Language } from '@ai-selector/core';
import { I18N } from '@ai-selector/core';

interface BaseUrlInputProps {
    provider: Provider | null;
    baseUrl: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    language?: Language;
}

export function BaseUrlInput({
    provider,
    baseUrl,
    onChange,
    disabled,
    language = 'zh'
}: BaseUrlInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = I18N[language];

    if (!provider) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
            >
                <svg
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`}
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
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={provider.baseUrl}
                        disabled={disabled}
                        className="apmsu-input apmsu-input-default"
                    />
                </div>
            </div>
        </>
    );
}
