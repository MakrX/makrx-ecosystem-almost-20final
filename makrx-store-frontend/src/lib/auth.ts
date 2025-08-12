import Keycloak, { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'https://auth.makrx.org',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'makrx',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'makrx-store',
};

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
