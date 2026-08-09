// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HeartPulse, CheckCircle2, TrendingDown, AlertTriangle } from 'lucide-react';

const baselineData = {
  '7 Days': [
    { day: 'Day 1', hospital: 68, traffic: 45 },
    { day: 'Day 2', hospital: 74, traffic: 52 },
    { day: 'Day 3', hospital: 82, traffic: 60 },
    { day: 'Day 4', hospital: 88, traffic: 68 },
    { day: 'Day 5', hospital: 92, traffic: 79 },
    { day: 'Day 6', hospital: 95, traffic: 88 },
    { day: 'Day 7', hospital: 98, traffic: 94 },
  ],
  '30 Days': [
    { day: 'Week 1', hospital: 72, traffic: 55 },
    { day: 'Week 2', hospital: 85, traffic: 68 },
    { day: 'Week 3', hospital: 92, traffic: 82 },
    { day: 'Week 4', hospital: 98, traffic: 95 },
    { day: 'Week 5', hospital: 88, traffic: 78 },
  ],
  '6 Months': [
    { day: 'Month 1', hospital: 65, traffic: 55 },
    { day: 'Month 2', hospital: 78, traffic: 68 },
    { day: 'Month 3', hospital: 96, traffic: 89 },
    { day: 'Month 4', hospital: 88, traffic: 75 },
    { day: 'Month 5', hospital: 75, traffic: 60 },
    { day: 'Month 6', hospital: 68, traffic: 52 },
  ],
  '1 Year': [
    { day: 'Q1', hospital: 70, traffic: 58 },
    { day: 'Q2', hospital: 92, traffic: 84 },
    { day: 'Q3', hospital: 98, traffic: 92 },
    { day: 'Q4', hospital: 76, traffic: 64 },
  ]
};

const deployedData = {
  '7 Days': [
    { day: 'Day 1', hospital: 68, traffic: 45 },
    { day: 'Day 2', hospital: 58, traffic: 42 },
    { day: 'Day 3', hospital: 46, traffic: 38 },
    { day: 'Day 4', hospital: 38, traffic: 32 },
    { day: 'Day 5', hospital: 31, traffic: 28 },
    { day: 'Day 6', hospital: 28, traffic: 25 },
    { day: 'Day 7', hospital: 24, traffic: 22 },
  ],
  '30 Days': [
    { day: 'Week 1', hospital: 58, traffic: 45 },
    { day: 'Week 2', hospital: 42, traffic: 38 },
    { day: 'Week 3', hospital: 34, traffic: 30 },
    { day: 'Week 4', hospital: 28, traffic: 26 },
    { day: 'Week 5', hospital: 25, traffic: 22 },
  ],
  '6 Months': [
    { day: 'Month 1', hospital: 50, traffic: 42 },
    { day: 'Month 2', hospital: 38, traffic: 35 },
    { day: 'Month 3', hospital: 30, traffic: 28 },
    { day: 'Month 4', hospital: 28, traffic: 26 },
    { day: 'Month 5', hospital: 26, traffic: 24 },
    { day: 'Month 6', hospital: 24, traffic: 22 },
  ],
  '1 Year': [
    { day: 'Q1', hospital: 52, traffic: 45 },
    { day: 'Q2', hospital: 38, traffic: 32 },
    { day: 'Q3', hospital: 28, traffic: 26 },
    { day: 'Q4', hospital: 24, traffic: 22 },
  ]
};

export default function PredictiveLineCharts() {
  const [timeframe, setTimeframe] = useState('7 Days');
  const [isDeployed, setIsDeployed] = useState(() => sessionStorage.getItem('pragma_directive_deployed') === 'true');

  useEffect(() => {
    const handleUpdate = () => {
      setIsDeployed(sessionStorage.getItem('pragma_directive_deployed') === 'true');
    };
    window.addEventListener('pragma_directive_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pragma_directive_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const dataSet = isDeployed ? deployedData : baselineData;
  const activeData = dataSet[timeframe] || dataSet['7 Days'];

  const messages = {
    '7 Days': {
      baseline: { text: "Warning: ICU Bed Overload Ahead (98% Saturation).", subtext: "Re-optimize matrix & deploy directive.", badge: "HIGH STRESS" },
      deployed: { text: "ICU Beds Have Been Increased!", subtext: "Hospital occupancy dropped from 98% down to 24%.", badge: "-74% Load" }
    },
    '30 Days': {
      baseline: { text: "Warning: Sustained high occupancy.", subtext: "Approaching 98% Saturation by Week 4.", badge: "CRITICAL TREND" },
      deployed: { text: "Capacity Stabilized!", subtext: "Sustained management keeps occupancy below 28%.", badge: "-73% Load" }
    },
    '6 Months': {
      baseline: { text: "Warning: Long-term capacity risk.", subtext: "Seasonal spike to 96% expected in Month 3.", badge: "SEASONAL RISK" },
      deployed: { text: "Seasonal Spikes Prevented!", subtext: "Long-term policy maintains occupancy <30%.", badge: "-72% Load" }
    },
    '1 Year': {
      baseline: { text: "Warning: Annual capacity shortfall.", subtext: "Critical 98% deficit forecasted for Q3.", badge: "ANNUAL DEFICIT" },
      deployed: { text: "Annual Capacity Secured!", subtext: "Q3 peak eliminated completely.", badge: "-74% Load" }
    }
  };

  const currentMessage = messages[timeframe as keyof typeof messages] || messages['7 Days'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass-card h-[380px] flex flex-col relative border border-white/10"
    >
      <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
        <div>
          <h3 className="text-white font-poppins font-semibold text-sm flex items-center gap-2">
            Predictive Analytics & Hospital Occupancy
            {isDeployed ? (
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> DEPLOYED FORECAST
              </span>
            ) : (
              <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" /> BASELINE DEFICIT
              </span>
            )}
          </h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Multi-Horizon AI Forecast Models</p>
        </div>

        <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
          {['7 Days', '30 Days', '6 Months', '1 Year'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-all ${
                timeframe === tf 
                  ? 'bg-primary text-white shadow-md shadow-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Status Notification Banner */}
      <div className="mb-2">
        {isDeployed ? (
          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-2 font-medium">
              <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
              <strong>{currentMessage.deployed.text}</strong> {currentMessage.deployed.subtext}
            </span>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> {currentMessage.deployed.badge}
            </span>
          </div>
        ) : (
          <div className="bg-rose-950/60 border border-rose-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs text-rose-300">
            <span className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              <strong>{currentMessage.baseline.text}</strong> {currentMessage.baseline.subtext}
            </span>
            <span className="text-[10px] font-mono font-bold bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">
              {currentMessage.baseline.badge}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
            />
            <Line 
              type="monotone" 
              dataKey="hospital" 
              stroke={isDeployed ? "#10B981" : "#EF4444"} 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2 }} 
              activeDot={{ r: 6 }} 
              name={isDeployed ? "Hospital Occupancy (ICU Increased %)" : "Hospital Occupancy (Baseline %)"} 
            />
            <Line 
              type="monotone" 
              dataKey="traffic" 
              stroke="#2563EB" 
              strokeWidth={2} 
              strokeDasharray={isDeployed ? "0" : "4 4"}
              dot={{ r: 3 }} 
              name="Traffic Congestion Index" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

