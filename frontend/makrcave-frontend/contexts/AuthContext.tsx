// ========================================
// AUTHENTICATION CONTEXT
// ========================================
// Provides authentication state and methods throughout the React app
// Handles:
// - User state management
// - Login/logout operations
// - Role-based permissions
// - Authentication initialization
// - User session management

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, RolePermissions } from '@makrx/types';
import { getRolePermissions, hasPermission, UI_ACCESS } from '../config/rolePermissions';

import { initKeycloak, login as kcLogin, logout as kcLogout, isAuthenticated as kcIsAuthenticated, getUser as kcGetUser } from '../lib/auth';
type LoginCredentials = any;

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  assignedMakerspaces?: string[];
  membershipTier?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'expired';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  getCurrentRole: () => UserRole;
  getRolePermissions: () => RolePermissions;
  hasPermission: (area: keyof RolePermissions, action: string, context?: any) => boolean;
  getUIAccess: () => typeof UI_ACCESS[UserRole];
  refreshUser: () => Promise<void>;
  // Role check helpers
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isMakerspaceAdmin: boolean;
  isServiceProvider: boolean;
  isMaker: boolean;
  // For backward compatibility
  isMakrcaveManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  const [user, setUser] = useState<User | null>(null);    // Current authenticated user
  const [isLoading, setIsLoading] = useState(true);       // Loading state during auth initialization

  useEffect(() => {
    initializeAuth();
  }, []);

  // ========================================
  // AUTHENTICATION INITIALIZATION
  // ========================================
  // Runs on app startup to check for existing authentication
  const initializeAuth = async () => {
    try {
      await initKeycloak();
      if (kcIsAuthenticated()) {
        const currentUser = kcGetUser();
        setUser(currentUser as any);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const login = async (_credentials?: LoginCredentials) => {
    kcLogin();
    
  };

  const logout = async () => {
    try {
      await kcLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const register = async (_data: any) => {
    kcLogin();
  };

  const refreshUser = async () => {
    if (kcIsAuthenticated()) {
      setUser(kcGetUser() as any);
    } else {
      setUser(null);
    }
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

  // ========================================
  // ROLE CHECK HELPERS
  // ========================================
  // Convenient boolean flags for role-based UI rendering
  const isSuperAdmin = user?.role === 'super_admin';         // Highest privilege level
  const isAdmin = user?.role === 'admin';                    // Administrative access
  const isMakerspaceAdmin = user?.role === 'makerspace_admin'; // Makerspace management
  const isServiceProvider = user?.role === 'service_provider'; // Service provider access
  const isMaker = user?.role === 'maker';                     // Regular member access
  const isMakrcaveManager = isMakerspaceAdmin;                // For backward compatibility
  const isAuthenticated = !!user && kcIsAuthenticated(); // Combined auth check

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register,
      getCurrentRole,
      getRolePermissions: getUserRolePermissions,
      hasPermission: userHasPermission,
      getUIAccess: getUserUIAccess,
      refreshUser,
      isSuperAdmin,
      isAdmin,
      isMakerspaceAdmin,
      isServiceProvider,
      isMaker,
      isMakrcaveManager
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
