import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, clearError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      // Error is handled by AuthContext
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-makrx-blue via-makrx-blue/95 to-makrx-blue/90 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 makrx-circuit-bg opacity-20" />

      <div className="w-full max-w-md relative">
        {/* Login Card */}
        <div className="backdrop-blur-md border border-white/20 rounded-2xl p-8 bg-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src="https://cdn.builder.io/api/v1/assets/f367f5e46f75423a83d3f29fae529dbb/botlogofinal-c921e6?format=webp&width=800"
                  alt="MakrBot"
                  className="w-16 h-16"
                />
                <div className="absolute inset-0 bg-makrx-yellow/20 rounded-full blur-lg" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to <span className="text-makrx-yellow">MakrX</span>
            </h1>
            <p className="text-white/80">
              Sign in to access the maker ecosystem
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-white text-sm font-medium mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-makrx-yellow focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-white text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-makrx-yellow focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-400">{error.message}</p>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="bg-makrx-yellow/10 border border-makrx-yellow/20 rounded-lg p-3">
              <p className="text-xs text-makrx-yellow font-medium mb-1">
                Demo Credentials:
              </p>
              <p className="text-xs text-white/80">Email: demo@makrx.org</p>
              <p className="text-xs text-white/80">Password: makrx2024</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-makrx-yellow text-makrx-blue font-semibold py-3 rounded-lg hover:bg-makrx-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-makrx-blue/30 border-t-makrx-blue rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

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
