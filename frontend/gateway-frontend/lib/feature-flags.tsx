import React, { createContext, useContext, useState, useEffect } from 'react';

interface FeatureFlagContextType {
  flags: Record<string, boolean>;
  setFlag: (flag: string, value: boolean) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<Record<string, boolean>>({
    'org.homepage.stats': true,
    'org.homepage.testimonials': true,
    'navigation.makerspace': true,
    'navigation.store': true,
    'navigation.learn': true,
    'header.notifications': true,
    'header.search': true,
    'header.user-menu': true,
  });

  const setFlag = (flag: string, value: boolean) => {
    setFlags(prev => ({ ...prev, [flag]: value }));
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, setFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useBooleanFlag(flag: string, defaultValue: boolean = false): boolean {
  const context = useContext(FeatureFlagContext);

  if (!context) {
    return defaultValue;
  }

  return context.flags[flag] ?? defaultValue;
}

export function useIsInternalUser(): boolean {
  // Simple mock implementation for internal user detection
  return localStorage.getItem('makrx-internal-user') === 'true';
}

interface FlagGuardProps {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FlagGuard({ flag, children, fallback = null }: FlagGuardProps) {
  const isEnabled = useBooleanFlag(flag);
  
  return isEnabled ? <>{children}</> : <>{fallback}</>;
}

interface NavLinkGuardProps {
  flag: string;
  children: React.ReactNode;
}

export function NavLinkGuard({ flag, children }: NavLinkGuardProps) {
  const isEnabled = useBooleanFlag(flag);
  
  return isEnabled ? <>{children}</> : null;
}
