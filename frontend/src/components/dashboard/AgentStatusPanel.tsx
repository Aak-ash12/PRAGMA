import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Zap, X, Terminal, RefreshCw, Cpu, CheckCircle2, Network, Play, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

interface Agent {
  name: string;
  status: 'Online' | 'Reasoning';
  conf: number;
  task: string;
  connected: number;
  category: string;
  latency: string;
  memory: string;
  logs: string[];
}

const agentsData: Agent[] = [
  { 
    name: 'Citizen Agent', 
    status: 'Online', 
    conf: 92, 
    task: 'Mobility simulation & demographic dynamics', 
    connected: 4,
    category: 'Population Behavior',
    latency: '14ms',
    memory: '128 MB',
    logs: [
      '[16:40:12] Initialized ABM grid traversal for 5,000 synthetic citizens.',
      '[16:41:05] Calculated commute bottleneck risk index for Sector 3: 0.14 (Low).',
      '[16:43:22] Updating mobility telemetry vectors.'
    ]
  },
  { 
    name: 'Hospital Agent', 
    status: 'Online', 
    conf: 95, 
    task: 'Bed capacity & ICU resource optimization', 
    connected: 3,
    category: 'Healthcare',
    latency: '8ms',
    memory: '256 MB',
    logs: [
      '[16:38:00] Polling 12 primary municipal hospitals.',
      '[16:40:44] ICU load at 78% capacity across Central Sector.',
      '[16:44:10] Recommending 12% budget reallocation for emergency stockpiles.'
    ]
  },
  { 
    name: 'School Agent', 
    status: 'Online', 
    conf: 88, 
    task: 'Emergency shelter & evacuation planning', 
    connected: 2,
    category: 'Public Infrastructure',
    latency: '22ms',
    memory: '96 MB',
    logs: [
      '[16:35:10] Verified 45 designated emergency shelter facilities.',
      '[16:42:01] Simulated 2-hour evacuation capacity: 18,500 citizens.'
    ]
  },
  { 
    name: 'Traffic Agent', 
    status: 'Reasoning', 
    conf: 76, 
    task: 'Congestion rerouting & signal timing', 
    connected: 5,
    category: 'Transit Control',
    latency: '45ms',
    memory: '512 MB',
    logs: [
      '[16:44:00] Detected 35% speed drop along Outer Ring Highway.',
      '[16:44:30] Reasoning multi-junction signal adjustment matrix...',
      '[16:45:01] Evaluating automated green-wave priority for ambulances.'
    ]
  },
  { 
    name: 'Water Agent', 
    status: 'Online', 
    conf: 99, 
    task: 'Reservoir monitoring & supply distribution', 
    connected: 3,
    category: 'Utilities',
    latency: '11ms',
    memory: '180 MB',
    logs: [
      '[16:30:00] Water purity telemetry verified across 8 filtration plants.',
      '[16:43:15] Reservoir levels stable at 84% full.'
    ]
  },
  { 
    name: 'Electricity Agent', 
    status: 'Online', 
    conf: 91, 
    task: 'Grid load balancing & peak demand prediction', 
    connected: 4,
    category: 'Energy Infrastructure',
    latency: '16ms',
    memory: '310 MB',
    logs: [
      '[16:39:10] Substation 4 thermal index nominal.',
      '[16:42:50] Smart grid automated load shifting active for industrial zone.'
    ]
  },
  { 
    name: 'Emergency Agent', 
    status: 'Reasoning', 
    conf: 84, 
    task: 'First-responder dispatch coordination', 
    connected: 6,
    category: 'Public Safety',
    latency: '38ms',
    memory: '420 MB',
    logs: [
      '[16:43:00] Received high-priority weather warning alert.',
      '[16:44:12] Synthesizing flood-prone zone response staging...',
      '[16:45:02] Coordinating 20 auxiliary response units.'
    ]
  },
  { 
    name: 'Government Agent', 
    status: 'Online', 
    conf: 96, 
    task: 'Policy validation & budget compliance', 
    connected: 8,
    category: 'Governance',
    latency: '6ms',
    memory: '640 MB',
    logs: [
      '[16:30:10] Loaded RBAC authorization tables.',
      '[16:41:00] Verified fiscal policy proposal compliance.'
    ]
  },
  { 
    name: 'LLM Coordinator', 
    status: 'Online', 
    conf: 98, 
    task: 'Multi-agent orchestration & policy synthesis', 
    connected: 8,
    category: 'Core AI Engine',
    latency: '5ms',
    memory: '1024 MB',
    logs: [
      '[16:44:00] Consolidating telemetry streams from 8 specialized agents.',
      '[16:44:50] Synthesized 3 actionable policy interventions.',
      '[16:45:10] System status: OPTIMAL.'
    ]
  },
];

