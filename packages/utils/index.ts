import type { AuthTokens } from '@makrx/types';

// Basic cookie helpers. Cookies are expected to be set by the server with the
// `HttpOnly` flag; these helpers are defensive fallbacks for environments where
// `document` is available. SameSite and Secure attributes mitigate CSRF risk.
const cookieOptions = 'path=/; secure; samesite=strict';

const setCookie = (name: string, value: string, expiresMs?: number) => {
  if (typeof document === 'undefined') return;
  let cookie = `${name}=${encodeURIComponent(value)}; ${cookieOptions}`;
  if (expiresMs) {
    cookie += `; expires=${new Date(expiresMs).toUTCString()}`;
  }
  document.cookie = cookie;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; ${cookieOptions}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// Auth utilities
export const auth = {
  setTokens: (tokens: AuthTokens) => {
    setCookie('makrx_access_token', tokens.accessToken, tokens.expiresIn);
    setCookie('makrx_refresh_token', tokens.refreshToken, tokens.expiresIn);
    setCookie('makrx_expires_in', tokens.expiresIn.toString(), tokens.expiresIn);
  },

  getAccessToken: (): string | null => {
    return getCookie('makrx_access_token');
  },

  getRefreshToken: (): string | null => {
    return getCookie('makrx_refresh_token');
  },

  clearTokens: () => {
    deleteCookie('makrx_access_token');
    deleteCookie('makrx_refresh_token');
    deleteCookie('makrx_expires_in');
  },

  isAuthenticated: (): boolean => {
    const token = getCookie('makrx_access_token');
    const expiresIn = getCookie('makrx_expires_in');

    if (!token || !expiresIn) return false;

    const now = Date.now();
    const expiry = parseInt(expiresIn);

    return now < expiry;
  }
};

// Date utilities
export const dates = {
  formatDate: (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  formatDateTime: (date: string | Date): string => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  isToday: (date: string | Date): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  }
};

// String utilities
export const strings = {
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  truncate: (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  },

  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
};

// API utilities
export const api = {
  getBaseUrl: (): string => {
    return process.env.NODE_ENV === 'production' 
      ? 'https://api.makrx.org' 
      : 'http://localhost:8000';
  },

  buildUrl: (endpoint: string, params?: Record<string, string>): string => {
    const baseUrl = api.getBaseUrl();
    const url = new URL(endpoint, baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }
};

// Price utilities
export const price = {
  format: (amount: number, currency = 'INR'): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency
    }).format(amount);
  },

  calculate: {
    tax: (amount: number, rate = 0.08): number => {
      return amount * rate;
    },
    
    total: (amount: number, taxRate = 0.08): number => {
      return amount + price.calculate.tax(amount, taxRate);
    }
  }
};
