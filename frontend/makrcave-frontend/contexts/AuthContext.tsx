import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, RolePermissions } from '@makrx/types';
import { getRolePermissions, hasPermission, UI_ACCESS } from '../config/rolePermissions';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  makerspaceId?: string;
  makerspaces?: string[]; // For super admins who can manage multiple spaces
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // Demo function to switch between roles
  isSuperAdmin: boolean;
  isMakrcaveManager: boolean;
  isMaker: boolean;
  getCurrentRole: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Demo users for different roles
  const demoUsers: Record<UserRole, User> = {
    super_admin: {
      id: 'sa-1',
      email: 'superadmin@makrx.org',
      username: 'superadmin',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'super_admin',
      makerspaces: ['ms-1', 'ms-2', 'ms-3'] // Can manage multiple makerspaces
    },
    makrcave_manager: {
      id: 'mgr-1',
      email: 'manager@makrcave.local',
      username: 'manager',
      firstName: 'Cave',
      lastName: 'Manager',
      role: 'makrcave_manager',
      makerspaceId: 'ms-1'
    },
    maker: {
      id: 'mkr-1',
      email: 'maker@makrcave.local',
      username: 'maker',
      firstName: 'Creative',
      lastName: 'Maker',
      role: 'maker',
      makerspaceId: 'ms-1'
    }
  };

  useEffect(() => {
    // Demo: Start with MakrCave Manager role for showcase
    setUser(demoUsers.makrcave_manager);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Demo login - determine role based on email
    let role: UserRole = 'maker';
    if (email.includes('superadmin')) role = 'super_admin';
    else if (email.includes('manager')) role = 'makrcave_manager';

    setUser(demoUsers[role]);
  };

  const logout = () => {
    localStorage.removeItem('makrcave_user');
    localStorage.removeItem('makrcave_access_token');
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(demoUsers[role]);
  };

  const getCurrentRole = (): string => {
    return user?.role || 'maker';
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isMakrcaveManager = user?.role === 'makrcave_manager';
  const isMaker = user?.role === 'maker';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      switchRole,
      isSuperAdmin,
      isMakrcaveManager,
      isMaker,
      getCurrentRole
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
