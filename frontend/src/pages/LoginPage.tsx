import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, ArrowLeft, Loader2, Mail, Lock, 
  Building2, ShieldAlert, Zap, Cpu, Sparkles, Check, ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SeedAccount {
  id: string;
  roleLabel: string;
  badge: string;
  clearance: string;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  avatar: string;
  department: string;
  badgeId: string;
  region: string;
  phone: string;
  bio: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  icon: React.ElementType;
}

const SEED_ACCOUNTS: SeedAccount[] = [
  {
    id: 'gov',
    roleLabel: 'Government Officer',
    badge: 'Executive Admin',
    clearance: 'Level 5 (Autonomous Override)',
    email: 'admin@pragma.gov',
    password: 'password123',
    role: 'Government Officer',
    firstName: 'Daemon',
    lastName: 'Targaryen',
    avatar: 'Daemon',
    department: 'Smart City Governance & Digital Infrastructure Directorate',
    badgeId: 'PRAGMA-GOV-TN-2026-088',
    region: 'Chennai Metropolitan Hub & State Command',
    phone: '+91 94440 12890',
    bio: 'Senior Governance Officer overseeing multi-agent predictive simulations and municipal budget distributions.',
    accentBorder: 'border-blue-500/40 hover:border-blue-400',
    accentBg: 'bg-blue-500/10 hover:bg-blue-500/20',
    accentText: 'text-blue-400',
    icon: Building2
  },
  {
    id: 'crisis',
    roleLabel: 'Disaster & Crisis Commander',
    badge: 'Operations Lead',
    clearance: 'Level 4 (Crisis Authority)',
    email: 'crisis@pragma.gov',
    password: 'password123',
    role: 'Disaster Mitigation Lead',
    firstName: 'Alexander',
    lastName: 'Vance',
    avatar: 'Alexander',
    department: 'State Disaster Management Authority (TNSDMA)',
    badgeId: 'PRAGMA-DISASTER-2026-042',
    region: 'Coastal & Flood Inundation Vulnerability Sectors',
    phone: '+91 98840 23110',
    bio: 'Crisis Response Commander directing flood inundation modeling, cyclone evacuations, and hospital triage dispatch.',
    accentBorder: 'border-rose-500/40 hover:border-rose-400',
    accentBg: 'bg-rose-500/10 hover:bg-rose-500/20',
    accentText: 'text-rose-400',
    icon: ShieldAlert
  },
  {
    id: 'infra',
    roleLabel: 'Infrastructure & Utility Manager',
    badge: 'Grid & Transit Lead',
    clearance: 'Level 3 (Infrastructure Access)',
    email: 'utility@pragma.gov',
    password: 'password123',
    role: 'Public Infrastructure Officer',
    firstName: 'Felix',
    lastName: 'Sterling',
    avatar: 'Felix',
    department: 'Water Board & Electricity Grid Operations (CMWSSB & TANGEDCO)',
    badgeId: 'PRAGMA-INFRA-2026-105',
    region: 'Coimbatore & Madurai Industrial Corridors',
    phone: '+91 97720 45890',
    bio: 'Chief Utility Engineer managing daily 420 MLD water distribution, 18.1 GW peak power dispatch, and ORR traffic flows.',
    accentBorder: 'border-amber-500/40 hover:border-amber-400',
    accentBg: 'bg-amber-500/10 hover:bg-amber-500/20',
    accentText: 'text-amber-400',
    icon: Zap
  },
  {
    id: 'analyst',
    roleLabel: 'Data Scientist & AI Analyst',
    badge: 'System Auditor',
    clearance: 'Level 2 (Analytical Access)',
    email: 'analyst@pragma.gov',
    password: 'password123',
    role: 'AI Policy Administrator',
    firstName: 'Aria',
    lastName: 'Chen',
    avatar: 'Aria',
    department: 'Smart City AI Research & Digital Twin Modeling Lab',
    badgeId: 'PRAGMA-DATA-2026-019',
    region: 'Statewide ABM Swarm & SHAP Vector Audit',
    phone: '+91 91100 89234',
    bio: 'Principal AI Researcher auditing Mesa agent swarms, XGBoost crisis models, and SHAP explainability vectors.',
    accentBorder: 'border-purple-500/40 hover:border-purple-400',
    accentBg: 'bg-purple-500/10 hover:bg-purple-500/20',
    accentText: 'text-purple-400',
    icon: Cpu
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoleAccount, setSelectedRoleAccount] = useState<string | null>(null);
  const navigate = useNavigate();

  // Ensure default seed accounts are pre-populated in localStorage on mount
  useEffect(() => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('pragma_registered_users') || '{}');
      let updated = false;

      // Seed 4 major accounts
      SEED_ACCOUNTS.forEach((acc) => {
        const cleanMail = acc.email.toLowerCase();
        if (!registeredUsers[cleanMail]) {
          registeredUsers[cleanMail] = {
            email: cleanMail,
            password: acc.password,
            role: acc.role,
            firstName: acc.firstName,
            lastName: acc.lastName,
            avatar: acc.avatar,
            department: acc.department,
            badgeId: acc.badgeId,
            region: acc.region,
            phone: acc.phone,
            clearance: acc.clearance,
            bio: acc.bio
          };
          updated = true;
        }
      });

      // Also ensure previous user account works
      if (!registeredUsers['caraxesdaemon07@gmail.com']) {
        registeredUsers['caraxesdaemon07@gmail.com'] = {
          email: 'caraxesdaemon07@gmail.com',
          password: 'password123',
          role: 'Government Officer',
          firstName: 'Daemon',
          lastName: 'Targaryen',
          avatar: 'Daemon',
          department: 'Smart City Governance & Digital Infrastructure Directorate',
          badgeId: 'PRAGMA-GOV-TN-2026-088',
          region: 'Chennai Metropolitan Hub & State Command',
          phone: '+91 94440 12890',
          clearance: 'Level 5 - Autonomous Override',
          bio: 'Senior Governance Officer in charge of predictive simulation analysis.'
        };
        updated = true;
      }

      if (updated) {
        localStorage.setItem('pragma_registered_users', JSON.stringify(registeredUsers));
      }
    } catch (e) {
      console.warn('LocalStorage seed error:', e);
    }
  }, []);

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

  const executeLoginForUser = (cleanEmail: string, userData: any) => {
    localStorage.setItem('pragma_authenticated', 'true');
    localStorage.setItem('pragma_saved_email', cleanEmail);
    localStorage.setItem('pragma_user_role', userData.role || 'Government Officer');
    localStorage.setItem('pragma_user_avatar', userData.avatar || 'Admin');
    localStorage.setItem('pragma_first_name', userData.firstName || 'Officer');
    localStorage.setItem('pragma_last_name', userData.lastName || 'Admin');
    localStorage.setItem('pragma_user_department', userData.department || 'Smart City Governance Directorate');
    localStorage.setItem('pragma_user_badge_id', userData.badgeId || 'PRAGMA-GOV-2026');
    localStorage.setItem('pragma_user_region', userData.region || 'Chennai Metropolitan Hub');
    localStorage.setItem('pragma_user_phone', userData.phone || '+91 94440 12890');
    localStorage.setItem('pragma_user_clearance', userData.clearance || 'Level 5 - Autonomous Override');
    localStorage.setItem('pragma_user_bio', userData.bio || 'Smart city governance administrator.');
    localStorage.setItem('pragma_token', 'auth_' + Date.now());

    window.dispatchEvent(new Event('pragma_profile_updated'));
    window.dispatchEvent(new Event('storage'));

    setIsLoading(false);
    navigate('/dashboard');
  };

  const handleQuickLogin = (acc: SeedAccount) => {
    setSelectedRoleAccount(acc.id);
    setEmail(acc.email);
    setPassword(acc.password);
    setIsLoading(true);
    setErrors({});

    setTimeout(() => {
      executeLoginForUser(acc.email.toLowerCase(), acc);
    }, 400);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const cleanEmail = email.trim().toLowerCase();

    // Check seed match first
    const seedMatch = SEED_ACCOUNTS.find(s => s.email.toLowerCase() === cleanEmail);
    if (seedMatch && password === seedMatch.password) {
      setTimeout(() => {
        executeLoginForUser(cleanEmail, seedMatch);
      }, 400);
      return;
    }

    // Check localStorage registered users
    const registeredUsers = JSON.parse(localStorage.getItem('pragma_registered_users') || '{}');
    const userData = registeredUsers[cleanEmail];

    if (userData) {
      if (userData.password !== password) {
        setIsLoading(false);
        setErrors({ general: 'Incorrect password. Please try again or use Forgot Password to reset it.' });
        return;
      }

      setTimeout(() => {
        executeLoginForUser(cleanEmail, userData);
      }, 400);
      return;
    }

    // Backend fallback
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      if (response.ok) {
        const data = await response.json();
        executeLoginForUser(cleanEmail, {
          role: data.role || 'Government Officer',
          firstName: data.username || 'Officer',
          avatar: 'Admin'
        });
        return;
      }
    } catch (err) {
      // Backend not running, proceed to error
    }

    setIsLoading(false);
    setErrors({ general: 'No account found with this email. Please select a Quick Role Login below or register a new account.' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center p-4 md:p-8">
      {/* Animated Glowing Particles Background */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: i % 2 === 0 ? '#2563EB' : '#06B6D4',
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
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 px-6 py-5 flex justify-between items-center max-w-7xl">
        <div className="flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-primary flex-shrink-0" />
          <span className="text-sm font-poppins font-bold text-white hidden sm:inline tracking-tight">PRAGMA Smart City System</span>
        </div>
        <Link 
          to="/home" 
          className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </nav>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mt-12 md:mt-16 space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h1 className="text-xl md:text-2xl font-poppins font-bold text-white leading-snug">
            Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin
          </h1>
          <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase font-semibold">
            Role-Based Authentication & Administrative Access
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (5 Cols): Standard Credentials Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 rounded-3xl bg-[#0d1527] border border-slate-700/80 p-6 md:p-8 shadow-2xl shadow-black/80 space-y-5"
          >
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white font-poppins flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" /> Sign In with Credentials
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Enter your official government or research email.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {errors.general && (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-xs text-center">
                  {errors.general}
                  {errors.general.includes('Forgot password') && (
                    <div className="mt-1">
                      <Link to="/forgot-password" className="font-bold underline text-primary hover:text-white">
                        Click here to reset your password
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-danger' : 'border-slate-700/80 focus:border-primary'} rounded-xl bg-black/40 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-mono`}
                    placeholder="e.g. admin@pragma.gov"
                  />
                </div>
                {errors.email && <p className="text-danger text-[11px] mt-0.5 ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.password ? 'border-danger' : 'border-slate-700/80 focus:border-primary'} rounded-xl bg-black/40 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-mono`}
                    placeholder="••••••••••••"
                  />
                </div>
                {errors.password && <p className="text-danger text-[11px] mt-0.5 ml-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 bg-black/40 border-slate-700 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-400">
                    Remember session
                  </label>
                </div>

                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primaryHover transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-primary/30 text-xs font-bold text-white bg-gradient-to-r from-primary to-cyan-600 hover:from-primaryHover hover:to-cyan-500 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-gray-400 border-t border-slate-800/80">
              Need a custom account?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline ml-1">
                Register New User
              </Link>
            </div>
          </motion.div>

          {/* Right Column (7 Cols): Quick 1-Click Role Logins (RBAC Demo) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 rounded-3xl bg-[#0d1527] border border-slate-700/80 p-6 md:p-8 shadow-2xl shadow-black/80 space-y-4"
          >
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white font-poppins flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Fast 1-Click Role Logins (RBAC)
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Select any pre-configured operational login to instantly launch the platform.</p>
              </div>
              <span className="text-[10px] bg-primary/20 text-primary border border-primary/40 px-2.5 py-1 rounded-full font-mono font-bold">
                4 Active Roles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SEED_ACCOUNTS.map((acc) => {
                const IconComponent = acc.icon;
                const isSelected = selectedRoleAccount === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleQuickLogin(acc)}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-[1.02]' 
                        : `bg-[#08101e] ${acc.accentBorder} hover:scale-[1.02]`
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl bg-black/40 border border-white/10 ${acc.accentText}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-primary transition-colors leading-tight">
                              {acc.roleLabel}
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {acc.badge}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase bg-black/40 border border-white/10 ${acc.accentText}`}>
                          {acc.clearance.split(' ')[0]}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-gray-400 mt-2 bg-black/30 p-2.5 rounded-xl border border-white/5 font-mono">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-gray-200 truncate max-w-[140px] font-semibold">{acc.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Password:</span>
                          <span className="text-cyan-300 font-semibold">{acc.password}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-3 w-full py-2 bg-white/5 hover:bg-primary text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-white/10 group-hover:border-primary"
                    >
                      <span>1-Click Sign In as {acc.firstName}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-black/30 rounded-2xl border border-slate-800 text-[11px] text-gray-400 flex items-center justify-between">
              <span>All 4 accounts are pre-configured with active clearances and sample data.</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Ready
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
