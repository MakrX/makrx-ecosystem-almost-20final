import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Eye, EyeOff, Lock, Mail, User, Crown, Shield, Wrench, Settings, UserCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, getDemoUsers } = useAuth();
  const navigate = useNavigate();

  const demoUsers = getDemoUsers();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/portal/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (userEmail: string) => {
    setIsLoading(true);
    setError('');

    try {
      await login(userEmail, 'demo');
      navigate('/portal/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return Crown;
      case 'admin': return Shield;
      case 'makerspace_admin': return Wrench;
      case 'service_provider': return Settings;
      case 'maker': return UserCheck;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'from-purple-500 to-purple-600';
      case 'admin': return 'from-blue-500 to-blue-600';
      case 'makerspace_admin': return 'from-makrx-blue to-blue-700';
      case 'service_provider': return 'from-yellow-500 to-yellow-600';
      case 'maker': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-makrx-blue via-makrx-blue/95 to-makrx-blue/90 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-lg rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-makrx-yellow/30 rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-white/10 rounded-lg -rotate-12"></div>
      </div>
      
      <div className="w-full max-w-md relative">
        {/* Login Card */}
        <div className="backdrop-blur-md border border-white/20 rounded-2xl p-8 bg-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-makrx-teal rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to <span className="text-makrx-teal">MakrCave</span>
          </h1>
            <p className="text-white/80">Sign in to your makerspace portal</p>
          </div>

          {/* Demo Users */}
          <div className="mb-8">
            <h3 className="text-white text-sm font-medium mb-4 text-center">
              Quick Login - Demo Users
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {demoUsers.map((user) => {
                const IconComponent = getRoleIcon(user.role);
                return (
                  <button
                    key={user.id}
                    onClick={() => quickLogin(user.email)}
                    disabled={isLoading}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${getRoleColor(user.role)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-white/60 text-xs capitalize">
                        {user.role.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="text-white/40 text-xs">
                      {user.email}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-makrx-blue text-white/60">or login manually</span>
            </div>
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
              className="w-full bg-makrx-yellow text-makrx-blue font-semibold py-3 rounded-lg hover:bg-makrx-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-makrx-blue/30 border-t-makrx-blue rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Access MakrCave'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">
                🔐 Integrated with MakrX SSO • Powered by Keycloak
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
