import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { auth } from '@makrx/utils';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const authError = params.get('error');

        if (authError) throw new Error(authError);
        if (!code || !state) throw new Error('Missing authentication parameters');

        const storedState =
          sessionStorage.getItem('makrx_auth_state') ||
          sessionStorage.getItem('makrx_oauth_state');
        if (state !== storedState) throw new Error('Invalid state parameter');
        sessionStorage.removeItem('makrx_auth_state');
        sessionStorage.removeItem('makrx_oauth_state');

        const keycloakUrl =
          import.meta.env.VITE_KEYCLOAK_URL ||
          'http://localhost:8080/realms/makrx';

        const response = await fetch(
          `${keycloakUrl}/protocol/openid-connect/token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: 'makrx-gateway',
              code,
              redirect_uri: window.location.origin + '/auth/callback',
            }),
          },
        );

        if (!response.ok) throw new Error('Token exchange failed');
        const tokens = await response.json();
        auth.setTokens({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: Date.now() + tokens.expires_in * 1000,
        });

        setStatus('success');
        const redirectUrl =
          sessionStorage.getItem('makrx_redirect_url') || '/';
        sessionStorage.removeItem('makrx_redirect_url');
        setTimeout(() => navigate(redirectUrl), 1500);
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
        setTimeout(() => navigate('/'), 3000);
      }
    };
    processCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Completing Sign In
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we authenticate you...
              </p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign In Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Redirecting you to your destination...
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign In Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error || 'An error occurred during authentication'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to home page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
