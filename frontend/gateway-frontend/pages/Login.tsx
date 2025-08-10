import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

export default function Login() {
  // Redirect immediately to SSO
  useEffect(() => {
    // Store referrer for redirect after login
    const referrer = document.referrer || window.location.origin;
    sessionStorage.setItem('makrx_redirect_url', referrer);

    // Redirect to auth.makrx.org
    const params = new URLSearchParams({
      client_id: 'makrx-gateway',
      redirect_uri: window.location.origin + '/auth/callback',
      response_type: 'code',
      scope: 'openid email profile',
      state: Math.random().toString(36).substring(2)
    });

    window.location.href = `https://auth.makrx.org/realms/makrx/protocol/openid-connect/auth?${params}`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-makrx-blue via-makrx-blue/95 to-makrx-blue/90 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 makrx-circuit-bg opacity-20" />

      <div className="w-full max-w-md relative">
        {/* Loading Card */}
        <div className="backdrop-blur-md border border-white/20 rounded-2xl p-8 bg-white/10 text-center">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Bot className="w-16 h-16 text-makrx-yellow animate-pulse" />
                <div className="absolute inset-0 bg-makrx-yellow/20 rounded-full blur-lg animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Redirecting to <span className="text-makrx-yellow">MakrX SSO</span>
            </h1>
            <p className="text-white/80 mb-6">
              Please wait while we redirect you to the secure authentication portal at
            </p>
            <p className="text-makrx-yellow font-mono text-sm mb-6">
              auth.makrx.org
            </p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-white/30 border-t-makrx-yellow rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-makrx-yellow hover:text-makrx-yellow/80"
              >
                Sign up
              </Link>
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">
                🔐 This will be integrated with Keycloak SSO
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-white/80 hover:text-white text-sm flex items-center justify-center gap-2"
          >
            ← Back to MakrX
          </Link>
        </div>
      </div>
    </div>
  );
}
