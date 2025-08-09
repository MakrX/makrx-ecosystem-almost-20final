// ========================================
// LOGIN PAGE COMPONENT
// ========================================
// Main login interface for MakrCave authentication
// Features:
// - Email/password login form
// - Password visibility toggle
// - Error handling and loading states
// - Responsive design with glassmorphism styling
// - Theme toggle support

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Eye, EyeOff, Lock, Mail, User, Crown, Shield, Wrench, Settings, UserCheck } from 'lucide-react';
import { ThemeToggle } from '../../../packages/ui/components/ThemeToggle';

export default function Login() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  const [email, setEmail] = useState('');           // User's email input
  const [password, setPassword] = useState('');     // User's password input
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state during login
  const [error, setError] = useState('');           // Error message display

  // Context and navigation hooks
  const { login } = useAuth();                      // Authentication context
  const navigate = useNavigate();                   // React Router navigation

  // ========================================
  // LOGIN HANDLER
  // ========================================
  // Processes the login form submission
  // Redirects to dashboard on success
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);  // Show loading state
    setError('');        // Clear previous errors

    try {
      // Attempt authentication with email/password
      await login({ username: email, password });
      // Redirect to main dashboard on successful login
      navigate('/portal/dashboard');
    } catch (error) {
      // Display error message to user
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-makrx-blue via-makrx-blue/95 to-makrx-blue/90 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle variant="default" />
      </div>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-lg rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-makrx-teal/30 rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-white/10 rounded-lg -rotate-12"></div>
      </div>
      
      <div className="w-full max-w-md relative">
        {/* Login Card */}
        <div className="backdrop-blur-md border border-white/20 rounded-2xl p-8 bg-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {/* CUSTOMIZATION: Change the logo icon and colors here */}
              <div className="w-16 h-16 bg-makrx-teal rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {/* CUSTOMIZATION: Change the application name here */}
            Welcome to <span className="text-makrx-teal">MakrCave</span>
          </h1>
            <p className="text-white/80">Sign in to your makerspace portal</p>
          </div>



          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-makrx-teal focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-makrx-teal focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-makrx-teal text-white font-semibold py-3 rounded-lg hover:bg-makrx-teal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Access MakrCave'
              )}
            </button>
          </form>

          {/* Account Actions */}
          <div className="mt-6 space-y-4">
            {/* Forgot Password */}
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-white/60 hover:text-makrx-teal text-sm font-medium"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-makrx-teal hover:text-makrx-teal-light font-medium"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">
                🔐 Secure Authentication • Powered by MakrCave
              </p>
            </div>
          </div>
        </div>

        {/* Back to Gateway */}
        <div className="text-center mt-6">
          <a 
            href="https://e986654b5a5843d7b3f8adf13b61022c-556d114307be4dee892ae999b.projects.builder.codes"
            className="text-white/80 hover:text-white text-sm flex items-center justify-center gap-2"
          >
            ← Back to MakrX Gateway
          </a>
        </div>
      </div>
    </div>
  );
}
