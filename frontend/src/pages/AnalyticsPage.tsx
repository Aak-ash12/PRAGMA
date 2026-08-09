import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

const analyticsByTimeframe = {
  'Last 30 Days': {
    governance: [
      { name: 'Week 1', score: 88 },
      { name: 'Week 2', score: 90 },
      { name: 'Week 3', score: 92 },
      { name: 'Week 4', score: 94 },
      { name: 'Week 5', score: 95 },
      { name: 'Week 6', score: 97 },
      { name: 'Week 7', score: 98 },
    ],
    incidents: [
      { name: 'Floods', predicted: 12, actual: 11 },
      { name: 'Power Outage', predicted: 28, actual: 26 },
      { name: 'Traffic', predicted: 75, actual: 71 },
      { name: 'Water Shortage', predicted: 18, actual: 16 },
    ],
    totalTasks: '340',
    insights: {
      observation: 'The Governance Score has increased by 10 points over 7 weeks, rising from Week 1 (88) to Week 7 (98). This correlates with recent AI Swarm hydro-optimization and traffic signal routing across high-density zones.',
      accuracy: 'Predictive models for Floods and Traffic have maintained a 96.4% accuracy rate against actual incidents for the selected timeframe (Last 30 Days).',
      bottleneck: 'The Hospital Agent is currently handling 35% of all systemic tasks over the last 30 days, indicating potential resource strain in healthcare data processing pipelines.'
    }
  },
  'Last 6 Months': {
    governance: [
      { name: 'Jul', score: 92 },
      { name: 'Aug', score: 94 },
      { name: 'Sep', score: 95 },
      { name: 'Oct', score: 96 },
      { name: 'Nov', score: 97 },
      { name: 'Dec', score: 98 },
    ],
    incidents: [
      { name: 'Floods', predicted: 45, actual: 42 },
      { name: 'Power Outage', predicted: 120, actual: 115 },
      { name: 'Traffic', predicted: 300, actual: 290 },
      { name: 'Water Shortage', predicted: 85, actual: 80 },
    ],
    totalTasks: '1.2k',
    insights: {
      observation: 'The Governance Score has steadily grown by 6 points from July (92) to December (98), driven by multi-agent resource re-allocations and seasonal storm surge preparedness.',
      accuracy: 'Predictive models for Floods and Traffic have maintained a 95.8% accuracy rate against actual incidents for the selected timeframe (Last 6 Months).',
      bottleneck: 'The Hospital Agent handled 33% of total workload over the last 6 months, sustaining continuous demand across emergency triage centers.'
    }
  },
  'Year to Date': {
    governance: [
      { name: 'Jan', score: 82 },
      { name: 'Feb', score: 84 },
      { name: 'Mar', score: 83 },
      { name: 'Apr', score: 88 },
      { name: 'May', score: 86 },
      { name: 'Jun', score: 89 },
      { name: 'Jul', score: 92 },
      { name: 'Aug', score: 94 },
      { name: 'Sep', score: 95 },
      { name: 'Oct', score: 96 },
      { name: 'Nov', score: 97 },
      { name: 'Dec', score: 98 },
    ],
    incidents: [
      { name: 'Floods', predicted: 95, actual: 91 },
      { name: 'Power Outage', predicted: 260, actual: 248 },
      { name: 'Traffic', predicted: 620, actual: 595 },
      { name: 'Water Shortage', predicted: 180, actual: 172 },
    ],
    totalTasks: '2.4k',
    insights: {
      observation: 'The Governance Score has increased by 16 points from January (82) to December (98). This correlates heavily with the deployment of the Water Resource Agent and AI Swarm optimization across low and high-density zones.',
      accuracy: 'Predictive models for Floods and Traffic have maintained a 94.2% accuracy rate against actual incidents for the selected timeframe (Year to Date).',
      bottleneck: 'The Hospital Agent handled 31% of total tasks annually, representing the primary system workload driver for Year to Date.'
    }
  }
};

const agentData = [
  { name: 'Hospital Agent', value: 400 },
  { name: 'Traffic Agent', value: 300 },
  { name: 'Water Agent', value: 300 },
  { name: 'Citizen Agent', value: 200 },
];

const COLORS = ['#2563EB', '#7C3AED', '#06B6D4', '#10B981'];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'Last 30 Days' | 'Last 6 Months' | 'Year to Date'>('Year to Date');

  const currentData = analyticsByTimeframe[timeframe];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 lg:pl-[280px]">
        <DashboardNavbar />
        
        <main className="p-8 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">Platform Analytics</h1>
                <p className="text-gray-400">Deep dive into historical data, AI accuracy, and governance trends.</p>
              </div>
              <div className="flex gap-2">
                <select 
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="bg-black/40 border border-white/10 text-white text-sm rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                >
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="Year to Date">Year to Date (Jan - Dec)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Governance Trend */}
              <div className="glass-card p-6 flex flex-col h-[400px]">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <LineChartIcon className="w-5 h-5 text-primary" /> Governance Score Trend
                  </span>
                  <span className="text-xs font-mono text-primary bg-primary/20 border border-primary/30 px-2.5 py-1 rounded-md">
                    {timeframe === 'Year to Date' ? 'Jan - Dec (Full Year)' : timeframe}
                  </span>
                </h3>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData.governance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Prediction Accuracy */}
              <div className="glass-card p-6 flex flex-col h-[400px]">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-secondary" /> Prediction Accuracy
                  </span>
                  <span className="text-xs font-mono text-secondary bg-secondary/20 border border-secondary/30 px-2.5 py-1 rounded-md">
                    {timeframe} Metrics
                  </span>
                </h3>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData.incidents} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="predicted" name="AI Predicted" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" name="Actual Incidents" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agent Activity Distribution */}
              <div className="glass-card p-6 flex flex-col h-[350px] col-span-1 lg:col-span-1">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-warning" /> Agent Workload
                </h3>
                <p className="text-xs text-gray-400 mb-4">Distribution of AI tasks ({timeframe})</p>
                <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={agentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {agentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">{currentData.totalTasks}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total Tasks</span>
                  </div>
                </div>
              </div>

              {/* Key Insights Text */}
              <div className="glass-card p-6 col-span-1 lg:col-span-2 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-white mb-6">AI Automated Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <p className="text-sm text-gray-200">
                      <span className="font-bold text-primary">Observation:</span> {currentData.insights.observation}
                    </p>
                  </div>
                  <div className="p-4 bg-success/10 border border-success/20 rounded-xl">
                    <p className="text-sm text-gray-200">
                      <span className="font-bold text-success">Accuracy Report:</span> {currentData.insights.accuracy}
                    </p>
                  </div>
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl">
                    <p className="text-sm text-gray-200">
                      <span className="font-bold text-warning">Bottleneck Warning:</span> {currentData.insights.bottleneck}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}
