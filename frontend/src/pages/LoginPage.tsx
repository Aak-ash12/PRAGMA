import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('pragma_authenticated', 'true');
        localStorage.setItem('pragma_saved_email', data.email || email);
        localStorage.setItem('pragma_user_role', data.role || 'Government Officer');
        localStorage.setItem('pragma_token', data.access_token || 'bearer.jwt');
        setIsLoading(false);
        navigate('/dashboard');
      } else {
        setIsLoading(false);
        setErrors({ general: data.detail || 'Authentication failed. Please check your credentials.' });
      }
    } catch (err) {
      console.error(err);
      // Fallback for offline client demo authentication
      localStorage.setItem('pragma_authenticated', 'true');
      localStorage.setItem('pragma_saved_email', email);
      setIsLoading(false);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center">
      {/* Animated Glowing Particles Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: i % 2 === 0 ? '#2563EB' : '#7C3AED',
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              filter: 'blur(1px)'
            }}
            animate={{
              y: [0, Math.random() * -100 - 50, 0],
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2.5 max-w-xl">
          <Shield className="w-8 h-8 text-primary flex-shrink-0" />
        </div>
        <Link 
          to="/home" 
          className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-4"
      >
        <div className="glass-card p-8 md:p-10 backdrop-blur-xl border-white/20 bg-[#0D1527]/70 shadow-2xl shadow-primary/20 rounded-3xl">
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-primary/10 rounded-2xl mb-4"
            >
              <Shield className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-xl md:text-2xl font-poppins font-bold text-white mb-2 text-center leading-snug">
              Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin
            </h1>
            <p className="text-xs text-center text-primary font-mono tracking-widest uppercase font-semibold">
              Enter your email and password to access platform
            </p>
          </div>

          <div className="space-y-5" onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(e as any); }}>
            {errors.general && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm text-center">
                {errors.general}
                {errors.general.includes('Forgot password') && (
                  <div className="mt-1">
                    <Link to="/forgot-password" className="text-xs font-bold underline text-primary hover:text-white">
                      Click here to reset your password
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-white/10 focus:border-primary focus:ring-primary/20'} rounded-xl leading-5 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-4 transition-all sm:text-sm`}
                  placeholder="Enter your email ID"
                />
              </div>
              {errors.email && <p className="text-danger text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  style={{ WebkitTextSecurity: 'disc' }}
                  autoComplete="off"
                  data-lpignore="true"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-white/10 focus:border-primary focus:ring-primary/20'} rounded-xl leading-5 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-4 transition-all sm:text-sm`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="text-danger text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 bg-black/20 border-white/10 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primaryHover transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-semibold text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating Account...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </div>
            
            <div className="text-center mt-6 text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary hover:text-primaryHover transition-colors">
                Create one
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
