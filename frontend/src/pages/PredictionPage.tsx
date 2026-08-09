import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import PredictionKPICards from '../components/prediction/PredictionKPICards';
import PopulationForecast from '../components/prediction/PopulationForecast';
import HealthcareAnalytics from '../components/prediction/HealthcareAnalytics';
import WaterIntelligence from '../components/prediction/WaterIntelligence';
import ElectricityIntelligence from '../components/prediction/ElectricityIntelligence';
import TrafficAnalytics from '../components/prediction/TrafficAnalytics';
import AgricultureIntelligence from '../components/prediction/AgricultureIntelligence';
import DisasterPrediction from '../components/prediction/DisasterPrediction';
import ResourceOptimizer from '../components/prediction/ResourceOptimizer';
import BudgetIntelligence from '../components/prediction/BudgetIntelligence';
import AIInsights from '../components/prediction/AIInsights';
import api from '../services/api';

export default function PredictionPage() {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/prediction/summary')
      .then(res => {
        setPredictionData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading prediction summary data", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8 overflow-y-auto custom-scrollbar h-[calc(100vh-72px)]">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-white tracking-wide">Predictive Analytics & Resource Intelligence</h1>
              <p className="text-sm text-gray-400 mt-1 font-poppins">AI-powered forecasting and intelligent government resource optimization.</p>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-xs font-mono text-primary animate-pulse bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl">
                Calculating Models...
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* Top KPI Cards (8 Cards) */}
            <PredictionKPICards data={predictionData?.kpis} />

            {/* Row 1: Population & Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PopulationForecast data={predictionData?.population_chart} />
              <BudgetIntelligence />
            </div>

            {/* Row 2: Healthcare & Water */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HealthcareAnalytics data={predictionData?.healthcare} />
              <WaterIntelligence data={predictionData?.water} />
            </div>

            {/* Row 3: Electricity & Traffic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ElectricityIntelligence data={predictionData?.electricity} />
              <TrafficAnalytics />
            </div>

            {/* Row 4: Agriculture & Disaster */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AgricultureIntelligence />
              <DisasterPrediction data={predictionData?.disasters} />
            </div>

            {/* Row 5: Resource Optimizer & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResourceOptimizer />
              <AIInsights data={predictionData?.insights} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
