/**
 * MakrX Ecosystem SSO Utilities
 * Centralized authentication functions for consistent SSO across all MakrX sites
 */

// Default SSO configuration. Values can be overridden using environment
// variables at build time or by calling `configureSSO` at runtime.
const DEFAULT_CLIENTS = {
  'makrx.org': 'makrx-gateway',
  'makrcave.com': 'makrx-cave',
  'makrx.store': 'makrx-store',
  localhost: 'makrx-store'
};

function loadEnvClients(envValue) {
  if (!envValue) return {};
  try {
    return JSON.parse(envValue);
  } catch {
    return {};
  }
}

const env = typeof process !== 'undefined' && process.env ? process.env : {};

let SSO_CONFIG = {
  authDomain: env.SSO_AUTH_DOMAIN || 'http://localhost:8080',
  realm: env.SSO_REALM || 'makrx',
  clients: { ...DEFAULT_CLIENTS, ...loadEnvClients(env.SSO_CLIENTS) }
};

function configureSSO(overrides = {}) {
  SSO_CONFIG = {
    ...SSO_CONFIG,
    ...overrides,
    clients: { ...SSO_CONFIG.clients, ...(overrides.clients || {}) }
  };
}

/**
 * Base64URL encode an ArrayBuffer
 */
function base64UrlEncode(buffer) {
  let base64;
  if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(buffer).toString('base64');
  } else {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => (binary += String.fromCharCode(b)));
    base64 = btoa(binary);
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64').toString('utf8');
  } else {
    const padding = 4 - (str.length % 4);
    if (padding !== 4) str += '='.repeat(padding);
    return atob(str);
  }
}

/**
 * Generate PKCE code verifier and challenge
 */
async function generatePKCE() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = base64UrlEncode(array);

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = base64UrlEncode(digest);

  return { codeVerifier, codeChallenge };
}

/**
 * Generate a nonce for OIDC flow
 */
function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Get the appropriate client ID based on the current domain
 */
function getClientId(hostname) {
  let host = hostname;
  if (!host && typeof window !== 'undefined') host = window.location.hostname;

  if (!host || host === 'localhost' || host.startsWith('localhost') || host === '127.0.0.1') {
    return SSO_CONFIG.clients['localhost'];
  }

  host = host.toLowerCase();
  const match = Object.entries(SSO_CONFIG.clients).find(([domain]) =>
    host === domain || host.endsWith(`.${domain}`)
  );
  if (match) return match[1];

  // Fallback to localhost client in non-production environments
  return SSO_CONFIG.clients['localhost'] || Object.values(SSO_CONFIG.clients)[0];
}

/**
 * Generate a secure random state for OAuth flow
 */
function generateState() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store the current URL for post-login redirect
 */
function storeRedirectUrl(url) {
  if (typeof window !== 'undefined') {
    const target = url || window.location.href;
    sessionStorage.setItem('makrx_redirect_url', target);
  }
}

/**
 * Get stored redirect URL and clear it
 */
function getAndClearRedirectUrl() {
  if (typeof window === 'undefined') return null;
  
  const url = sessionStorage.getItem('makrx_redirect_url');
  sessionStorage.removeItem('makrx_redirect_url');
  return url;
}

/**
 * Redirect to SSO login with proper return URL
 */
async function redirectToSSO(redirectUrl) {
  if (typeof window === 'undefined') return;

  storeRedirectUrl(redirectUrl);

  const clientId = getClientId();
  const state = generateState();
  const redirectUri = `${window.location.origin}/auth/callback`;
  const { codeVerifier, codeChallenge } = await generatePKCE();
  const nonce = generateNonce();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    nonce
  });

  sessionStorage.setItem('makrx_oauth_state', state);
  sessionStorage.setItem('makrx_code_verifier', codeVerifier);
  sessionStorage.setItem('makrx_nonce', nonce);

  window.location.href = `${SSO_CONFIG.authDomain}/realms/${SSO_CONFIG.realm}/protocol/openid-connect/auth?${params}`;
}

/**
 * Exchange authorization code for tokens using stored code verifier
 */
async function exchangeCodeForTokens(code) {
  if (typeof window === 'undefined') throw new Error('No window context');

  const codeVerifier = sessionStorage.getItem('makrx_code_verifier');
  const nonce = sessionStorage.getItem('makrx_nonce');
  const clientId = getClientId();
  const redirectUri = `${window.location.origin}/auth/callback`;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier || ''
  });

  const tokenUrl = `${SSO_CONFIG.authDomain}/realms/${SSO_CONFIG.realm}/protocol/openid-connect/token`;
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  if (!response.ok) throw new Error('Token exchange failed');

  const tokens = await response.json();

  if (tokens.id_token && nonce) {
    const payload = JSON.parse(base64UrlDecode(tokens.id_token.split('.')[1]));
    if (payload.nonce !== nonce) {
      throw new Error('Invalid nonce');
    }
  }

  sessionStorage.removeItem('makrx_code_verifier');
  sessionStorage.removeItem('makrx_nonce');

  return tokens;
}

/**
 * Logout from SSO and redirect
 */
function logoutFromSSO() {
  if (typeof window === 'undefined') return;
  
  const clientId = getClientId();
  const params = new URLSearchParams({
    client_id: clientId,
    post_logout_redirect_uri: window.location.origin
  });
  
  // Clear local storage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('makrx_')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear session storage
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('makrx_')) {
      sessionStorage.removeItem(key);
    }
  });
  
  // Redirect to SSO logout
  window.location.href = `${SSO_CONFIG.authDomain}/realms/${SSO_CONFIG.realm}/protocol/openid-connect/logout?${params}`;
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = {
    redirectToSSO,
    exchangeCodeForTokens,
    logoutFromSSO,
    getClientId,
    getAndClearRedirectUrl,
    SSO_CONFIG,
    configureSSO
  };
} else if (typeof window !== 'undefined') {
  // Browser global
  window.MakrXSSO = {
    redirectToSSO,
    exchangeCodeForTokens,
    logoutFromSSO,
    getClientId,
    getAndClearRedirectUrl,
    SSO_CONFIG,
    configureSSO
  };
}

// ES6 modules
export {
  redirectToSSO,
  exchangeCodeForTokens,
  logoutFromSSO,
  getClientId,
  getAndClearRedirectUrl,
  SSO_CONFIG,
  configureSSO
};