export default function AgentStatusPanel() {
  const [filter, setFilter] = useState<'All' | 'Online' | 'Reasoning'>('All');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    // Stop speech synthesis when modal closes
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedAgent]);

  const filteredAgents = filter === 'All' 
    ? agentsData 
    : agentsData.filter(a => a.status === filter);

  const onlineCount = agentsData.filter(a => a.status === 'Online').length;
  const reasoningCount = agentsData.filter(a => a.status === 'Reasoning').length;

  const toggleSpeakLogs = (agent: Agent) => {
    if (!('speechSynthesis' in window)) {
      addToast('Speech synthesis not supported in this browser.', 'warning');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanLogs = agent.logs.map(l => l.replace(/^\[.*?\]\s*/, '')).join('. ');
    const textToSpeak = `${agent.name} status report. Active objective: ${agent.task}. Recent logs: ${cleanLogs}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    addToast(`Voice output active for ${agent.name}`, 'info');
  };

  const handleRunDiagnostic = () => {
    if (!selectedAgent) return;
    setRunningAction('diag');
    setDiagnosticResult(null);

    setTimeout(() => {
      setRunningAction(null);
      setDiagnosticResult(`Diagnostic Passed: ${selectedAgent.name} latency ${selectedAgent.latency}, 0 memory leaks.`);
      addToast(`Diagnostic check completed for ${selectedAgent.name}`, 'success');
    }, 900);
  };

  const handleExecuteTask = () => {
    if (!selectedAgent) return;
    setRunningAction('exec');

    setTimeout(() => {
      setRunningAction(null);
      addToast(`Optimization task executed successfully for ${selectedAgent.name}`, 'info');
    }, 1000);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              <h3 className="text-white font-poppins font-medium">Multi-Agent System Status</h3>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">CrewAI Swarm Network (Touch card to inspect)</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('All')}
              className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all ${
                filter === 'All'
                  ? 'bg-primary/20 text-white border-primary/50'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              All ({agentsData.length})
            </button>
            <button
              onClick={() => setFilter('Online')}
              className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                filter === 'Online'
                  ? 'bg-success/20 text-success border-success/50'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-success"></span> Online ({onlineCount})
            </button>
            <button
              onClick={() => setFilter('Reasoning')}
              className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                filter === 'Reasoning'
                  ? 'bg-warning/20 text-warning border-warning/50'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span> Reasoning ({reasoningCount})
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredAgents.map((agent, i) => (
            <motion.div 
              key={agent.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => {
                setSelectedAgent(agent);
                setDiagnosticResult(null);
              }}
              className="p-4 rounded-xl border border-white/10 bg-black/30 hover:border-primary/60 hover:bg-white/10 cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-2.5">
                <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{agent.name}</h4>
                {agent.status === 'Online' ? (
                  <ShieldCheck className="w-4 h-4 text-success" />
                ) : (
                  <Zap className="w-4 h-4 text-warning animate-pulse" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-white font-mono font-bold">{agent.conf}%</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${agent.status === 'Online' ? 'bg-success' : 'bg-warning'}`} 
                    style={{ width: `${agent.conf}%` }}
                  ></div>
                </div>
                
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <div className="text-[10px] text-gray-400 truncate pr-2" title={agent.task}>{agent.task}</div>
                  <div className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">
                    <Activity className="w-3 h-3" /> {agent.connected}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AGENT INSPECTION MODAL */}
      <AnimatePresence>
        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-xl w-full p-6 bg-[#111827] border border-white/20 shadow-2xl rounded-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setSelectedAgent(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className={`p-2 rounded-lg ${selectedAgent.status === 'Online' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedAgent.name}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      selectedAgent.status === 'Online' ? 'bg-success/20 text-success border border-success/30' : 'bg-warning/20 text-warning border border-warning/30'
                    }`}>
                      {selectedAgent.status}
                    </span>
                  </h3>
                  <div className="text-[11px] text-gray-400">{selectedAgent.category} • Latency: {selectedAgent.latency}</div>
                </div>
              </div>

              {/* STATS ROW */}
              <div className="grid grid-cols-4 gap-2 mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                <div>
                  <div className="text-[9px] text-gray-400 uppercase">Confidence</div>
                  <div className="text-sm font-mono font-bold text-success">{selectedAgent.conf}%</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 uppercase">Sub-agents</div>
                  <div className="text-sm font-mono font-bold text-primary">{selectedAgent.connected} Connected</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 uppercase">Memory Allocation</div>
                  <div className="text-sm font-mono font-bold text-secondary">{selectedAgent.memory}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 uppercase">Response Latency</div>
                  <div className="text-sm font-mono font-bold text-gray-200">{selectedAgent.latency}</div>
                </div>
              </div>

              {/* CURRENT TASK */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase text-gray-400 mb-1">Active Swarm Objective</div>
                <div className="text-xs text-white bg-black/40 p-2.5 rounded-lg border border-white/10 font-mono">
                  {selectedAgent.task}
                </div>
              </div>

              {/* LOGS STREAM */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-primary" /> Live Reasoning & Execution Log
                  </div>
                  <button
                    onClick={() => toggleSpeakLogs(selectedAgent)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                      isSpeaking
                        ? 'bg-danger/20 text-danger border border-danger/40 animate-pulse'
                        : 'bg-primary/20 text-primary hover:bg-primary hover:text-white border border-primary/40'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3 h-3" /> Stop Voice
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" /> Speak Voice Log
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-black/60 p-3 rounded-xl border border-white/10 font-mono text-[11px] space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                  {selectedAgent.logs.map((log, idx) => (
                    <div key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-primary font-bold">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DIAGNOSTIC RESULT NOTICE */}
              {diagnosticResult && (
                <div className="mb-4 p-2.5 rounded-lg bg-success/10 border border-success/30 text-xs text-success flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{diagnosticResult}</span>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={handleRunDiagnostic}
                  disabled={runningAction === 'diag'}
                  className="flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/10 hover:border-white/30 text-gray-200 hover:text-white bg-white/5 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${runningAction === 'diag' ? 'animate-spin text-primary' : ''}`} />
                  Diagnostic Ping
                </button>
                <button
                  onClick={handleExecuteTask}
                  disabled={runningAction === 'exec'}
                  className="flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl border border-primary/40 text-primary hover:bg-primary/20 bg-primary/10 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className={`w-3.5 h-3.5 ${runningAction === 'exec' ? 'animate-spin' : ''}`} />
                  Run Task
                </button>
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    setSelectedAgent(null);
                    navigate('/agents');
                  }}
                  className="text-xs font-bold py-2.5 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                >
                  <Network className="w-3.5 h-3.5" /> Swarm Topology
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
