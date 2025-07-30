import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, RolePermissions } from '@makrx/types';
import { getRolePermissions, hasPermission, UI_ACCESS } from '../config/rolePermissions';
import authService, { User as AuthUser, LoginCredentials } from '../services/authService';

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
  getCurrentRole: () => UserRole;
  getRolePermissions: () => RolePermissions;
  hasPermission: (area: keyof RolePermissions, action: string, context?: any) => boolean;
  getUIAccess: () => typeof UI_ACCESS[UserRole];
  getDemoUsers: () => User[];
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

  // Predefined demo users for authentication
  const demoUsers: User[] = [
    {
      id: 'sa-1',
      email: 'alex.carter@makrx.org',
      username: 'alex.carter',
      firstName: 'Alex',
      lastName: 'Carter',
      role: 'super_admin',
      assignedMakerspaces: ['ms-1', 'ms-2', 'ms-3'] // Can manage all makerspaces
    },
    {
      id: 'adm-1',
      email: 'jordan.kim@makrx.org',
      username: 'jordan.kim',
      firstName: 'Jordan',
      lastName: 'Kim',
      role: 'admin',
      assignedMakerspaces: [] // Can view all but not assigned to specific ones
    },
    {
      id: 'msa-1',
      email: 'sarah.martinez@makrcave.local',
      username: 'sarah.martinez',
      firstName: 'Sarah',
      lastName: 'Martinez',
      role: 'makerspace_admin',
      assignedMakerspaces: ['ms-1'] // Assigned to specific makerspace
    },
    {
      id: 'sp-1',
      email: 'riley.thompson@makrcave.local',
      username: 'riley.thompson',
      firstName: 'Riley',
      lastName: 'Thompson',
      role: 'service_provider',
      assignedMakerspaces: ['ms-1'] // Currently restricted
    },
    {
      id: 'mkr-1',
      email: 'casey.williams@makrcave.local',
      username: 'casey.williams',
      firstName: 'Casey',
      lastName: 'Williams',
      role: 'maker',
      assignedMakerspaces: ['ms-1'] // Assigned to their makerspace
    }
  ];

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('makrcave_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        const user = demoUsers.find(u => u.id === userData.id);
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.warn('Failed to parse saved user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Find user by email
    const user = demoUsers.find(u => u.email === email);

    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, you'd validate the password here
    // For demo purposes, any password works

    setUser(user);
    localStorage.setItem('makrcave_user', JSON.stringify({ id: user.id }));
    // Generate mock auth token for API calls
    const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('makrcave_access_token', mockToken);
  };

  const logout = () => {
    localStorage.removeItem('makrcave_user');
    localStorage.removeItem('makrcave_access_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const getDemoUsers = () => demoUsers;

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
      getCurrentRole,
      getRolePermissions: getUserRolePermissions,
      hasPermission: userHasPermission,
      getUIAccess: getUserUIAccess,
      getDemoUsers,
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
