import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import PolicySummary from '../components/policies/PolicySummary';
import PolicyRecommendationsList from '../components/policies/PolicyRecommendationsList';
import PolicyImpactAnalysis from '../components/policies/PolicyImpactAnalysis';
import PolicyComparison from '../components/policies/PolicyComparison';
import DistrictRecommendations from '../components/policies/DistrictRecommendations';
import PolicyXAI from '../components/policies/PolicyXAI';
import DecisionFlow from '../components/policies/DecisionFlow';
import RecommendationTimeline from '../components/policies/RecommendationTimeline';
import AIConfidenceDashboard from '../components/policies/AIConfidenceDashboard';
import ActionCenter from '../components/policies/ActionCenter';
import { useState } from 'react';

export default function PoliciesPage() {
  const [activePolicy, setActivePolicy] = useState<any>(null);
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8 overflow-y-auto custom-scrollbar h-[calc(100vh-72px)]">
          <div className="mb-6">
            <h1 className="text-2xl font-poppins font-bold text-white tracking-wide">AI Policy Recommendation Engine</h1>
            <p className="text-sm text-gray-400 mt-1">Explainable Artificial Intelligence for Smart Governance Decision Support.</p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Row 1: Summary & Flow/Timeline */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-4 flex flex-col gap-6">
                <PolicySummary activePolicy={activePolicy} />
              </div>
              <div className="xl:col-span-8 flex flex-col gap-6">
                <RecommendationTimeline activePolicy={activePolicy} />
                <DecisionFlow activePolicy={activePolicy} />
              </div>
            </div>

            {/* Row 2: AI Recommendations (The massive list of 20) */}
            <PolicyRecommendationsList 
              selectedPolicyId={activePolicy?.id}
              onSelectPolicy={setActivePolicy}
            />

            {/* Row 3: Impact Analysis & Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PolicyImpactAnalysis activePolicy={activePolicy} />
              <PolicyComparison activePolicy={activePolicy} />
            </div>

            {/* Row 4: District Recommendations & XAI */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <DistrictRecommendations activePolicy={activePolicy} />
              </div>
              <div className="lg:col-span-5">
                <PolicyXAI activePolicy={activePolicy} />
              </div>
            </div>

            {/* Row 5: Confidence Dashboard & Action Center */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <AIConfidenceDashboard activePolicy={activePolicy} />
              </div>
              <div className="lg:col-span-4">
                <ActionCenter activePolicy={activePolicy} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
