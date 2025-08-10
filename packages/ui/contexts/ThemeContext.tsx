/**
 * @fileoverview MakrX Theme Management System
 *
 * This module provides a comprehensive theme management solution for the MakrX ecosystem.
 * It supports light/dark themes with automatic system theme detection and persistence.
 *
 * Features:
 * - Light, dark, and system theme modes
 * - Automatic system preference detection
 * - localStorage persistence across sessions
 * - Real-time theme switching
 * - SSR-compatible initialization
 * - CSS class and data-attribute support
 *
 * Storage: Theme preference is stored in localStorage as 'makrx-theme'
 * CSS Integration: Applies 'light'/'dark' classes to document root
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Available theme options
 * - 'light': Force light theme
 * - 'dark': Force dark theme
 * - 'system': Use OS/browser preference
 */
type Theme = 'light' | 'dark' | 'system';

/**
 * Theme context interface providing theme state and controls
 */
interface ThemeContextType {
  /** Current theme setting (user's choice) */
  theme: Theme;
  /** Function to change theme setting */
  setTheme: (theme: Theme) => void;
  /** Resolved theme (what's actually applied) */
  effectiveTheme: 'light' | 'dark';
}

/**
 * React context for theme management
 * Undefined by default to enforce provider usage
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('makrx-theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setEffectiveTheme(systemTheme);
      } else {
        setEffectiveTheme(theme);
      }
    };

    updateEffectiveTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateEffectiveTheme);
      return () => mediaQuery.removeEventListener('change', updateEffectiveTheme);
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    
    // Also set data-theme for better CSS selector support
    root.setAttribute('data-theme', effectiveTheme);
    
    localStorage.setItem('makrx-theme', theme);
  }, [theme, effectiveTheme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    effectiveTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
