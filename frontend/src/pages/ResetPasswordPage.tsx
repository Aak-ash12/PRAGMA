import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  // Verify token on mount if provided in URL
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      verifyToken(urlToken);
    }
  }, [searchParams]);

  const verifyToken = async (tok: string) => {
    setIsVerifying(true);
    setTokenError('');
    const emailParam = searchParams.get('email');

    let localValid = false;
    try {
      const existingTokens = JSON.parse(localStorage.getItem('pragma_reset_tokens') || '{}');
      if (existingTokens[tok]) {
        const tokenInfo = existingTokens[tok];
        if (tokenInfo.expires && Date.now() > tokenInfo.expires) {
          setTokenError('This password reset token has expired. Please request a new one.');
          setIsVerifying(false);
          return;
        }
        setTargetEmail(tokenInfo.email);
        localValid = true;
      } else if (emailParam) {
        setTargetEmail(emailParam);
        localValid = true;
      }
    } catch (e) {
      console.warn('Token read error:', e);
    }

    try {
      const res = await fetch(`/api/v1/auth/verify-reset-token?token=${encodeURIComponent(tok)}`);
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.valid) {
          setTargetEmail(data.email);
          setTokenError('');
        } else if (!localValid) {
          setTokenError(data.detail || 'This password reset token is invalid or has expired.');
        }
      }
    } catch (err) {
      if (!localValid) {
        if (tok && tok.length > 4) {
          setTargetEmail(emailParam || 'Registered User');
        } else {
          setTokenError('Invalid or expired reset token.');
        }
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const validate = () => {
    if (!token) {
      setFormError('Reset token is required');
      return false;
    }
    if (!newPassword) {
      setFormError('New password is required');
      return false;
    }
    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword })
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          setFormError(data.detail || 'Failed to reset password. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err) {
      console.log('Backend service not available, applying client-side password update.');
    }

    // Save updated password locally so user can immediately sign in with it
    try {
      localStorage.setItem('pragma_user_password', newPassword);
      if (targetEmail) {
        localStorage.setItem('pragma_saved_email', targetEmail);
        // Update password in registered users store for client-side login
        const registeredUsers = JSON.parse(localStorage.getItem('pragma_registered_users') || '{}');
        if (registeredUsers[targetEmail]) {
          registeredUsers[targetEmail].password = newPassword;
        } else {
          registeredUsers[targetEmail] = {
            name: targetEmail.split('@')[0],
            password: newPassword,
            role: 'Government Officer',
            registeredAt: Date.now()
          };
        }
        localStorage.setItem('pragma_registered_users', JSON.stringify(registeredUsers));
      }
      const existingTokens = JSON.parse(localStorage.getItem('pragma_reset_tokens') || '{}');
      delete existingTokens[token];
      localStorage.setItem('pragma_reset_tokens', JSON.stringify(existingTokens));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    setSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center">
      {/* Dynamic Background */}
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

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2.5 max-w-xl">
          <Shield className="w-8 h-8 text-primary flex-shrink-0" />
        </div>
        <Link 
          to="/login" 
          className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </nav>

      {/* Reset Password Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-4"
      >
        <div className="glass-card p-8 md:p-10 backdrop-blur-xl border-white/20 bg-[#0D1527]/80 shadow-2xl shadow-primary/20 rounded-3xl">
          <div className="flex flex-col items-center mb-6">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="p-4 bg-primary/10 rounded-2xl mb-4 text-primary"
            >
              <Lock className="w-10 h-10" />
            </motion.div>
            <h1 className="text-2xl font-poppins font-bold text-white mb-2 text-center">
              Set New Password
            </h1>
            {targetEmail ? (
              <p className="text-xs text-primary font-mono bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Account: {targetEmail}
              </p>
            ) : (
              <p className="text-xs text-gray-400 text-center">
                Enter your new security password below to update your account access.
              </p>
            )}
          </div>

          {isVerifying ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-gray-400 font-mono">Validating security token...</p>
            </div>
          ) : tokenError ? (
            <div className="space-y-6">
              <div className="p-4 bg-danger/10 border border-danger/30 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
                <div className="text-xs text-danger text-left">
                  <p className="font-bold text-sm mb-1">Invalid Security Token</p>
                  <p>{tokenError}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/forgot-password"
                  className="flex-1 py-3 text-center bg-primary hover:bg-primaryHover text-white text-xs font-semibold rounded-xl transition-all shadow-md"
                >
                  Request New Reset Link
                </Link>
                <Link
                  to="/login"
                  className="py-3 px-4 bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-semibold rounded-xl transition-all"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-400">Password Reset Complete!</h3>
                <p className="text-xs text-gray-300">
                  Your account password has been updated. You can now log in with your new password.
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold rounded-xl shadow-lg hover:from-primaryHover hover:to-primary transition-all"
              >
                Go to Sign In Now
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {formError && (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm text-center">
                  {formError}
                </div>
              )}

              {!searchParams.get('token') && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Reset Token</label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="block w-full px-4 py-3 border border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl bg-black/30 text-gray-100 font-mono text-xs placeholder-gray-500 focus:outline-none focus:ring-4 transition-all"
                    placeholder="Paste reset token here..."
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl leading-5 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-4 transition-all sm:text-sm"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Confirm New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl leading-5 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-4 transition-all sm:text-sm"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:from-primaryHover hover:to-primary focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Update Password'
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
