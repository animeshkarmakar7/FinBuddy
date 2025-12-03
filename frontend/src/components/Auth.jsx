import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Loader,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError('');
    setLocalSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          setLocalSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess();
          }, 1000);
        } else {
          setLocalError(result.error || 'Login failed');
        }
      } else {
        // Register
        if (!formData.name.trim()) {
          setLocalError('Please enter your name');
          setIsLoading(false);
          return;
        }

        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          setLocalSuccess('Registration successful! Redirecting...');
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess();
          }, 1000);
        } else {
          setLocalError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setLocalError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setLocalError('');
    setLocalSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
            FinBuddy 💰
          </h1>
          <p className="text-violet-600/70">
            {isLogin ? 'Welcome back!' : 'Start your financial journey'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-200/50 p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg'
                  : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
              }`}
            >
              <LogIn className="w-5 h-5 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg'
                  : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
              }`}
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Sign Up
            </button>
          </div>

          {/* Error/Success Messages */}
          {localError && (
            <div className="mb-4 p-3 bg-rose-100 border border-rose-300 rounded-lg flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{localError}</span>
            </div>
          )}

          {localSuccess && (
            <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{localSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-violet-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-violet-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 hover:text-violet-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-violet-600/70 mt-1">
                  At least 6 characters with letters and numbers
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      Login
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-violet-600/70">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-violet-600 font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-violet-600/70 mt-6">
          Secure authentication powered by JWT 🔒
        </p>
      </div>
    </div>
  );
};

export default Auth;
