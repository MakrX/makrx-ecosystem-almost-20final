import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  makerspaceId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isMakerspaceAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Demo: Auto-login for showcase
    const demoUser: User = {
      id: '1',
      email: 'admin@makrcave.local',
      username: 'admin',
      firstName: 'Demo',
      lastName: 'Admin',
      roles: ['maker', 'makerspace_admin'],
      makerspaceId: 'ms-1'
    };

    setUser(demoUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This would normally call your auth API
    const dummyUser: User = {
      id: '1',
      email,
      username: email.split('@')[0],
      firstName: 'Demo',
      lastName: 'Maker',
      roles: ['maker', 'makerspace_admin'],
      makerspaceId: 'ms-1'
    };

    localStorage.setItem('makrcave_user', JSON.stringify(dummyUser));
    localStorage.setItem('makrcave_access_token', 'dummy_token_' + Date.now());
    
    setUser(dummyUser);
  };

  const logout = () => {
    localStorage.removeItem('makrcave_user');
    localStorage.removeItem('makrcave_access_token');
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const isMakerspaceAdmin = hasRole('makerspace_admin') || hasRole('admin') || hasRole('super_admin');
  const isAdmin = hasRole('admin') || hasRole('super_admin');
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      hasRole,
      isMakerspaceAdmin,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
