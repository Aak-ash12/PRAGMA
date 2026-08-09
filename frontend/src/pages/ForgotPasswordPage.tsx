import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Loader2, Mail, CheckCircle2, RefreshCw, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// ──────────────────────────────────────────────────────
// EmailJS Configuration
// Replace these with your actual EmailJS credentials:
//   1. Sign up at https://www.emailjs.com
//   2. Add an Email Service (e.g., Gmail) → copy the Service ID
//   3. Create a Template with variables: {{to_email}}, {{reset_link}}, {{project_name}}
//   4. Copy the Template ID and your Public Key from Account → API Keys
// ──────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = 'service_qof44tn';    // ← Your Service ID (Added!)
const EMAILJS_TEMPLATE_ID = 'template_iggxmbb';   // ← Your Template ID (Added!)
const EMAILJS_PUBLIC_KEY = 'yB5cmyuKqumoS1nuebGvq';    // ← Your Public Key (Added!)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

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

  const generateResetLink = (targetEmail: string): { token: string; link: string } => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const link = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(targetEmail)}`;

    // Persist token in localStorage for client-side validation
    try {
      const existingTokens = JSON.parse(localStorage.getItem('pragma_reset_tokens') || '{}');
      existingTokens[token] = {
        email: targetEmail,
        expires: Date.now() + 3600000, // 1 hour validity
        createdAt: Date.now()
      };
      localStorage.setItem('pragma_reset_tokens', JSON.stringify(existingTokens));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    return { token, link };
  };

  const sendResetEmail = async (targetEmail: string, resetLink: string): Promise<boolean> => {
    // 1️⃣ Try EmailJS (works on Netlify static deployment)
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: targetEmail,
          reset_link: resetLink,
          project_name: 'PRAGMA — Predictive Risk Analysis & Governance Management Assistant',
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log(`[EmailJS] Reset email sent to ${targetEmail}`);
      return true;
    } catch (emailjsErr) {
      console.warn('[EmailJS] Delivery error:', emailjsErr);
    }

    // 2️⃣ Fallback: Try backend API if available (for local dev with backend running)
    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok && data.email_sent) {
          return true;
        }
      }
    } catch (err) {
      console.log('Backend API unavailable.');
    }

    // Even if email services fail, the token was still generated and stored locally
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError('');
    setSuccessEmail(null);

    const cleanEmail = email.trim().toLowerCase();
    const { link } = generateResetLink(cleanEmail);

    const sent = await sendResetEmail(cleanEmail, link);

    if (sent) {
      setSuccessEmail(cleanEmail);
    } else {
      // Even if email delivery failed, show success for security reasons
      // (don't reveal whether the email exists) and the token is stored locally
      setSuccessEmail(cleanEmail);
    }

    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!successEmail || resendCooldown > 0) return;

    setIsResending(true);
    const { link } = generateResetLink(successEmail);
    await sendResetEmail(successEmail, link);
    setIsResending(false);

    // Start 60-second cooldown
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
              Enter your registered email address below. We'll send a password reset link directly to your inbox.
            </p>
          </div>

          {!successEmail ? (
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
              {/* Success Banner */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 leading-relaxed">
                  <p className="font-bold text-sm text-emerald-400 mb-1">Reset Link Sent!</p>
                  <p>A password reset link has been sent to <strong>{successEmail}</strong>.</p>
                </div>
              </div>

              {/* Email Check Instruction Card */}
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Inbox className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Check Your Email</p>
                    <p className="text-[11px] text-gray-400">The link will expire in 1 hour</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">1.</span>
                    <span>Open your email inbox for <strong className="text-gray-200">{successEmail}</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">2.</span>
                    <span>Look for an email from <strong className="text-gray-200">PRAGMA Security</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">3.</span>
                    <span>Click the <strong className="text-gray-200">"Reset Password"</strong> button in the email</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-[11px] text-amber-300">
                    💡 <strong>Tip:</strong> If you don't see the email, check your <strong>Spam</strong> or <strong>Promotions</strong> folder.
                  </p>
                </div>
              </div>

              {/* Resend Button */}
              <button
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {resendCooldown > 0
                  ? `Resend available in ${resendCooldown}s`
                  : isResending
                  ? 'Sending...'
                  : "Didn't receive it? Resend Email"}
              </button>

              {/* Try Another Email */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setSuccessEmail(null); setEmail(''); }}
                  className="flex-1 text-xs text-gray-400 hover:text-white transition-colors underline py-2"
                >
                  Try a different email address
                </button>
                <Link
                  to="/login"
                  className="flex-1 text-xs text-primary hover:text-primaryHover transition-colors text-center py-2 font-semibold"
                >
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
