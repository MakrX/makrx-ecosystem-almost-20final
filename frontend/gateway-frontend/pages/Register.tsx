import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Eye, EyeOff, Lock, Mail, User, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    // Simulate API call for registration
    setTimeout(() => {
      // Simulate successful registration and auto-login
      localStorage.setItem('makrx_user', JSON.stringify({
        id: Date.now().toString(),
        email: formData.email,
        username: formData.email.split('@')[0],
        firstName: formData.firstName,
        lastName: formData.lastName,
        roles: ['maker']
      }));
      
      localStorage.setItem('makrx_access_token', 'dummy_token_' + Date.now());
      setIsLoading(false);
      navigate('/');
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-makrx-blue via-makrx-blue/95 to-makrx-blue/90 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 makrx-circuit-bg opacity-20" />
      
      <div className="w-full max-w-md relative">
        {/* Register Card */}
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
              Join the <span className="text-makrx-yellow">MakrX</span> Community
            </h1>
            <p className="text-white/80">Create your account to access the maker ecosystem</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-white text-sm font-medium mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 bg-white/10 border ${errors.firstName ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-makrx-yellow focus:border-transparent text-sm`}
                    placeholder="John"
                    required
                  />
                </div>
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-white text-sm font-medium mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 bg-white/10 border ${errors.lastName ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-makrx-yellow focus:border-transparent text-sm`}
                    placeholder="Doe"
                    required
                  />
                </div>
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-makrx-yellow focus:border-transparent text-sm`}
                  placeholder="john@example.com"
                  required
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 bg-white/10 border ${errors.password ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-makrx-yellow focus:border-transparent text-sm`}
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 bg-white/10 border ${errors.confirmPassword ? 'border-red-400' : 'border-white/20'} rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-makrx-yellow focus:border-transparent text-sm`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms Agreement */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-white/80">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-makrx-yellow hover:text-makrx-yellow/80">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-makrx-yellow hover:text-makrx-yellow/80">Privacy Policy</Link>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-makrx-yellow text-makrx-blue font-semibold py-3 rounded-lg hover:bg-makrx-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-makrx-blue/30 border-t-makrx-blue rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-makrx-yellow hover:text-makrx-yellow/80">
                Sign in
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
