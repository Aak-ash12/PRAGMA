import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import AgentNetwork from '../components/agents/AgentNetwork';
import AgentInspector from '../components/agents/AgentInspector';
import AgentCommunicationLog from '../components/agents/AgentCommunicationLog';
import AgentDecisionConsole from '../components/agents/AgentDecisionConsole';

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>('LLM Coordinator');

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-white tracking-wide">Multi-Agent Intelligence Command Center</h1>
              <p className="text-sm text-gray-400 mt-1">Live observation and deep inspection of autonomous swarm behavior.</p>
            </div>
          </div>

          {/* 4-Quadrant Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
            
            {/* Top Left: AI Agent Network */}
            <div className="lg:col-span-8 h-full flex flex-col gap-6">
              <div className="flex-1 min-h-[400px]">
                <AgentNetwork onSelectAgent={setSelectedAgent} />
              </div>
              
              {/* Bottom Left: Communication Timeline & Log */}
              <div className="h-[300px]">
                <AgentCommunicationLog />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 h-full flex flex-col gap-6">
              {/* Top Right: Agent Inspector */}
              <div className="flex-1 min-h-[400px]">
                <AgentInspector selectedAgent={selectedAgent} />
              </div>
              
              {/* Bottom Right: Agent Decision Console */}
              <div className="h-[300px]">
                <AgentDecisionConsole />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
