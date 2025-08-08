// ========================================
// Authentication Service for MakrCave Frontend
// ========================================
// This service handles all authentication operations including:
// - User login/logout
// - JWT token management
// - Automatic token refresh
// - User registration
// - Password reset functionality
// - Role-based permission checking

import loggingService from './loggingService';

// API Configuration - Change this URL to point to your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// Local Storage Keys - Change these if you want different storage key names
const TOKEN_KEY = 'makrcave_access_token';
const REFRESH_TOKEN_KEY = 'makrcave_refresh_token';
const USER_KEY = 'makrcave_user';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'admin' | 'makerspace_admin' | 'service_provider' | 'maker';
  assignedMakerspaces?: string[];
  membershipTier?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'expired';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  makerspaceId?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface TokenPayload {
  sub: string; // user ID
  email: string;
  role: string;
  makerspace_ids?: string[];
  exp: number;
  iat: number;
}

class AuthService {
  private refreshTimer: NodeJS.Timeout | null = null;

  // Initialize auth service
  constructor() {
    this.initializeTokenRefresh();
  }

  // ========================================
  // LOGIN METHOD
  // ========================================
  // Authenticates user with email/password and stores JWT tokens
  // Returns user data and tokens on success
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Login failed: ${response.status} ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();
      
      // Store tokens and user data
      this.setTokens(data.access_token, data.refresh_token);
      this.setUser(data.user);
      
      // Set up token refresh
      this.scheduleTokenRefresh(data.expires_in);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // ========================================
  // REGISTRATION METHOD
  // ========================================
  // Creates new user account (default role: 'maker')
  // Automatically logs in user after successful registration
  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Registration failed');
      }

      const loginResponse: LoginResponse = await response.json();
      
      // Store tokens and user data
      this.setTokens(loginResponse.access_token, loginResponse.refresh_token);
      this.setUser(loginResponse.user);
      
      // Set up token refresh
      this.scheduleTokenRefresh(loginResponse.expires_in);
      
      return loginResponse;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // ========================================
  // LOGOUT METHOD
  // ========================================
  // Clears all authentication data and invalidates server-side token
  async logout(): Promise<void> {
    try {
      const token = this.getAccessToken();
      if (token) {
        // Call logout endpoint to invalidate token on server
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }).catch(() => {
          // Ignore errors on logout API call
        });
      }
    } finally {
      // Always clear local data
      this.clearAuthData();
    }
  }

  // Refresh access token
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        // Refresh token is invalid, logout user
        this.clearAuthData();
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Store new tokens
      this.setTokens(data.access_token, data.refresh_token || refreshToken);
      
      // Schedule next refresh
      this.scheduleTokenRefresh(data.expires_in);
      
      return data.access_token;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Request password reset
  async requestPasswordReset(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Password reset request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Password reset failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Change password (when logged in)
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Password change failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  // Get current user info
  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          const newToken = await this.refreshToken();
          if (newToken) {
            // Retry with new token
            return this.getCurrentUser();
          }
        }
        throw new Error('Failed to get user info');
      }

      const user: User = await response.json();
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Token management
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    // Also set for backward compatibility
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('authToken', accessToken);
  }

  // User management
  getUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Also set for backward compatibility
    localStorage.setItem('makrcave_user', JSON.stringify({ id: user.id }));
  }

  // Clear all auth data
  clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Clear backward compatibility tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('makrcave_user');
    localStorage.removeItem('makrcave_access_token');
    
    // Clear refresh timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = this.parseTokenPayload(token);
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  // Parse JWT token payload
  parseTokenPayload(token: string): TokenPayload {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  // Get user role from token
  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = this.parseTokenPayload(token);
      return payload.role;
    } catch {
      return null;
    }
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Check if user is admin (any admin level)
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'super_admin' || role === 'admin' || role === 'makerspace_admin';
  }

  // ========================================
  // TOKEN REFRESH SCHEDULING
  // ========================================
  // Automatically refreshes tokens 5 minutes before expiry
  // Change the 300 seconds (5 minutes) value to adjust timing
  private scheduleTokenRefresh(expiresIn: number): void {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh token 5 minutes before expiry
    // CUSTOMIZATION: Change 300 to adjust refresh timing (in seconds)
    const refreshTime = (expiresIn - 300) * 1000;
    
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken();
      }, refreshTime);
    }
  }

  // Initialize token refresh on app start
  private initializeTokenRefresh(): void {
    const token = this.getAccessToken();
    if (token && this.isAuthenticated()) {
      try {
        const payload = this.parseTokenPayload(token);
        const timeUntilExpiry = payload.exp - (Date.now() / 1000);
        this.scheduleTokenRefresh(timeUntilExpiry);
      } catch {
        // Invalid token, clear auth data
        this.clearAuthData();
      }
    }
  }

  // Create authenticated fetch function
  createAuthenticatedFetch() {
    return async (url: string, options: RequestInit = {}): Promise<Response> => {
      const token = this.getAccessToken();
      
      const authenticatedOptions = {
        ...options,
        headers: {
          ...options.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      let response = await fetch(url, authenticatedOptions);

      // If unauthorized, try to refresh token and retry
      if (response.status === 401 && token) {
        const newToken = await this.refreshToken();
        if (newToken) {
          authenticatedOptions.headers = {
            ...authenticatedOptions.headers,
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(url, authenticatedOptions);
        }
      }

      return response;
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
