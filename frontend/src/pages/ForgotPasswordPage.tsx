import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Loader2, Mail, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    message: string;
    email: string;
    reset_link: string;
    reset_token: string;
    email_sent: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    if (!email) {
      setError('Email address is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError('');
    setSuccessData(null);

    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessData(data);
      } else {
        setError(data.detail || 'Failed to dispatch reset request. Please check your network.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center">
      {/* Animated Glowing Background */}
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

      {/* Navigation */}
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

      {/* Forgot Password Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-4"
      >
        <div className="glass-card p-8 md:p-10 backdrop-blur-xl border-white/20 bg-[#0D1527]/80 shadow-2xl shadow-primary/20 rounded-3xl">
          <div className="flex flex-col items-center mb-6">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-4 bg-primary/10 rounded-2xl mb-4 text-primary"
            >
              <Mail className="w-10 h-10" />
            </motion.div>
            <h1 className="text-2xl font-poppins font-bold text-white mb-2 text-center">
              Forgot Your Password?
            </h1>
            <p className="text-xs text-gray-400 text-center max-w-sm">
              Enter any registered or active email address below to receive an instant password reset link.
            </p>
          </div>

          {!successData ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl leading-5 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-4 transition-all sm:text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:from-primaryHover hover:to-primary focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </div>

              <div className="text-center mt-4">
                <Link to="/login" className="text-xs text-gray-400 hover:text-primary transition-colors">
                  Remembered your password? <span className="text-primary font-bold">Sign In</span>
                </Link>
              </div>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 leading-relaxed">
                  <p className="font-bold text-sm text-emerald-400 mb-1">Reset Link Dispatched!</p>
                  <p>A password reset link has been dispatched to <strong>{successData.email}</strong>.</p>
                </div>
              </div>

              {/* Immediate Reset Access Box */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="font-medium text-gray-300">Direct Reset Access Link</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-mono font-semibold">Active Token</span>
                </div>

                <div className="p-2.5 bg-black/60 rounded-xl border border-white/10 font-mono text-xs text-primary truncate">
                  {successData.reset_link}
                </div>

                <div className="flex gap-2">
                  <a 
                    href={successData.reset_link}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-primary hover:bg-primaryHover text-white text-xs font-semibold rounded-xl transition-all shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Reset Password Now
                  </a>
                  <button
                    onClick={() => copyToClipboard(successData.reset_link)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-medium rounded-xl transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setSuccessData(null)}
                  className="text-xs text-gray-400 hover:text-white transition-colors underline"
                >
                  Send link to another email address
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
