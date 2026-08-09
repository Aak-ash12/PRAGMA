import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import SystemOverview from '../components/admin/SystemOverview';
import LiveMonitoring from '../components/admin/LiveMonitoring';
import UserManagement from '../components/admin/UserManagement';
import DistrictManagement from '../components/admin/DistrictManagement';
import AIAgentManagement from '../components/admin/AIAgentManagement';
import AIModelManagement from '../components/admin/AIModelManagement';
import DatabaseMonitor from '../components/admin/DatabaseMonitor';
import APIMonitor from '../components/admin/APIMonitor';
import AuditLogs from '../components/admin/AuditLogs';
import SecurityCenter from '../components/admin/SecurityCenter';
import AdminSettings from '../components/admin/AdminSettings';
import { WebSocketService } from '../services/websocket';

export default function AdminPage() {
  const [telemetryStatus, setTelemetryStatus] = useState("Connecting...");

  useEffect(() => {
    const ws = new WebSocketService('/telemetry');
    ws.connect((data) => {
      // In a real implementation, this data would flow down to LiveMonitoring and SystemOverview
      setTelemetryStatus("Live 🟢");
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8 overflow-y-auto custom-scrollbar h-[calc(100vh-72px)]">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-white tracking-wide">Enterprise Administration Center</h1>
              <p className="text-sm text-gray-400 mt-1">Complete administration and monitoring of the PRAGMA platform.</p>
            </div>
            <div className="text-xs font-mono text-gray-400 border border-white/10 px-3 py-1 rounded bg-black/20">
              Telemetry: <span className={telemetryStatus.includes('Live') ? 'text-success' : 'text-warning'}>{telemetryStatus}</span>
            </div>
          </div>


          <div className="flex flex-col gap-6">
            {/* Row 1: System Overview & Live Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <SystemOverview />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6">
                <LiveMonitoring />
              </div>
            </div>

            {/* Row 2: User & District Management */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <UserManagement />
              </div>
              <div className="lg:col-span-4">
                <DistrictManagement />
              </div>
            </div>

            {/* Row 3: AI Agents & Models */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIAgentManagement />
              <AIModelManagement />
            </div>

            {/* Row 4: Database & API Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DatabaseMonitor />
              <APIMonitor />
            </div>

            {/* Row 5: Security, Audit, Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <SecurityCenter />
              </div>
              <div className="lg:col-span-5">
                <AuditLogs />
              </div>
              <div className="lg:col-span-3">
                <AdminSettings />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
