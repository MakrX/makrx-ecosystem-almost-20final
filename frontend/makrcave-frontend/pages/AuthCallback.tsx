import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { ThemeToggle } from '../../../packages/ui/components/ThemeToggle';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { getAndClearRedirectUrl } from '../../../makrx-sso-utils.js';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
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

        await authService.handleAuthCallback(code);
        await refreshUser();

        setStatus('success');
        const redirectUrl = getAndClearRedirectUrl() || '/portal/dashboard';
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
    <div className="min-h-screen bg-gradient-to-br from-makrx-blue via-makrx-blue/95 to-makrx-blue/90 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle variant="default" />
      </div>
      <div className="w-full max-w-md relative">
        <div className="backdrop-blur-md border border-white/20 rounded-2xl p-8 bg-white/10 text-center">
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="w-6 h-6 text-makrx-teal animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Completing Sign In</h2>
              <p className="text-white/80 mb-4">Please wait while we authenticate you...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome to <span className="text-makrx-teal">MakrCave</span>!</h2>
              <p className="text-white/80">Redirecting you to your dashboard...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-4">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Sign In Failed</h2>
              <p className="text-white/80 mb-4">{error || 'An error occurred during authentication'}</p>
              <p className="text-sm text-white/60">Redirecting to home page...</p>
            </>
          )}
          <div className="mt-8 text-center">
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">🔐 Secure Single Sign-On • Powered by MakrX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
