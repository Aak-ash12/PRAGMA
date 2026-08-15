import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import ScenarioSelector from '../components/simulation/ScenarioSelector';
import DigitalTwinView from '../components/simulation/DigitalTwinView';
import SimulationControls from '../components/simulation/SimulationControls';
import SimulationTimeline from '../components/simulation/SimulationTimeline';
import SimulationResults from '../components/simulation/SimulationResults';
import ResourceImpact from '../components/simulation/ResourceImpact';
import RiskHeatmap from '../components/simulation/RiskHeatmap';
import SimulationXAI from '../components/simulation/SimulationXAI';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function SimulationPage() {
  const [searchParams] = useSearchParams();
  const scenarioParam = searchParams.get('scenario');
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeScenario, setActiveScenario] = useState(() => {
    return (scenarioParam && ['flood', 'disease', 'power', 'population', 'traffic', 'weather'].includes(scenarioParam)) ? scenarioParam : 'flood';
  });
  const [hasRun, setHasRun] = useState(false);
  const [activePeriod, setActivePeriod] = useState('30 Days');
  const [simulationData, setSimulationData] = useState<any[] | null>(null);
  const [pipelinePayload, setPipelinePayload] = useState<any | null>(null);
  
  // New states for live timeline playback
  const [simulationStep, setSimulationStep] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  
  const { addToast } = useToast();

  useEffect(() => {
    const param = searchParams.get('scenario');
    if (param && ['flood', 'disease', 'power', 'population', 'traffic', 'weather'].includes(param)) {
      setActiveScenario(param);
    }
  }, [searchParams]);

  const handleScenarioChange = (scenario: string) => {
    setActiveScenario(scenario);
    setHasRun(false);
    setSimulationStep(-1);
    setIsSimulating(false);
    setSimulationData(null);
    setPipelinePayload(null);
  };

  const handleRunSimulation = () => {
    if (isSimulating) return; // prevent double clicks
    setHasRun(false);
    setSimulationStep(0);
    setIsSimulating(true);
    setSimulationData(null);
    setPipelinePayload(null);

    // Call API immediately to fetch predictions
    api.post('/simulation/run', { scenario: activeScenario, period: activePeriod })
      .then(res => {
        let trajectory = res.data;
        let pipeline = null;
        if (Array.isArray(res.data)) {
          trajectory = res.data;
          pipeline = res.data[0]?.pipeline_steps || null;
        } else if (res.data && res.data.trajectory) {
          trajectory = res.data.trajectory;
          pipeline = res.data.pipeline_steps || null;
        }
        setSimulationData(trajectory);
        setPipelinePayload(pipeline);
      })
      .catch(err => {
        console.warn("Backend API offline — running embedded AI Digital Twin simulation engine.", err);
      });
  };

  // Interval logic for playback speed
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isSimulating) {
      const speedMap: Record<string, number> = { '1x': 1000, '2x': 500, '5x': 200, '10x': 100 };
      const delay = speedMap[playbackSpeed] || 1000;
      
      interval = setInterval(() => {
        setSimulationStep(prev => {
          if (prev >= 3) {
            setIsSimulating(false);
            setHasRun(true);
            addToast(`Simulation for '${activeScenario}' completed by AI Swarm!`, 'success');
            return 4;
          }
          return prev + 1;
        });
      }, delay);
    }
    return () => clearInterval(interval);
  }, [isSimulating, playbackSpeed, activeScenario, addToast]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-poppins font-bold text-white tracking-wide">Digital Twin & Predictive Simulation</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE TELEMETRY STREAMING
                </span>
              </div>
              <p className="text-sm text-gray-400">Run AI-powered simulations to evaluate future governance scenarios before implementation.</p>
              
              {/* Highlight Banner showing what is real-time telemetry vs predicted model */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold text-white">Live Baseline Sensor Feed:</span> Real-Time Weather & Hospital Telemetry
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-blue-500/30 text-[11px] text-blue-300 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span className="font-semibold text-white">Real-Time AI Prediction:</span> Multi-Agent Hydrodynamic/SIR Inference
                </div>
              </div>

              {isSimulating && <p className="text-primary text-xs mt-2 font-mono animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                Running Multi-Agent LangGraph Swarm (Euler SIR & Runoff Equations)...
              </p>}
            </div>
            <SimulationControls 
              onPlay={handleRunSimulation} 
              activePeriod={activePeriod}
              onPeriodChange={setActivePeriod}
              activeSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Left: Scenario & Timeline */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <ScenarioSelector activeScenario={activeScenario} onSelect={handleScenarioChange} />
              <SimulationTimeline activeScenario={activeScenario} simulationStep={simulationStep} pipelinePayload={pipelinePayload} />
            </div>

            {/* Top Center: Digital Twin Map */}
            <div className="lg:col-span-6 h-[550px]">
              <DigitalTwinView activeScenario={activeScenario} hasRun={hasRun} simulationStep={simulationStep} simulationData={simulationData} pipelinePayload={pipelinePayload} />
            </div>

            {/* Top Right: Explainable AI & Heatmap */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <RiskHeatmap activeScenario={activeScenario} hasRun={hasRun} activePeriod={activePeriod} simulationStep={simulationStep} simulationData={simulationData} />
              <SimulationXAI activeScenario={activeScenario} simulationStep={simulationStep} simulationData={simulationData} pipelinePayload={pipelinePayload} />
            </div>
          </div>

          {/* Bottom Section: Analytics & Impacts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-7">
              <SimulationResults activeScenario={activeScenario} hasRun={hasRun || isSimulating} simulationData={simulationData} simulationStep={simulationStep} />
            </div>
            <div className="lg:col-span-5">
              <ResourceImpact activeScenario={activeScenario} hasRun={hasRun || isSimulating} simulationStep={simulationStep} simulationData={simulationData} pipelinePayload={pipelinePayload} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
