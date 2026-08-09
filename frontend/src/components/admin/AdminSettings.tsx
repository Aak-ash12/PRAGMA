import { Settings, Save, Moon, Bell, Database, ShieldAlert } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="glass-card h-[350px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">System Settings</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Global Configuration</p>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Moon className="w-4 h-4 text-gray-500" /> Force Dark Theme
          </div>
          <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Bell className="w-4 h-4 text-gray-500" /> Global Notifications
          </div>
          <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Database className="w-4 h-4 text-gray-500" /> Auto-Backup (Nightly)
          </div>
          <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-danger font-bold">
            <ShieldAlert className="w-4 h-4 text-danger" /> Maintenance Mode
          </div>
          <div className="w-8 h-4 bg-black/50 border border-white/20 rounded-full relative cursor-pointer">
            <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <button className="w-full mt-4 bg-primary hover:bg-primary/80 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors text-xs font-bold uppercase tracking-wider">
        <Save className="w-4 h-4" /> Save Configuration
      </button>
    </div>
  );
}
