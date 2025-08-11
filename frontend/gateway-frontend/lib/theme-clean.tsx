import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';
type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: 'light' | 'dark';
};

const ThemeCtx = createContext<Ctx | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('makrx-theme') as Theme) || 'system');
  const [system, setSystem] = useState<'light' | 'dark'>(() => (typeof window !== 'undefined' ? getSystemTheme() : 'light'));

  // react to system changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSystem(getSystemTheme());
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? system : theme;

  // apply to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  // persist
  useEffect(() => {
    localStorage.setItem('makrx-theme', theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, resolvedTheme }), [theme, resolvedTheme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};

// Theme Toggle Component
export function ThemeToggle({ 
  className = '',
  showLabel = false,
  variant = 'default'
}: { 
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'dropdown';
} = {}) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    const themeOrder: Theme[] = ['system', 'light', 'dark'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  };

  const getAriaLabel = () => {
    const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    return `Current theme: ${getLabel()}. Click to switch to ${next} theme.`;
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={cycleTheme}
        className={`inline-flex items-center justify-center rounded-lg w-9 h-9 bg-transparent text-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-900 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-makrx-yellow disabled:pointer-events-none disabled:opacity-50 ${className}`}
        aria-label={getAriaLabel()}
        title={`Current: ${getLabel()} theme (${resolvedTheme})`}
      >
        {getIcon()}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 ${className}`}
          aria-label="Theme options"
        >
          {getIcon()}
          {showLabel && <span>{getLabel()}</span>}
        </button>
        
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-1">
            {(['system', 'light', 'dark'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors ${
                  theme === t ? 'bg-makrx-blue text-white dark:bg-makrx-yellow dark:text-makrx-blue' : 'text-gray-700 dark:text-gray-100'
                }`}
                aria-label={`Switch to ${t} theme`}
              >
                {t === 'light' && <Sun className="h-4 w-4" />}
                {t === 'dark' && <Moon className="h-4 w-4" />}
                {t === 'system' && <Monitor className="h-4 w-4" />}
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <button
      onClick={cycleTheme}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-makrx-yellow ${className}`}
      aria-label={getAriaLabel()}
    >
      {getIcon()}
      {showLabel && <span>{getLabel()}</span>}
    </button>
  );
}
