
import { Ticker as SmartTicker } from '@tombcato/smart-ticker';
import '@tombcato/smart-ticker/style.css';

interface SmartTextProps {
    text: string;
    className?: string;
    placeholder?: string;
}

export function SmartText({ text, className = '', placeholder }: SmartTextProps) {
    if (!text && placeholder) {
        return <span className={`apmsu-placeholder ${className}`}>{placeholder}</span>;
    }

    if (!text) return null;

    return (
        <span className={`inline-flex min-w-0 ${className}`}>
            <SmartTicker value={text} charWidth={0.8} duration={300} />
        </span>
    );
}
