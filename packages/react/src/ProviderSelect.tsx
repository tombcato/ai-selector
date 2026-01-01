import { useRef, useEffect } from 'react';
import type { Provider, Language } from '@tombcato/ai-selector-core';
import { I18N } from '@tombcato/ai-selector-core';
import { SmartText } from './SmartText';

interface ProviderSelectProps {
    providers: Provider[];
    selectedProviderId: string;
    onSelect: (providerId: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    disabled?: boolean;
    language?: Language;
}

export function ProviderSelect({
    providers,
    selectedProviderId,
    onSelect,
    isOpen,
    setIsOpen,
    disabled,
    language = 'zh'
}: ProviderSelectProps) {
    const t = I18N[language];
    const triggerRef = useRef<HTMLDivElement>(null);
    const selectedProvider = providers.find(p => p.id === selectedProviderId);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    return (
        <div className="apmsu-field" ref={triggerRef}>
            <label className="apmsu-label">{t.providerLabel}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="apmsu-select-trigger"
                >
                    {selectedProvider ? (
                        <span className="flex items-center gap-2 min-w-0">
                            <img
                                src={selectedProvider.icon}
                                alt={selectedProvider.name}
                                className="apmsu-provider-icon"
                            />
                            <SmartText text={selectedProvider.name} />
                        </span>
                    ) : (
                        <span className="apmsu-placeholder">{t.selectProvider}</span>
                    )}
                    <ChevronIcon isOpen={isOpen} />
                </button>

                <div className={`apmsu-dropdown max-h-[300px] overflow-auto p-1 origin-top ${isOpen ? 'apmsu-dropdown-open' : ''}`}>
                    {providers.map((p: Provider) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                                onSelect(p.id);
                                setIsOpen(false);
                            }}
                            className={`apmsu-dropdown-item rounded-sm ${selectedProviderId === p.id ? 'apmsu-dropdown-item-active' : ''}`}
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
            </div>
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
