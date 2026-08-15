import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SeedAccount {
  id: string;
  aliases: string[];
  roleLabel: string;
  clearance: string;
  email: string;
  passwords: string[];
  role: string;
  firstName: string;
  lastName: string;
  avatar: string;
  department: string;
  badgeId: string;
  region: string;
  phone: string;
  bio: string;
}

const SEED_ACCOUNTS: SeedAccount[] = [
  {
    id: 'gov',
    aliases: ['admin@pragma.gov', 'admin', 'officer@pragma.gov', 'officer'],
    roleLabel: 'Government Officer',
    clearance: 'Level 5 - Autonomous Override',
    email: 'admin@pragma.gov',
    passwords: ['password123', 'admin123', 'officer123', 'admin'],
    role: 'Government Officer',
    firstName: 'Daemon',
    lastName: 'Targaryen',
    avatar: 'Daemon',
    department: 'Smart City Governance & Digital Infrastructure Directorate',
    badgeId: 'PRAGMA-GOV-TN-2026-088',
    region: 'Chennai Metropolitan Hub & State Command',
    phone: '+91 94440 12890',
    bio: 'Senior Governance Officer overseeing multi-agent predictive simulations and municipal budget distributions.'
  },
  {
    id: 'gov-custom',
    aliases: ['caraxesdaemon07@gmail.com', 'caraxes', 'daemon', 'caraxesdaemon07'],
    roleLabel: 'Government Officer',
    clearance: 'Level 5 - Autonomous Override',
    email: 'caraxesdaemon07@gmail.com',
    passwords: ['password123', 'admin123', 'officer123', 'daemon123', 'caraxes123', 'admin', 'password'],
    role: 'Government Officer',
    firstName: 'Daemon',
    lastName: 'Targaryen',
    avatar: 'Daemon',
    department: 'Smart City Governance & Digital Infrastructure Directorate',
    badgeId: 'PRAGMA-GOV-TN-2026-088',
    region: 'Chennai Metropolitan Hub & State Command',
    phone: '+91 94440 12890',
    bio: 'Senior Governance Officer overseeing multi-agent predictive simulations and municipal budget distributions.'
  },
  {
    id: 'crisis',
    aliases: ['crisis@pragma.gov', 'crisis', 'disaster@pragma.gov', 'disaster'],
    roleLabel: 'Disaster Mitigation Lead',
    clearance: 'Level 4 - Crisis Authority',
    email: 'crisis@pragma.gov',
    passwords: ['password123', 'crisis123', 'disaster123'],
    role: 'Disaster Mitigation Lead',
    firstName: 'Alexander',
    lastName: 'Vance',
    avatar: 'Alexander',
    department: 'State Disaster Management Authority (TNSDMA)',
    badgeId: 'PRAGMA-DISASTER-2026-042',
    region: 'Coastal & Flood Inundation Vulnerability Sectors',
    phone: '+91 98840 23110',
    bio: 'Crisis Response Commander directing flood inundation modeling, cyclone evacuations, and hospital triage dispatch.'
  },
  {
    id: 'infra',
    aliases: ['utility@pragma.gov', 'utility', 'infra@pragma.gov', 'infra'],
    roleLabel: 'Public Infrastructure Officer',
    clearance: 'Level 3 - Infrastructure Access',
    email: 'utility@pragma.gov',
    passwords: ['password123', 'utility123', 'infra123'],
    role: 'Public Infrastructure Officer',
    firstName: 'Felix',
    lastName: 'Sterling',
    avatar: 'Felix',
    department: 'Water Board & Electricity Grid Operations (CMWSSB & TANGEDCO)',
    badgeId: 'PRAGMA-INFRA-2026-105',
    region: 'Coimbatore & Madurai Industrial Corridors',
    phone: '+91 97720 45890',
    bio: 'Chief Utility Engineer managing daily 420 MLD water distribution, 18.1 GW peak power dispatch, and ORR traffic flows.'
  },
  {
    id: 'analyst',
    aliases: ['analyst@pragma.gov', 'analyst', 'research@pragma.gov', 'research'],
    roleLabel: 'AI Policy Administrator',
    clearance: 'Level 2 - Analytical Access',
    email: 'analyst@pragma.gov',
    passwords: ['password123', 'analyst123', 'research123'],
    role: 'AI Policy Administrator',
    firstName: 'Aria',
    lastName: 'Chen',
    avatar: 'Aria',
    department: 'Smart City AI Research & Digital Twin Modeling Lab',
    badgeId: 'PRAGMA-DATA-2026-019',
    region: 'Statewide ABM Swarm & SHAP Vector Audit',
    phone: '+91 91100 89234',
    bio: 'Principal AI Researcher auditing Mesa agent swarms, XGBoost crisis models, and SHAP explainability vectors.'
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Pre-seed default accounts into localStorage on mount
  useEffect(() => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('pragma_registered_users') || '{}');
      let updated = false;

      SEED_ACCOUNTS.forEach((acc) => {
        const cleanMail = acc.email.toLowerCase();
        if (!registeredUsers[cleanMail]) {
          registeredUsers[cleanMail] = {
            email: cleanMail,
            password: acc.passwords[0],
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

      if (updated) {
        localStorage.setItem('pragma_registered_users', JSON.stringify(registeredUsers));
      }
    } catch (e) {
      console.warn('LocalStorage seed check:', e);
    }
  }, []);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email address or username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const executeLoginForUser = (cleanEmail: string, userData: any) => {
    localStorage.setItem('pragma_authenticated', 'true');
    localStorage.setItem('pragma_saved_email', cleanEmail);
    localStorage.setItem('pragma_user_role', userData.role || 'Government Officer');
    localStorage.setItem('pragma_user_avatar', userData.avatar || 'Daemon');
    localStorage.setItem('pragma_first_name', userData.firstName || 'Officer');
    localStorage.setItem('pragma_last_name', userData.lastName || 'Admin');
    localStorage.setItem('pragma_user_department', userData.department || 'Smart City Governance & Digital Infrastructure Directorate');
    localStorage.setItem('pragma_user_badge_id', userData.badgeId || `PRAGMA-GOV-2026-${Math.floor(Math.random() * 800 + 100)}`);
    localStorage.setItem('pragma_user_region', userData.region || 'Chennai Metropolitan Hub & State Command');
    localStorage.setItem('pragma_user_phone', userData.phone || '+91 94440 12890');
    localStorage.setItem('pragma_user_clearance', userData.clearance || 'Level 5 - Autonomous Override');
    localStorage.setItem('pragma_user_bio', userData.bio || 'Smart city governance administrator.');
    localStorage.setItem('pragma_token', 'auth_' + Date.now());

    window.dispatchEvent(new Event('pragma_profile_updated'));
    window.dispatchEvent(new Event('storage'));

    setIsLoading(false);
    navigate('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const cleanInput = email.trim().toLowerCase();

    // 1. Check built-in role accounts & aliases (crisis, utility, analyst, admin, caraxesdaemon07@gmail.com, officer, etc.)
    const seedMatch = SEED_ACCOUNTS.find(s => 
      s.aliases.some(alias => alias.toLowerCase() === cleanInput) ||
      s.email.toLowerCase() === cleanInput ||
      cleanInput.includes(s.id)
    );

    if (seedMatch) {
      setTimeout(() => {
        executeLoginForUser(cleanInput.includes('@') ? cleanInput : seedMatch.email, seedMatch);
      }, 150);
      return;
    }

    // 2. Check registered users in localStorage
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('pragma_registered_users') || '{}');
      const userData = registeredUsers[cleanInput] || Object.values(registeredUsers).find((u: any) => 
        u.email?.toLowerCase() === cleanInput || u.username?.toLowerCase() === cleanInput
      );

      if (userData) {
        setTimeout(() => {
          executeLoginForUser((userData as any).email || cleanInput, userData);
        }, 150);
        return;
      }
    } catch (err) {
      console.warn('Storage check:', err);
    }

    // 3. Normal / Citizen user login (clean name, citizen role, no officer level)
    const rawHandle = cleanInput.includes('@') ? cleanInput.split('@')[0] : cleanInput;
    let formattedName = rawHandle
      .replace(/[0-9]/g, '') // remove numbers
      .replace(/[._-]/g, ' ') // replace separators with space
      .trim();

    if (!formattedName) formattedName = rawHandle;

    // Capitalize words
    formattedName = formattedName
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const fallbackUser = {
      role: 'Citizen User',
      clearance: '',
      department: 'Public Access Portal',
      firstName: formattedName || 'Citizen',
      lastName: '',
      avatar: 'Citizen_' + rawHandle,
      badgeId: `PRAGMA-CITIZEN-2026-${Math.floor(Math.random() * 800 + 100)}`,
      region: 'Tamil Nadu Region',
      phone: '',
      bio: 'Registered citizen platform user.'
    };

    setTimeout(() => {
      executeLoginForUser(cleanInput, fallbackUser);
    }, 150);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center p-4">
      {/* Animated Glowing Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        {[...Array(12)].map((_, i) => (
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
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[130px] pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center max-w-7xl">
        <div className="flex items-center gap-2.5">
          <Shield className="w-8 h-8 text-primary flex-shrink-0" />
        </div>
        <Link 
          to="/home" 
          className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      {/* Clean Single Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-4"
      >
        <div className="glass-card p-8 md:p-10 backdrop-blur-xl border-white/20 bg-[#0D1527]/80 shadow-2xl shadow-primary/20 rounded-3xl">
          
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

          <form onSubmit={handleLogin} className="space-y-5">
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
                  type="password"
                  autoComplete="off"
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
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-semibold text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
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
          </form>

        </div>
      </motion.div>
    </div>
  );
}
