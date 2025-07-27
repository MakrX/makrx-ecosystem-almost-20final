import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FeatureFlag, FeatureFlagConfig, FeatureContext, FeatureAccessResult, UserRole } from '@makrx/types';
import { useAuth } from './AuthContext';

interface FeatureFlagContextType {
  flags: FeatureFlagConfig;
  hasFeatureAccess: (featureKey: string) => FeatureAccessResult;
  isFeatureEnabled: (featureKey: string) => boolean;
  updateFlag: (featureKey: string, updates: Partial<FeatureFlag>) => void;
  getAllFlags: () => FeatureFlag[];
  getFlagsForRole: (role: UserRole) => FeatureFlag[];
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

// Default feature flag configuration aligned with role permissions
const defaultFlags: FeatureFlagConfig = {
  // Dashboard Features
  'dashboard.global_view': {
    id: 'dashboard.global_view',
    name: 'Global Dashboard View',
    description: 'Access to global dashboard with system-wide visibility',
    enabled: true,
    allowedRoles: ['super_admin', 'admin'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'dashboard.makerspace_view': {
    id: 'dashboard.makerspace_view',
    name: 'Makerspace Dashboard',
    description: 'Access to makerspace-specific dashboard and management',
    enabled: true,
    allowedRoles: ['super_admin', 'makerspace_admin'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'dashboard.personal_view': {
    id: 'dashboard.personal_view',
    name: 'Personal Dashboard',
    description: 'Access to personal projects and reservations dashboard',
    enabled: true,
    allowedRoles: ['super_admin', 'admin', 'makerspace_admin', 'service_provider', 'maker'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Equipment Features
  'equipment.view_all': {
    id: 'equipment.view_all',
    name: 'View All Equipment',
    description: 'View equipment across all makerspaces',
    enabled: true,
    allowedRoles: ['super_admin', 'admin'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'equipment.view_assigned': {
    id: 'equipment.view_assigned',
    name: 'View Assigned Equipment',
    description: 'View equipment in assigned makerspaces only',
    enabled: true,
    allowedRoles: ['makerspace_admin', 'service_provider'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'equipment.view_certified': {
    id: 'equipment.view_certified',
    name: 'View Certified Equipment',
    description: 'View equipment user is certified to use',
    enabled: true,
    allowedRoles: ['maker'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'equipment.reservation_system': {
    id: 'equipment.reservation_system',
    name: 'Equipment Reservations',
    description: 'Reserve equipment slots (if trained/certified)',
    enabled: true,
    allowedRoles: ['super_admin', 'admin', 'makerspace_admin', 'maker'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'equipment.add_edit': {
    id: 'equipment.add_edit',
    name: 'Add/Edit Equipment',
    description: 'Add new equipment and edit existing machines',
    enabled: true,
    allowedRoles: ['super_admin', 'makerspace_admin'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'equipment.maintenance_mode': {
    id: 'equipment.maintenance_mode',
    name: 'Equipment Maintenance',
    description: 'Equipment maintenance and status management',
    enabled: true,
    allowedRoles: ['super_admin', 'makerspace_admin'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Project Features
  'projects.collaboration': {
    id: 'projects.collaboration',
    name: 'Project Collaboration',
    description: 'Multi-user project collaboration features',
    enabled: true,
    allowedRoles: ['super_admin', 'makrcave_manager', 'maker'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'projects.version_control': {
    id: 'projects.version_control',
    name: 'Project Version Control',
    description: 'Version control system for project files',
    enabled: false, // Beta feature
    allowedRoles: ['super_admin', 'makrcave_manager'],
    environment: 'development',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Inventory Features
  'inventory.auto_reorder': {
    id: 'inventory.auto_reorder',
    name: 'Automatic Reordering',
    description: 'Automatically reorder inventory items when low',
    enabled: false, // Premium feature
    allowedRoles: ['super_admin', 'makrcave_manager'],
    environment: 'production',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'inventory.bulk_operations': {
    id: 'inventory.bulk_operations',
    name: 'Bulk Inventory Operations',
    description: 'Perform bulk operations on inventory items',
    enabled: true,
    allowedRoles: ['super_admin', 'makrcave_manager'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Reservation Features
  'reservations.recurring': {
    id: 'reservations.recurring',
    name: 'Recurring Reservations',
    description: 'Create recurring equipment reservations',
    enabled: true,
    allowedRoles: ['super_admin', 'makrcave_manager', 'maker'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'reservations.approval_workflow': {
    id: 'reservations.approval_workflow',
    name: 'Reservation Approval Workflow',
    description: 'Require manager approval for certain reservations',
    enabled: true,
    allowedRoles: ['super_admin', 'makrcave_manager'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Admin Features
  'admin.user_management': {
    id: 'admin.user_management',
    name: 'User Management',
    description: 'Manage users and their roles',
    enabled: true,
    allowedRoles: ['super_admin', 'makrcave_manager'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'admin.makerspace_settings': {
    id: 'admin.makerspace_settings',
    name: 'Makerspace Settings',
    description: 'Configure makerspace settings and preferences',
    enabled: true,
    allowedRoles: ['super_admin', 'makrcave_manager'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'admin.system_logs': {
    id: 'admin.system_logs',
    name: 'System Logs',
    description: 'View system logs and audit trails',
    enabled: true,
    allowedRoles: ['super_admin'],
    environment: 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [flags, setFlags] = useState<FeatureFlagConfig>(defaultFlags);
  const environment = process.env.NODE_ENV || 'development';

  // Load flags from localStorage on mount (in real app, would be from API)
  useEffect(() => {
    const savedFlags = localStorage.getItem('makrcave_feature_flags');
    if (savedFlags) {
      try {
        const parsedFlags = JSON.parse(savedFlags);
        setFlags({ ...defaultFlags, ...parsedFlags });
      } catch (error) {
        console.warn('Failed to parse saved feature flags:', error);
      }
    }
  }, []);

  // Save flags to localStorage when they change
  const updateFlag = (featureKey: string, updates: Partial<FeatureFlag>) => {
    const updatedFlags = {
      ...flags,
      [featureKey]: {
        ...flags[featureKey],
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    };
    setFlags(updatedFlags);
    localStorage.setItem('makrcave_feature_flags', JSON.stringify(updatedFlags));
  };

  const hasFeatureAccess = (featureKey: string): FeatureAccessResult => {
    const flag = flags[featureKey];
    
    if (!flag) {
      return { hasAccess: false, reason: 'not_found' };
    }

    if (!flag.enabled) {
      return { hasAccess: false, flag, reason: 'disabled' };
    }

    // Check environment compatibility
    if (flag.environment && flag.environment !== 'all' && flag.environment !== environment) {
      return { hasAccess: false, flag, reason: 'environment_mismatch' };
    }

    // Check role access
    if (!user || !flag.allowedRoles.includes(user.role)) {
      return { hasAccess: false, flag, reason: 'insufficient_role' };
    }

    return { hasAccess: true, flag };
  };

  const isFeatureEnabled = (featureKey: string): boolean => {
    return hasFeatureAccess(featureKey).hasAccess;
  };

  const getAllFlags = (): FeatureFlag[] => {
    return Object.values(flags);
  };

  const getFlagsForRole = (role: UserRole): FeatureFlag[] => {
    return Object.values(flags).filter(flag => flag.allowedRoles.includes(role));
  };

  return (
    <FeatureFlagContext.Provider value={{
      flags,
      hasFeatureAccess,
      isFeatureEnabled,
      updateFlag,
      getAllFlags,
      getFlagsForRole,
    }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}
