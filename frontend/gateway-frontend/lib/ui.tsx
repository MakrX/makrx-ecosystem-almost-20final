import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

// Theme Types
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // The resolved theme (system resolved to light/dark)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'makrx-theme',
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme;
      return stored || defaultTheme;
    }
    return defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (newTheme: Theme) => {
      // Force remove all theme classes multiple times to ensure they're gone
      root.classList.remove('light', 'dark');
      root.removeAttribute('data-theme');

      // Force a reflow
      root.offsetHeight;

      let resolvedTheme: 'light' | 'dark';

      if (newTheme === 'system') {
        resolvedTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        resolvedTheme = newTheme;
      }

      // Apply theme with both class and data attribute for maximum compatibility
      root.classList.add(resolvedTheme);
      root.setAttribute('data-theme', resolvedTheme);
      setActualTheme(resolvedTheme);

      // Force style recalculation
      root.style.colorScheme = resolvedTheme;

      // Additional force by setting both class attribute directly
      root.className = root.className; // Force class update


      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]:not([media])');
      const metaThemeColorDark = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');

      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0a0a0a' : '#1e40af');
      }

      // Ensure mobile browsers use the correct theme color
      if (resolvedTheme === 'dark' && !metaThemeColorDark) {
        const darkMeta = document.createElement('meta');
        darkMeta.name = 'theme-color';
        darkMeta.content = '#0a0a0a';
        darkMeta.media = '(prefers-color-scheme: dark)';
        document.head.appendChild(darkMeta);
      }
    };

    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    // Apply initial theme immediately
    applyTheme(theme);
    setIsInitialized(true);

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Force multiple reapplies to ensure it sticks
    const forceApply1 = setTimeout(() => applyTheme(theme), 50);
    const forceApply2 = setTimeout(() => applyTheme(theme), 100);
    const forceApply3 = setTimeout(() => applyTheme(theme), 200);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      clearTimeout(forceApply1);
      clearTimeout(forceApply2);
      clearTimeout(forceApply3);
    };
  }, [theme]);

  const value = {
    theme,
    actualTheme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

// Enhanced Theme Toggle Component with three-state toggle
export function ThemeToggle({ 
  className = '',
  showLabel = false,
  variant = 'default'
}: { 
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'dropdown';
} = {}) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'system'];
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

  if (variant === 'compact') {
    return (
      <button
        onClick={cycleTheme}
        className={`inline-flex items-center justify-center rounded-lg w-9 h-9 bg-transparent text-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-makrx-yellow disabled:pointer-events-none disabled:opacity-50 ${className}`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
        title={`Current: ${getLabel()} theme`}
      >
        {getIcon()}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${className}`}
          aria-label="Theme options"
        >
          {getIcon()}
          {showLabel && <span>{getLabel()}</span>}
        </button>
        
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-1">
            {(['light', 'dark', 'system'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors ${
                  theme === t ? 'bg-makrx-blue text-white' : 'text-gray-700 dark:text-gray-200'
                }`}
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
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-makrx-yellow ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
    >
      {getIcon()}
      {showLabel && <span>{getLabel()}</span>}
    </button>
  );
}

// Theme-aware utility components
export function Card({ 
  children, 
  className = '',
  variant = 'default'
}: { 
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outline';
}) {
  const baseClasses = 'rounded-lg transition-colors';
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/25',
    outline: 'border-2 border-gray-200 dark:border-gray-700 hover:border-makrx-blue dark:hover:border-makrx-blue'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'default',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-makrx-yellow disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-makrx-blue hover:bg-makrx-blue/90 text-white shadow hover:shadow-lg',
    secondary: 'bg-makrx-yellow hover:bg-makrx-yellow/90 text-makrx-blue shadow hover:shadow-lg',
    outline: 'border-2 border-makrx-blue text-makrx-blue hover:bg-makrx-blue hover:text-white dark:border-makrx-blue dark:text-makrx-blue',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100',
    destructive: 'bg-red-600 hover:bg-red-700 text-white shadow hover:shadow-lg'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Theme-aware text components
export function Text({
  children,
  className = '',
  variant = 'body',
  as: Component = 'p'
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'muted';
  as?: keyof JSX.IntrinsicElements;
}) {
  const variants = {
    heading: 'text-2xl font-bold text-gray-900 dark:text-white',
    subheading: 'text-lg font-semibold text-gray-800 dark:text-gray-200',
    body: 'text-base text-gray-700 dark:text-gray-300',
    caption: 'text-sm text-gray-600 dark:text-gray-400',
    muted: 'text-sm text-gray-500 dark:text-gray-500'
  };

  return React.createElement(Component, {
    className: `${variants[variant]} ${className}`
  }, children);
}
