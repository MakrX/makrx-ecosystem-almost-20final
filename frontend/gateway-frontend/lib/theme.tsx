import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

// Theme Types
type Theme = 'system' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  systemTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage key for theme preference
const THEME_STORAGE_KEY = 'makrx-theme';

// Get initial theme based on stored preference or system default
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    if (stored && ['system', 'light', 'dark'].includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  
  return 'system';
}

// Get system theme preference
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to DOM with proper class management
function applyThemeToDOM(theme: ResolvedTheme) {
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark');
  
  // Add new theme class
  root.classList.add(theme);
  
  // Set data attribute for additional styling hooks
  root.setAttribute('data-theme', theme);
  
  // Set color-scheme for native browser features
  root.style.colorScheme = theme;
  
  // Update meta theme-color for mobile browsers
  updateMetaThemeColor(theme);
}

// Update meta theme-color for mobile browsers
function updateMetaThemeColor(theme: ResolvedTheme) {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]:not([media])');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#1e40af');
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = THEME_STORAGE_KEY,
  enableColorScheme = true,
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableColorScheme?: boolean;
}) {
  // Initialize theme state
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate resolved theme
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    const initialSystemTheme = getSystemTheme();
    
    setThemeState(initialTheme);
    setSystemTheme(initialSystemTheme);
    
    // Apply theme immediately to prevent FOIT
    const themeToApply = initialTheme === 'system' ? initialSystemTheme : initialTheme;
    applyThemeToDOM(themeToApply);
    
    setIsInitialized(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // Only apply if current theme is 'system'
      if (theme === 'system') {
        applyThemeToDOM(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Apply theme when resolved theme changes
  useEffect(() => {
    if (isInitialized) {
      applyThemeToDOM(resolvedTheme);
    }
  }, [resolvedTheme, isInitialized]);

  // Theme setter with persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    systemTheme,
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

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

// Anti-FOIT script generator (for HTML head injection)
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
    default: 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700',
    elevated: 'bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-900/25',
    outline: 'border-2 border-gray-200 dark:border-slate-700 hover:border-makrx-blue dark:hover:border-makrx-blue'
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
    ghost: 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-900 dark:text-gray-100',
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

export function generateThemeScript(storageKey: string = THEME_STORAGE_KEY): string {
  return `
    (function() {
      try {
        var theme = localStorage.getItem('${storageKey}') || 'system';
        var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
        
        document.documentElement.classList.add(resolvedTheme);
        document.documentElement.setAttribute('data-theme', resolvedTheme);
        document.documentElement.style.colorScheme = resolvedTheme;
      } catch (e) {
        console.warn('Theme initialization failed:', e);
      }
    })();
  `;
}
