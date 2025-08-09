import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthError {
  message: string;
  code?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on app start
    const storedUser = localStorage.getItem('makrx_user');
    const token = localStorage.getItem('makrx_access_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This would normally call your auth API
    const dummyUser: User = {
      id: '1',
      email,
      username: email.split('@')[0],
      firstName: 'Demo',
      lastName: 'User',
      roles: ['maker']
    };

    localStorage.setItem('makrx_user', JSON.stringify(dummyUser));
    localStorage.setItem('makrx_access_token', 'dummy_token_' + Date.now());
    
    setUser(dummyUser);
  };

  const logout = () => {
    localStorage.removeItem('makrx_user');
    localStorage.removeItem('makrx_access_token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout
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
