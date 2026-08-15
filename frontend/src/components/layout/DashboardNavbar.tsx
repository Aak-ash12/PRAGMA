import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, MessageSquare, Moon, Sun, Settings, LogOut, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

export default function DashboardNavbar() {
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [savedEmail, setSavedEmail] = useState('admin@pragma.gov');
  const [userRole, setUserRole] = useState('Citizen User');
  const [userAvatar, setUserAvatar] = useState('Citizen');
  const [userName, setUserName] = useState('');
  const [userClearance, setUserClearance] = useState('');

  const loadUserProfile = () => {
    const email = localStorage.getItem('pragma_saved_email') || '';
    const emailLower = email.toLowerCase();

    const isOfficialGov = emailLower === 'admin@pragma.gov' || emailLower === 'officer@pragma.gov' || emailLower === 'admin' || emailLower === 'officer';
    const isOfficialCrisis = emailLower === 'crisis@pragma.gov' || emailLower === 'crisis' || emailLower === 'disaster@pragma.gov';
    const isOfficialUtility = emailLower === 'utility@pragma.gov' || emailLower === 'utility' || emailLower === 'infra@pragma.gov';
    const isOfficialAnalyst = emailLower === 'analyst@pragma.gov' || emailLower === 'analyst' || emailLower === 'research@pragma.gov';

    const isOfficial = isOfficialGov || isOfficialCrisis || isOfficialUtility || isOfficialAnalyst;

    const role = localStorage.getItem('pragma_user_role') || (isOfficial ? 'Government Officer' : 'Citizen User');
    const avatar = localStorage.getItem('pragma_user_avatar') || (isOfficial ? 'Rajeshwar' : 'Citizen');
    const first = localStorage.getItem('pragma_first_name');
    const last = localStorage.getItem('pragma_last_name');
    const cl = localStorage.getItem('pragma_user_clearance') || '';

    setSavedEmail(email);
    setUserRole(role);
    setUserAvatar(avatar);
    setUserClearance(isOfficial && cl ? cl.split('-')[0].trim() : '');

    if (first || last) {
      setUserName(`${first || ''} ${last || ''}`.trim());
    } else if (email) {
      setUserName(email.split('@')[0]);
    }
  };

  useEffect(() => {
    loadUserProfile();
    window.addEventListener('pragma_profile_updated', loadUserProfile);
    window.addEventListener('storage', loadUserProfile);
    return () => {
      window.removeEventListener('pragma_profile_updated', loadUserProfile);
      window.removeEventListener('storage', loadUserProfile);
    };
  }, []);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const searchItems = [
    { id: '1', title: 'Population Growth & Demographics Model', category: 'Prediction', subtitle: 'Demographic forecast (83.2M urban population model)', path: '/prediction' },
    { id: '2', title: 'Hospital Occupancy & ICU Bed Capacity', category: 'Prediction', subtitle: 'Epidemiological triage & bed availability', path: '/prediction' },
    { id: '3', title: 'Water Demand & Reservoir Scarcity', category: 'Prediction', subtitle: 'Coimbatore & Chennai 420 MLD water allocation', path: '/prediction' },
    { id: '4', title: 'Electricity Grid & Peak Cooling Load', category: 'Prediction', subtitle: '18.1 GW peak power dispatch model', path: '/prediction' },
    { id: '5', title: 'Traffic Congestion & Transit Speed Index', category: 'Prediction', subtitle: 'NH-45 Express & Outer Ring Road flow', path: '/prediction' },
    { id: '6', title: 'Agriculture Yield & Irrigation Canal Model', category: 'Prediction', subtitle: 'Cauvery Delta paddy yield & soil moisture', path: '/prediction' },
    { id: '7', title: 'Disaster Risk Index & Calamity Warning', category: 'Prediction', subtitle: 'Flood, Cyclone, & Heatwave mitigation', path: '/prediction' },
    { id: '8', title: 'Governance Efficiency & Quality Audit', category: 'Governance', subtitle: '95% SLA Uptime & Public Response Speed', path: '/dashboard' },
    { id: '9', title: 'Budget Utilization & AI Identified Savings', category: 'Policies', subtitle: 'Urban development fund redistribution', path: '/policies' },
    { id: '10', title: 'Chennai Metropolitan Region', category: 'Region', subtitle: 'Capital Urban Hub (Tamil Nadu)', path: '/prediction' },
    { id: '11', title: 'Coimbatore Industrial District', category: 'Region', subtitle: 'Textile & Manufacturing Sector', path: '/resource-allocation' },
    { id: '12', title: 'Madurai Transit Corridor', category: 'Region', subtitle: 'Southern Logistics & Medical Center', path: '/resource-allocation' },
    { id: '13', title: 'Monsoon Flood Alpha Simulation', category: 'Simulation', subtitle: 'Hydrological Runoff Model (145mm rainfall)', path: '/simulation' },
    { id: '14', title: 'Epidemic SIR Model', category: 'Simulation', subtitle: 'Disease Transmission & R0 (2.4) Analysis', path: '/prediction' },
    { id: '15', title: 'Mesa Citizen Agent Swarm #1-10', category: 'Agents', subtitle: 'Multi-Agent ABM Active Simulation', path: '/agents' },
    { id: '16', title: 'Explainable AI (SHAP Vector Analytics)', category: 'XAI Analytics', subtitle: 'Neural Net Feature Weights & Policy Explanations', path: '/xai' },
    { id: '17', title: 'Resource Allocation Matrix', category: 'Resources', subtitle: 'AI District Asset Redistribution Engine', path: '/resources' },
  ];

  const filteredSearchResults = searchItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSearchResult = (item: typeof searchItems[0]) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    addToast(`Navigating to ${item.title}...`, 'info');
    navigate(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSearchResults.length > 0) {
        handleSelectSearchResult(filteredSearchResults[0]);
      } else if (searchQuery.trim().length > 0) {
        addToast(`Searching project data for "${searchQuery}"...`, 'info');
        setIsSearchFocused(false);
        navigate(`/prediction`);
      }
    }
  };



  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Critical Water Shortage', desc: 'Coimbatore reservoir levels dropped below 15%.', time: 'Just now' },
    { id: 2, title: 'Simulation Completed', desc: 'Monsoon scenario "Alpha" has finished processing.', time: '5m ago' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Ramesh (Health Lead)', preview: 'Can you approve the new hospital deployment model?', time: '10m ago' },
    { id: 2, sender: 'AI Swarm Coordinator', preview: 'Automated report for traffic patterns generated.', time: '1h ago' }
  ]);

  const bellRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pragma_authenticated');
    addToast('Successfully logged out.', 'info');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const markAllAsRead = () => {
    setNotifications([]);
    addToast('All notifications marked as read', 'success');
  };

  const toggleDarkMode = () => {
    if (isLightMode) {
      document.body.classList.remove('light-mode');
      setIsLightMode(false);
    } else {
      document.body.classList.add('light-mode');
      setIsLightMode(true);
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[72px] glass border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-[100] bg-[#081120]/80 backdrop-blur-xl ml-[280px]"
    >
      <div className="flex-1 max-w-xl" ref={searchRef}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsSearchFocused(true)}
            className="block w-full pl-10 pr-8 py-2 border border-white/10 rounded-full leading-5 bg-black/30 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all sm:text-sm"
            placeholder=""
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}

          {/* Search Autocomplete Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                className="absolute top-12 left-0 right-0 rounded-2xl bg-[#0b1329] border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-[9999] p-2 max-h-80 overflow-y-auto custom-scrollbar"
              >
                <div className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1.5 border-b border-slate-800 flex justify-between items-center bg-[#070d1c]">
                  <span>Results for "{searchQuery}" ({filteredSearchResults.length})</span>
                  <span className="text-primary font-mono">Press Enter or click</span>
                </div>

                {filteredSearchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">
                    No matching agents, simulations, or regions found for "{searchQuery}".
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/60 mt-1">
                    {filteredSearchResults.map((res) => (
                      <div
                        key={res.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectSearchResult(res);
                        }}
                        className="p-2.5 hover:bg-slate-800/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                              {res.title}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 border border-white/10 uppercase">
                              {res.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{res.subtitle}</p>
                        </div>
                        <span className="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          Go →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:block text-right">
          <div className="text-sm font-bold text-white font-mono tracking-wider">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-xs text-gray-400">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="h-8 w-px bg-white/10 mx-2 hidden lg:block"></div>

        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={bellRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all relative focus:outline-none"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse"></span>}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#0d1527] border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-[9999]"
                >
                  <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-[#08101e]">
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono">{notifications.length} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-400 text-sm">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 hover:bg-slate-800/50 cursor-pointer transition-colors">
                          <p className="text-sm text-gray-200 font-medium">{n.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.desc}</p>
                          <p className="text-[10px] text-primary mt-2">{n.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div onClick={markAllAsRead} className="px-4 py-2.5 text-center border-t border-slate-800 bg-[#08101e] hover:bg-slate-800/70 cursor-pointer transition-colors">
                    <span className="text-xs text-primary font-medium">Mark all as read</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages Dropdown */}
          <div className="relative" ref={msgRef}>
            <button 
              onClick={() => setShowMessages(!showMessages)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all relative focus:outline-none"
            >
              <MessageSquare className="w-5 h-5" />
              {messages.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>}
            </button>

            <AnimatePresence>
              {showMessages && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#0d1527] border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-[9999]"
                >
                  <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-[#08101e]">
                    <h3 className="text-sm font-semibold text-white">Messages</h3>
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-mono">{messages.length} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {messages.map(m => (
                      <div key={m.id} className="px-4 py-3 hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <p className="text-sm text-gray-200 font-medium">{m.sender}</p>
                        <p className="text-xs text-gray-400 mt-1">{m.preview}</p>
                        <p className="text-[10px] text-secondary mt-2">{m.time}</p>
                      </div>
                    ))}
                  </div>
                  <div 
                    onClick={() => {
                      setShowMessages(false);
                      addToast('Syncing secure inbox...', 'info');
                    }}
                    className="px-4 py-2.5 text-center border-t border-slate-800 bg-[#08101e] hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    <span className="text-xs text-secondary font-medium">View Inbox</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            {isLightMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-white max-w-[160px] truncate">{userName || savedEmail}</div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              {userClearance && userClearance.toLowerCase().includes('level') && (
                <span className="text-[9px] font-mono font-bold bg-primary/20 text-cyan-300 px-1.5 py-0.5 rounded border border-primary/30 uppercase">
                  {userClearance}
                </span>
              )}
              <span className="text-[10px] text-primary uppercase font-mono truncate max-w-[120px]">{userRole}</span>
            </div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <div 
              onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userAvatar}&backgroundColor=081120`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-60 rounded-2xl bg-[#0d1527] border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-[9999] py-2"
                >
                  <div className="px-4 py-2.5 border-b border-slate-800 bg-[#08101e] mb-1">
                    <div className="text-xs font-semibold text-white truncate">{userName || savedEmail}</div>
                    <div className="text-[10px] text-cyan-300 font-mono truncate">{savedEmail}</div>
                    <div className="text-[10px] text-primary uppercase font-mono tracking-wide mt-0.5">{userRole}</div>
                  </div>
                  <button 
                    onClick={() => { setShowProfile(false); navigate('/profile'); }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm text-gray-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                  >
                    <User className="w-4 h-4 text-primary" /> Profile
                  </button>
                  <button 
                    onClick={() => { setShowProfile(false); navigate('/settings'); }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm text-gray-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-cyan-400" /> Settings
                  </button>
                  <div className="h-px bg-slate-800 my-1.5"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4 text-red-400" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
