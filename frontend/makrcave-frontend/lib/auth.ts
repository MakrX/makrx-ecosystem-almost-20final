import Keycloak, { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = async () => {
  const authenticated = await keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    checkLoginIframe: false,
  });

  if (authenticated) {
    scheduleRefresh();
  }

  return authenticated;
};

function scheduleRefresh() {
  if (!keycloak.tokenParsed?.exp) return;
  const refreshTime = (keycloak.tokenParsed.exp * 1000 - Date.now()) * 0.75;
  window.setTimeout(async () => {
    try {
      await keycloak.updateToken(30);
      scheduleRefresh();
    } catch (err) {
      console.error('Token refresh failed', err);
      login();
    }
  }, refreshTime);
}

export const login = () => keycloak.login();
export const logout = () => keycloak.logout();
export const getToken = async () => {
  try {
    await keycloak.updateToken(30);
    return keycloak.token || '';
  } catch (err) {
    console.error('Token refresh failed', err);
    login();
    return '';
  }
};
export const isAuthenticated = () => Boolean(keycloak.authenticated);
export const getUser = () => keycloak.tokenParsed as any || null;

export default keycloak;
