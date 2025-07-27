import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { cn } from '../../../packages/ui/utils/cn';

interface MakrXThemeToggleProps {
  floating?: boolean;
  hideOnScroll?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'icon-only';
}

export default function MakrXThemeToggle({
  floating = false,
  hideOnScroll = false,
  className = '',
  variant = 'default',
}: MakrXThemeToggleProps): React.ReactElement | null {
  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);

    if (hideOnScroll) {
      const handleScroll = () => setVisible(window.scrollY < 150);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [hideOnScroll]);

  if (!mounted) return null;

  const baseClasses = cn(
    'relative overflow-hidden transition-all duration-300 ease-in-out',
    'border shadow-lg hover:shadow-xl',
    'flex items-center justify-center',
    'focus:outline-none focus:ring-2 focus:ring-makrx-teal focus:ring-offset-2',
    isDark
      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-slate-100'
      : 'bg-gradient-to-br from-white to-slate-50 border-slate-300 text-slate-700',
    {
      'w-12 h-12 rounded-xl': variant === 'default',
      'w-8 h-8 rounded-lg': variant === 'compact',
      'w-10 h-10 rounded-full': variant === 'icon-only',
    },
    className
  );

  const floatingWrapper = cn(
    'fixed bottom-6 right-6 z-50 transition-all duration-300',
    visible ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
  );

  const iconClasses = cn(
    'transition-all duration-500 ease-in-out drop-shadow-sm',
    {
      'w-6 h-6': variant === 'default',
      'w-4 h-4': variant === 'compact',
      'w-5 h-5': variant === 'icon-only',
    }
  );

  return (
    <div className={floating ? floatingWrapper : ''}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-pressed={isDark}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={baseClasses}
      >
        <div className="relative overflow-hidden">
          <div
            className={cn(
              'transition-transform duration-500 ease-in-out',
              isDark ? 'transform translate-y-0' : 'transform -translate-y-8'
            )}
          >
            <BsMoonFill 
              className={cn(iconClasses, 'text-blue-200')} 
            />
          </div>
          <div
            className={cn(
              'absolute top-0 left-0 transition-transform duration-500 ease-in-out',
              isDark ? 'transform translate-y-8' : 'transform translate-y-0'
            )}
          >
            <BsSunFill 
              className={cn(iconClasses, 'text-amber-500')} 
            />
          </div>
        </div>
      </button>
    </div>
  );
}
