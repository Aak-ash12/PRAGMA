import { motion } from 'framer-motion';
import { 
  User, Mail, Briefcase, Building, MapPin, Phone, 
  ShieldCheck, Award, Save, RefreshCw, Loader2, 
  CheckCircle2, Sparkles, KeyRound, ArrowRight, Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import DashboardFooter from '../components/layout/DashboardFooter';
import { useToast } from '../contexts/ToastContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form States
  const [firstName, setFirstName] = useState('Rajeshwar');
  const [lastName, setLastName] = useState('Sundaram');
  const [email, setEmail] = useState('admin@pragma.gov');
  const [role, setRole] = useState('Government Officer');
  const [department, setDepartment] = useState('Smart City Governance & Digital Infrastructure Directorate');
  const [badgeId, setBadgeId] = useState('PRAGMA-GOV-TN-2026-088');
  const [region, setRegion] = useState('Chennai Metropolitan & Coimbatore Smart Zone');
  const [phone, setPhone] = useState('+91 94440 12890');
  const [clearance, setClearance] = useState('Level 5 - Autonomous Override');
  const [bio, setBio] = useState('Senior Governance Officer overseeing multi-agent predictive simulations, urban resource optimization, and automated crisis mitigation protocols across Tamil Nadu smart districts.');
  const [avatarSeed, setAvatarSeed] = useState('Rajeshwar');

  // Load existing profile from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('pragma_saved_email');
    const savedRole = localStorage.getItem('pragma_user_role');
    const savedAvatar = localStorage.getItem('pragma_user_avatar');
    const savedFirst = localStorage.getItem('pragma_first_name');
    const savedLast = localStorage.getItem('pragma_last_name');
    const savedDept = localStorage.getItem('pragma_user_department');
    const savedBadge = localStorage.getItem('pragma_user_badge_id');
    const savedRegion = localStorage.getItem('pragma_user_region');
    const savedPhone = localStorage.getItem('pragma_user_phone');
    const savedClearance = localStorage.getItem('pragma_user_clearance');
    const savedBio = localStorage.getItem('pragma_user_bio');

    if (savedEmail) setEmail(savedEmail);
    if (savedRole) setRole(savedRole);
    if (savedAvatar) setAvatarSeed(savedAvatar);
    if (savedFirst) setFirstName(savedFirst);
    if (savedLast !== null) setLastName(savedLast);
    if (savedDept) setDepartment(savedDept);
    if (savedBadge) setBadgeId(savedBadge);
    if (savedRegion) setRegion(savedRegion);
    if (savedPhone) setPhone(savedPhone);
    if (savedClearance !== null) setClearance(savedClearance);
    if (savedBio) setBio(savedBio);

    // If first name not set, try splitting email username
    if (!savedFirst && savedEmail) {
      const username = savedEmail.split('@')[0];
      setFirstName(username.charAt(0).toUpperCase() + username.slice(1));
    }
  }, []);

  const avatarPresets = [
    { label: 'Officer', seed: 'Rajeshwar' },
    { label: 'Director', seed: 'Marcus' },
    { label: 'Strategist', seed: 'Alexander' },
    { label: 'Commander', seed: 'Felix' },
    { label: 'Specialist', seed: 'Aria' },
    { label: 'Citizen', seed: 'Citizen' }
  ];

  const randomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(randomSeed);
    addToast('New avatar generated.', 'info');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Save all fields to localStorage
      localStorage.setItem('pragma_saved_email', email.trim());
      localStorage.setItem('pragma_user_role', role.trim());
      localStorage.setItem('pragma_user_avatar', avatarSeed);
      localStorage.setItem('pragma_first_name', firstName.trim());
      localStorage.setItem('pragma_last_name', lastName.trim());
      localStorage.setItem('pragma_user_department', department.trim());
      localStorage.setItem('pragma_user_badge_id', badgeId.trim());
      localStorage.setItem('pragma_user_region', region.trim());
      localStorage.setItem('pragma_user_phone', phone.trim());
      localStorage.setItem('pragma_user_clearance', clearance.trim());
      localStorage.setItem('pragma_user_bio', bio.trim());

      // 2. Update registered users cache if user exists
      const registeredUsers = JSON.parse(localStorage.getItem('pragma_registered_users') || '{}');
      if (registeredUsers[email.toLowerCase()]) {
        registeredUsers[email.toLowerCase()] = {
          ...registeredUsers[email.toLowerCase()],
          role: role.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          department: department.trim(),
          avatar: avatarSeed
        };
        localStorage.setItem('pragma_registered_users', JSON.stringify(registeredUsers));
      }

      // 3. Dispatch custom global event so Navbar and components react immediately
      window.dispatchEvent(new Event('pragma_profile_updated'));
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        setIsSaving(false);
        addToast('Officer Profile updated successfully! Changes applied globally.', 'success');
      }, 700);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      addToast('Error saving profile changes.', 'danger');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 lg:pl-[280px]">
        <DashboardNavbar />

        <main className="p-6 md:p-10 pb-20 max-w-7xl mx-auto space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/40">
                  <User className="w-6 h-6" />
                </span>
                <h1 className="text-3xl font-poppins font-bold text-white tracking-tight">
                  Officer Profile & Credentials
                </h1>
              </div>
              <p className="text-sm text-gray-400">
                Official Administrative Profile, Digital Twin Clearance, and Jurisdiction Credentials.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/settings"
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-cyan-400" /> System Settings <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Officer Credentials ID Card Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-gradient-to-r from-[#0d1527] via-[#111e38] to-[#0d1527] border-2 border-primary/40 p-6 md:p-8 shadow-[0_10px_40px_rgba(37,99,235,0.15)] relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              
              {/* Left: Avatar & Identity */}
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-primary via-cyan-400 to-secondary p-1 shadow-xl shadow-primary/20">
                    <div className="w-full h-full bg-[#081120] rounded-[22px] overflow-hidden flex items-center justify-center">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=081120`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={randomizeAvatar}
                    title="Generate Random Avatar"
                    className="absolute -bottom-2 -right-2 p-2 bg-primary hover:bg-primaryHover text-white rounded-xl shadow-lg border border-white/20 transition-transform active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-2xl font-bold text-white font-poppins">
                      {firstName} {lastName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active Session
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-primary flex items-center justify-center sm:justify-start gap-1.5">
                    <Briefcase className="w-4 h-4" /> {role}
                  </div>

                  <div className="text-xs text-gray-300 flex items-center justify-center sm:justify-start gap-1.5">
                    <Building className="w-3.5 h-3.5 text-gray-400" /> {department}
                  </div>

                  <div className="text-xs text-cyan-300/90 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {email}
                  </div>
                </div>
              </div>

              {/* Right: Security & Governance Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                <div className="bg-black/40 border border-white/10 p-3.5 rounded-2xl text-center">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Security Clearance</div>
                  <div className="text-sm font-bold font-mono text-cyan-400 mt-1 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" /> Level 5
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 p-3.5 rounded-2xl text-center">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Badge ID</div>
                  <div className="text-xs font-bold font-mono text-white mt-1 truncate max-w-[120px]">
                    {badgeId}
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Governance SLA</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-1 flex items-center justify-center gap-1">
                    <Activity className="w-4 h-4 text-emerald-400" /> 99.4%
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Main Edit Profile Form Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Avatar Selection & Quick Presets */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#0d1527] border border-slate-700/70 shadow-xl space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-white font-poppins">Avatar & Character</h3>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Quick Character Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {avatarPresets.map((preset) => (
                      <button
                        key={preset.seed}
                        type="button"
                        onClick={() => {
                          setAvatarSeed(preset.seed);
                          addToast(`Switched avatar to ${preset.label}`, 'info');
                        }}
                        className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                          avatarSeed === preset.seed 
                            ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                            : 'bg-black/30 border-white/10 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${preset.seed}&backgroundColor=081120`} 
                          alt={preset.label}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="text-[11px] font-medium text-gray-300 truncate w-full text-center">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Custom Avatar Seed
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={avatarSeed} 
                      onChange={(e) => setAvatarSeed(e.target.value)}
                      placeholder="Enter custom seed or name"
                      className="flex-1 px-3 py-2 border border-slate-700/80 rounded-xl bg-black/40 text-white text-xs outline-none focus:border-primary font-mono"
                    />
                    <button
                      type="button"
                      onClick={randomizeAvatar}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs text-white transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Avatars are generated dynamically from your unique identification seed.
                  </p>
                </div>
              </div>

              {/* Administrative Stats Card */}
              <div className="p-6 rounded-3xl bg-[#0d1527] border border-slate-700/70 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Award className="w-5 h-5 text-secondary" />
                  <h3 className="text-base font-bold text-white font-poppins">Governance Activity</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-400">AI Directives Approved</span>
                    <span className="font-mono font-bold text-white">48 Policies</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Simulations Executed</span>
                    <span className="font-mono font-bold text-cyan-400">124 Scenarios</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Multiagent Swarm Audits</span>
                    <span className="font-mono font-bold text-emerald-400">99.8% Pass</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Last Authentication</span>
                    <span className="font-mono font-bold text-gray-300">Today, 10:48 AM</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-gray-400">Encryption Method</span>
                    <span className="font-mono font-bold text-primary">AES-256 GCM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Form Fields & Details */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSaveProfile} className="p-6 md:p-8 rounded-3xl bg-[#0d1527] border border-slate-700/70 shadow-xl space-y-6">
                
                <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-poppins">Personal & Official Information</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Update your name, email, government role, and administrative jurisdiction.
                    </p>
                  </div>
                  <span className="hidden sm:flex text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Officer
                  </span>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">
                      First Name
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Role Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
                    </label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-primary" /> Official Role / Designation
                    </label>
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-[#08101e] text-white transition-all sm:text-sm outline-none font-medium cursor-pointer"
                    >
                      <option value="Government Officer">Government Officer</option>
                      <option value="Municipal Commissioner">Municipal Commissioner</option>
                      <option value="Chief Urban Data Strategist">Chief Urban Data Strategist</option>
                      <option value="Smart City Director">Smart City Director</option>
                      <option value="AI Policy Administrator">AI Policy Administrator</option>
                      <option value="Disaster Mitigation Lead">Disaster Mitigation Lead</option>
                      <option value="Public Infrastructure Officer">Public Infrastructure Officer</option>
                    </select>
                  </div>
                </div>

                {/* Department & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-emerald-400" /> Department / Directorate
                    </label>
                    <input 
                      type="text" 
                      value={department} 
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-yellow-400" /> Government Badge / Employee ID
                    </label>
                    <input 
                      type="text" 
                      value={badgeId} 
                      onChange={(e) => setBadgeId(e.target.value)}
                      required
                      className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium font-mono"
                    />
                  </div>
                </div>

                {/* Region & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" /> Assigned Jurisdiction / Region
                    </label>
                    <input 
                      type="text" 
                      value={region} 
                      onChange={(e) => setRegion(e.target.value)}
                      required
                      className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" /> Official Phone / Emergency Contact
                    </label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium font-mono"
                    />
                  </div>
                </div>

                {/* Clearance Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Digital Twin Security Clearance
                  </label>
                  <input 
                    type="text" 
                    value={clearance} 
                    onChange={(e) => setClearance(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium"
                  />
                </div>

                {/* Officer Bio / Statement */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">
                    Officer Bio / Administrative Brief
                  </label>
                  <textarea 
                    rows={3} 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium custom-scrollbar"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-gray-400">
                    Saving updates your live identity in the Navbar, simulation audit logs, and reports.
                  </p>

                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-cyan-500 hover:from-primaryHover hover:to-cyan-400 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Profile Changes
                  </button>
                </div>

              </form>
            </div>

          </div>

          <DashboardFooter />
        </main>
      </div>
    </div>
  );
}
