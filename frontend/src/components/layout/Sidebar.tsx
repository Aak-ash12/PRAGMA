import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Activity, Network, LineChart, 
  PieChart, BarChart3, FileText, Database, 
  Settings, ShieldAlert, LogOut, Shield
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
          <h1 className="text-sm font-poppins font-bold text-white tracking-tight leading-snug">
            Multiagent Risk & Governance Assistant
          </h1>
          <p className="text-[9px] text-primary font-mono uppercase tracking-wider leading-tight mt-0.5">
            Smart Cities Digital Twin
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
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
              <span className="text-sm font-medium relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <ShieldAlert className="w-5 h-5" />
          <span className="text-sm font-medium">Admin</span>
        </Link>
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all mt-2">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </Link>
      </div>
    </motion.aside>
  );
}
