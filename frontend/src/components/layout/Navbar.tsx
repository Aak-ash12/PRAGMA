import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b-0 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Shield className="w-8 h-8 text-primary" />
        </motion.div>
        <span className="text-base md:text-lg font-poppins font-bold tracking-tight text-white">Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin</span>
      </div>
      
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
        <a href="#about" className="hover:text-white transition-colors">About</a>
      </div>

      <div className="flex gap-4 items-center">
        <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Login
        </Link>
        <button className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all">
          Launch Dashboard
        </button>
      </div>
    </nav>
  );
}
