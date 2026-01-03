import { AIConfigForm } from '@tombcato/ai-selector-react';
import '@tombcato/ai-selector-react/style.css';
import { useEffect, useState } from 'react';

function App() {
  const [isDark, setIsDark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className={isDark ? 'dark' : ''} style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
        <h1 style={{ color: isDark ? '#fff' : '#000' }}>AI Selector Demo (npm)</h1>
        <AIConfigForm
          proxyUrl=""
          language="en"
          showPreview
          onSave={(config) => {
            console.log('Saved:', config);
          }}
        />
      </div>
    </div>
  );
}

export default App;
