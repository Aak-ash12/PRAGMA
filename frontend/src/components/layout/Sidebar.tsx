import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Activity, Network, LineChart, 
  PieChart, BarChart3, FileText, Database, 
  Settings, ShieldAlert, LogOut, Shield, User
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Simulation', path: '/simulation', icon: Activity },
  { name: 'Multi-Agent System', path: '/agents', icon: Network },
  { name: 'Prediction', path: '/prediction', icon: LineChart },
  { name: 'Resource Allocation', path: '/resources', icon: PieChart },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Policy Recommendation', path: '/policies', icon: ShieldAlert },
  { name: 'Explainable AI', path: '/xai', icon: FileText },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Datasets', path: '/datasets', icon: Database },
];

export default function Sidebar() {
  const location = useLocation();
  const [userRole, setUserRole] = useState('Government Officer');

  useEffect(() => {
    const role = localStorage.getItem('pragma_user_role') || 'Government Officer';
    setUserRole(role);
    const updateRole = () => {
      setUserRole(localStorage.getItem('pragma_user_role') || 'Government Officer');
    };
    window.addEventListener('pragma_profile_updated', updateRole);
    window.addEventListener('storage', updateRole);
    return () => {
      window.removeEventListener('pragma_profile_updated', updateRole);
      window.removeEventListener('storage', updateRole);
    };
  }, []);

  const getItemBadge = (path: string) => {
    const r = userRole.toLowerCase();
    if (r.includes('disaster') || r.includes('crisis')) {
      if (path === '/simulation') return { text: 'Crisis Run', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      if (path === '/prediction') return { text: 'Risk Forecaster', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      if (path === '/resources') return { text: 'Emergency', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    } else if (r.includes('infrastructure') || r.includes('utility')) {
      if (path === '/prediction') return { text: '18.1GW/420MLD', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      if (path === '/resources') return { text: 'Grid Dispatch', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      if (path === '/analytics') return { text: 'Sensors', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    } else if (r.includes('analyst') || r.includes('scientist') || r.includes('policy')) {
      if (path === '/agents') return { text: '10k Swarm', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      if (path === '/xai') return { text: 'SHAP XAI', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      if (path === '/datasets') return { text: 'IoT Data', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    } else if (r.includes('government') || r.includes('officer') || r.includes('admin')) {
      // Govt Officer
      if (path === '/dashboard') return { text: 'HQ', color: 'bg-primary/20 text-cyan-300 border-primary/30' };
      if (path === '/policies') return { text: 'Directive', color: 'bg-primary/20 text-cyan-300 border-primary/30' };
      if (path === '/reports') return { text: 'PDF Sign-off', color: 'bg-primary/20 text-cyan-300 border-primary/30' };
    }
    // Normal / Citizen users: No officer badges in sidebar
    return null;
  };

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 w-[280px] h-screen glass border-r border-white/10 flex flex-col z-50 bg-[#081120]/90"
    >
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <Shield className="w-8 h-8 text-primary" />
        <div className="overflow-hidden">
          <h1 className="text-xs font-poppins font-bold text-white tracking-tight leading-tight">
            Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const badge = getItemBadge(item.path);
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
              <div className="flex-1 flex items-center justify-between relative z-10 gap-2">
                <span className="text-sm font-medium">{item.name}</span>
                {badge && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border uppercase ${badge.color}`}>
                    {badge.text}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link 
          to="/profile" 
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
            location.pathname === '/profile' 
              ? 'bg-primary/20 text-white border border-primary/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className={`w-5 h-5 ${location.pathname === '/profile' ? 'text-primary' : ''}`} />
          <span className="text-sm font-medium">Profile</span>
        </Link>
        <Link 
          to="/settings" 
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
            location.pathname === '/settings' 
              ? 'bg-primary/20 text-white border border-primary/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className={`w-5 h-5 ${location.pathname === '/settings' ? 'text-primary' : ''}`} />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <Link 
          to="/admin" 
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
            location.pathname === '/admin' 
              ? 'bg-primary/20 text-white border border-primary/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldAlert className={`w-5 h-5 ${location.pathname === '/admin' ? 'text-primary' : ''}`} />
          <span className="text-sm font-medium">Admin</span>
        </Link>
        <Link to="/login" className="flex items-center gap-3 px-4 py-2 rounded-xl text-danger hover:bg-danger/10 transition-all mt-1">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </Link>
      </div>
    </motion.aside>
  );
}
