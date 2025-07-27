// User & Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: UserRole[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'super_admin' | 'admin' | 'makerspace_admin' | 'service_provider' | 'maker';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// Product Types (Store)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

export type ProductCategory = '3d_printing' | 'electronics' | 'tools' | 'materials' | 'custom';

// Makerspace Types (MakrCave)
export interface Makerspace {
  id: string;
  name: string;
  description: string;
  location: string;
  equipment: Equipment[];
  members: User[];
  isActive: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  makerspaceId: string;
}

export type EquipmentType = '3d_printer' | 'laser_cutter' | 'cnc_machine' | 'workstation' | 'tool';
export type EquipmentStatus = 'available' | 'in_use' | 'maintenance' | 'offline';

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  collaborators: string[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Feature Flag Types
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  allowedRoles: UserRole[];
  environment?: 'development' | 'staging' | 'production' | 'all';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureFlagConfig {
  [featureKey: string]: FeatureFlag;
}

export interface FeatureContext {
  user: User | null;
  environment: string;
  flags: FeatureFlagConfig;
}

export interface FeatureAccessResult {
  hasAccess: boolean;
  flag?: FeatureFlag;
  reason?: 'disabled' | 'insufficient_role' | 'not_found' | 'environment_mismatch';
}
