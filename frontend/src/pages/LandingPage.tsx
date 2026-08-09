import { motion } from 'framer-motion';
import { Activity, BrainCircuit, Globe2, ShieldAlert } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-16 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/30 text-primary text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            System Online - v2.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-poppins font-bold tracking-tight mb-6 max-w-5xl"
          >
            Multiagent Predictive Risk Analysis & <br/> 
            <span className="text-gradient">Governance Management Assistant</span> <br/>
            <span className="text-2xl md:text-3xl font-medium text-sky-400 block mt-3">for Smart Cities Using Digital Twin</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mb-10"
          >
            Empowering smart states and urban leaders with Multi-Agent AI and real-time digital twin simulations. 
            Anticipate crises before they happen and optimize municipal resource distribution.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4"
          >
            <button className="px-8 py-4 text-base font-medium bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all">
              Initialize Dashboard
            </button>
            <button className="px-8 py-4 text-base font-medium glass rounded-full hover:bg-white/10 transition-all">
              View Documentation
            </button>
          </motion.div>
        </section>

        {/* Statistics Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12">
          {[
            { label: 'Districts Managed', value: '50+' },
            { label: 'Resources Tracked', value: '1,200+' },
            { label: 'AI Agents Deployed', value: '10' },
            { label: 'Prediction Accuracy', value: '98%' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
              className="glass-card text-center"
            >
              <div className="text-3xl md:text-4xl font-mono text-primary font-bold mb-2">{stat.value}</div>
              <div className="text-xs uppercase tracking-wider text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">Platform Capabilities</h2>
            <p className="text-gray-400">Advanced tools for modern policy making.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="w-8 h-8 text-secondary" />}
              title="Multi-Agent Intelligence"
              desc="Autonomous AI agents representing infrastructure, citizens, and hospitals work together to simulate complex urban dynamics."
            />
            <FeatureCard 
              icon={<ShieldAlert className="w-8 h-8 text-danger" />}
              title="Predictive Analytics"
              desc="Identify risks of flood, grid failure, or hospital overload weeks in advance using machine learning models."
            />
            <FeatureCard 
              icon={<Activity className="w-8 h-8 text-success" />}
              title="Resource Allocation"
              desc="Intelligently distribute budgets, emergency services, and water supplies to areas with the highest projected need."
            />
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card flex flex-col items-start"
    >
      <div className="p-3 glass rounded-xl mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-poppins mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
