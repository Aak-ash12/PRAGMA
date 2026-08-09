import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import ReportDashboard from '../components/reports/ReportDashboard';
import GenerateReport from '../components/reports/GenerateReport';
import ReportPreview from '../components/reports/ReportPreview';
import ExportCenter from '../components/reports/ExportCenter';
import AIExecutiveSummary from '../components/reports/AIExecutiveSummary';
import HistoricalReports from '../components/reports/HistoricalReports';
import ReportCharts from '../components/reports/ReportCharts';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8 overflow-y-auto custom-scrollbar h-[calc(100vh-72px)]">
          <div className="mb-6">
            <h1 className="text-2xl font-poppins font-bold text-white tracking-wide">Reports & Government Intelligence</h1>
            <p className="text-sm text-gray-400 mt-1">Generate professional governance reports using AI insights, simulation results, and predictive analytics.</p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Row 1: KPI Dashboard */}
            <ReportDashboard />

            {/* Row 2: Generate Report & AI Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <GenerateReport />
                <AIExecutiveSummary />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6">
                <ExportCenter />
              </div>
            </div>

            {/* Row 3: Report Preview */}
            <ReportPreview />

            {/* Row 4: Charts & History */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <HistoricalReports />
              </div>
              <div className="lg:col-span-5">
                <ReportCharts />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
