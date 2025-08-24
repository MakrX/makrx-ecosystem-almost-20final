import Keycloak, { KeycloakConfig } from 'keycloak-js';


import { jwtDecode } from "jwt-decode";
import {
  redirectToSSO,
  exchangeCodeForTokens,
} from "../../../makrx-sso-utils.js";


const keycloak = new Keycloak(keycloakConfig);

export interface User {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  email_verified?: boolean;
  roles: string[];
  scopes: string[];
}

let currentUser: User | null = null;
let listeners: Array<(user: User | null) => void> = [];

function notify() {
  listeners.forEach(l => l(currentUser));
}

export const init = async () => {
  const authenticated = await keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri:
      typeof window !== 'undefined'
        ? `${window.location.origin}/silent-check-sso.html`
        : undefined,
    checkLoginIframe: false,
  });

  if (authenticated) {
    updateUser();
    keycloak.onTokenExpired = async () => {
      try {
        await keycloak.updateToken(30);
        updateUser();
      } catch {
        login();
      }
    };
  }
};

function updateUser() {
  if (keycloak.tokenParsed) {
    currentUser = {
      sub: keycloak.tokenParsed.sub as string,
      email: keycloak.tokenParsed.email as string | undefined,
      name: keycloak.tokenParsed.name as string | undefined,
      preferred_username: keycloak.tokenParsed.preferred_username as string | undefined,
      email_verified: (keycloak.tokenParsed.email_verified as boolean) || false,
      roles: (keycloak.tokenParsed.realm_access?.roles as string[]) || [],
      scopes: (keycloak.tokenParsed.scope as string)?.split(' ') || [],
    };
    notify();
  }
}

export const login = () => keycloak.login();
export const logout = () => keycloak.logout();
export const getToken = async () => {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
    } catch {
      login();
    }
  }
  return keycloak.token ?? null;
};
export const getCurrentUser = () => currentUser;
export const isAuthenticated = () => keycloak.authenticated ?? false;
export const hasRole = (role: string) => currentUser?.roles.includes(role) ?? false;
export const hasAnyRole = (roles: string[]) => roles.some(hasRole);
export const hasScope = (scope: string) => currentUser?.scopes.includes(scope) ?? false;
export const addAuthListener = (l: (u: User | null) => void) => { listeners.push(l); };
export const removeAuthListener = (l: (u: User | null) => void) => { listeners = listeners.filter(fn => fn !== l); };


export const hasScope = (scope: string): boolean => {
  const user = getCurrentUser();
  return user?.scopes.includes(scope) || false;
};

// Authentication flow
export const login = (redirectUri?: string): void => {
  if (!isClient) return;

  // Use shared SSO utility which handles PKCE, nonce and state
  void redirectToSSO(redirectUri);
};

export const logout = async (): Promise<void> => {
  const token = await getToken();

  // Clear local tokens
  clearTokens();

  // Redirect to Keycloak logout
  if (isClient && token) {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      post_logout_redirect_uri: window.location.origin,
    });

    window.location.href = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout?${params}`;
  }
};

// Handle auth callback
export const handleAuthCallback = async (
  code: string,
  state: string,
): Promise<boolean> => {
  if (!isClient) return false;

  try {
    // Verify state parameter stored during SSO redirect
    const storedState = sessionStorage.getItem('makrx_oauth_state');
    if (state !== storedState) {
      throw new Error("Invalid state parameter");
    }

    // Exchange code for tokens using shared SSO utility
    const tokens = (await exchangeCodeForTokens(code)) as AuthTokens;
    setTokens(tokens);

    // Clean up state
    sessionStorage.removeItem('makrx_oauth_state');

    return true;
  } catch (error) {
    // In development, silently handle auth errors
    if (process.env.NODE_ENV === "development") {
      console.warn("Auth service unavailable in development mode");
    } else {
      console.error("Auth callback failed:", error);
    }
    clearTokens();
    return false;
  }
};

// Auth listeners
export const addAuthListener = (
  listener: (user: User | null) => void,
): void => {
  authListeners.push(listener);
};

export const removeAuthListener = (
  listener: (user: User | null) => void,
): void => {
  authListeners = authListeners.filter((l) => l !== listener);
};

const notifyAuthListeners = (user: User | null): void => {
  authListeners.forEach((listener) => {
    try {
      listener(user);
    } catch (error) {
      console.error("Auth listener error:", error);
    }
  });
};

// Initialize auth state on load
if (isClient) {
  // Check if we have valid tokens and user info
  const token = getStoredItem(ACCESS_TOKEN_KEY);
  const userInfo = getStoredItem(USER_INFO_KEY);

  if (token && userInfo) {
    try {
      currentUser = JSON.parse(userInfo);

      // Verify token is still valid
      getToken().then((validToken) => {
        if (!validToken) {
          clearTokens();
        }
      });
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
      clearTokens();
    }
  }
}

// Auto-refresh token before expiry
if (isClient) {
  setInterval(async () => {
    const token = getStoredItem(ACCESS_TOKEN_KEY);
    const expiresAt = getStoredItem(TOKEN_EXPIRES_KEY);

    if (token && expiresAt) {
      const expires = parseInt(expiresAt, 10);
      const now = Date.now();
      const timeUntilExpiry = expires - now;

      // Refresh if token expires in less than 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        await refreshToken();
      }
    }
  }, 60 * 1000); // Check every minute
}

// Export auth utilities

export const auth = {
  init,
  login,
  logout,
  getToken,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  hasAnyRole,
  hasScope,
  addAuthListener,
  removeAuthListener,
};

export default auth;
