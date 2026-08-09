import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Loader2, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
    if (!name) {
      newErrors.name = 'Full name is required';
    }
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
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          role: 'Government Officer'
        })
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
        setErrors({ general: data.detail || 'Registration failed. Please try again.' });
      }
    } catch (err) {
      console.error(err);
      // Offline fallback registration
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

      {/* Register Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md my-16 px-4"
      >
        <div className="glass-card p-8 md:p-10 backdrop-blur-xl border-white/10 bg-[#111827]/80 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-poppins font-bold text-white mb-2">Create Account</h1>
            <p className="text-xs text-center text-primary font-mono tracking-wider uppercase font-semibold">
              Digital Twin Smart Cities Platform
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm text-center">
                {errors.general}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-white/10 focus:border-primary focus:ring-primary/20'} rounded-xl leading-5 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-4 transition-all sm:text-sm`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-danger text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-white/10 focus:border-primary focus:ring-primary/20'} rounded-xl leading-5 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-4 transition-all sm:text-sm`}
                  placeholder="name@example.com"
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
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-danger text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  style={{ WebkitTextSecurity: 'disc' }}
                  autoComplete="off"
                  data-lpignore="true"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.confirmPassword ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-white/10 focus:border-primary focus:ring-primary/20'} rounded-xl leading-5 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-4 transition-all sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-danger text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:from-primaryHover hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </div>
            
            <div className="text-center mt-6 text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primaryHover transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
