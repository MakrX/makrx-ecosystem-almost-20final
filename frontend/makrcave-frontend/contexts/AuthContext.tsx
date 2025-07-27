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
  assignedMakerspaces?: string[]; // For roles that are assigned to specific makerspaces
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // Demo function to switch between roles
  getCurrentRole: () => UserRole;
  getRolePermissions: () => RolePermissions;
  hasPermission: (area: keyof RolePermissions, action: string, context?: any) => boolean;
  getUIAccess: () => typeof UI_ACCESS[UserRole];
  // Role check helpers
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isMakerspaceAdmin: boolean;
  isServiceProvider: boolean;
  isMaker: boolean;
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
      assignedMakerspaces: ['ms-1', 'ms-2', 'ms-3'] // Can manage all makerspaces
    },
    admin: {
      id: 'adm-1',
      email: 'admin@makrx.org',
      username: 'admin',
      firstName: 'Organization',
      lastName: 'Admin',
      role: 'admin',
      assignedMakerspaces: [] // Can view all but not assigned to specific ones
    },
    makerspace_admin: {
      id: 'msa-1',
      email: 'makerspaceadmin@makrcave.local',
      username: 'makerspaceadmin',
      firstName: 'MakrCave',
      lastName: 'Admin',
      role: 'makerspace_admin',
      assignedMakerspaces: ['ms-1'] // Assigned to specific makerspace
    },
    service_provider: {
      id: 'sp-1',
      email: 'provider@makrcave.local',
      username: 'serviceprovider',
      firstName: 'Service',
      lastName: 'Provider',
      role: 'service_provider',
      assignedMakerspaces: ['ms-1'] // Currently restricted
    },
    maker: {
      id: 'mkr-1',
      email: 'maker@makrcave.local',
      username: 'maker',
      firstName: 'Creative',
      lastName: 'Maker',
      role: 'maker',
      assignedMakerspaces: ['ms-1'] // Assigned to their makerspace
    }
  };

  useEffect(() => {
    // Demo: Start with Makerspace Admin role for showcase
    setUser(demoUsers.makerspace_admin);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Demo login - determine role based on email
    let role: UserRole = 'maker';
    if (email.includes('superadmin')) role = 'super_admin';
    else if (email.includes('admin') && !email.includes('makerspace')) role = 'admin';
    else if (email.includes('makerspace') || email.includes('manager')) role = 'makerspace_admin';
    else if (email.includes('provider')) role = 'service_provider';

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

  const getCurrentRole = (): UserRole => {
    return user?.role || 'maker';
  };

  const getUserRolePermissions = (): RolePermissions => {
    return user ? getRolePermissions(user.role) : getRolePermissions('maker');
  };

  const userHasPermission = (area: keyof RolePermissions, action: string, context?: any): boolean => {
    return user ? hasPermission(user.role, area, action, context) : false;
  };

  const getUserUIAccess = () => {
    return user ? UI_ACCESS[user.role] : UI_ACCESS.maker;
  };

  // Role check helpers
  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin';
  const isMakerspaceAdmin = user?.role === 'makerspace_admin';
  const isServiceProvider = user?.role === 'service_provider';
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
      getCurrentRole,
      getRolePermissions: getUserRolePermissions,
      hasPermission: userHasPermission,
      getUIAccess: getUserUIAccess,
      isSuperAdmin,
      isAdmin,
      isMakerspaceAdmin,
      isServiceProvider,
      isMaker
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
