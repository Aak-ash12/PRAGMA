import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import DecisionSummary from '../components/xai/DecisionSummary';
import DecisionExplanation from '../components/xai/DecisionExplanation';
import FeatureImportance from '../components/xai/FeatureImportance';
import ReasoningChain from '../components/xai/ReasoningChain';
import AlternativePolicies from '../components/xai/AlternativePolicies';
import XAIConfidenceDashboard from '../components/xai/XAIConfidenceDashboard';
import DistrictAnalysis from '../components/xai/DistrictAnalysis';
import AIAuditLog from '../components/xai/AIAuditLog';
import ExportPanel from '../components/xai/ExportPanel';

export default function XAIPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8 overflow-y-auto custom-scrollbar h-[calc(100vh-72px)]">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-white tracking-wide">Explainable Artificial Intelligence (XAI)</h1>
              <p className="text-sm text-gray-400 mt-1">Transparent AI decision-making for accountable and trustworthy governance.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Top Row: Summary & Explanation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <DecisionSummary />
              </div>
              <div className="lg:col-span-8">
                <DecisionExplanation />
              </div>
            </div>

            {/* Row 2: Reasoning Chain & Feature Importance */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ReasoningChain />
              </div>
              <div className="lg:col-span-5">
                <FeatureImportance />
              </div>
            </div>

            {/* Row 3: Confidence & Alternatives */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <XAIConfidenceDashboard />
              </div>
              <div className="lg:col-span-8">
                <AlternativePolicies />
              </div>
            </div>

            {/* Row 4: District Analysis */}
            <div>
              <DistrictAnalysis />
            </div>

            {/* Row 5: Audit Log & Export */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-9">
                <AIAuditLog />
              </div>
              <div className="lg:col-span-3">
                <ExportPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
