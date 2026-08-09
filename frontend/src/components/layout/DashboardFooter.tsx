import { Database, Server, Cpu, Brain, DatabaseZap } from 'lucide-react';

export default function DashboardFooter() {
  return (
    <footer className="ml-[280px] h-12 glass border-t border-white/10 px-8 flex items-center justify-between text-[11px] text-gray-400 font-mono tracking-wider bg-[#081120]/90 relative z-40">
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          System Status: Optimal
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-success" />
          PostgreSQL Connected
        </div>
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-success" />
          FastAPI Connected
        </div>
      </div>
      
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <DatabaseZap className="w-3.5 h-3.5 text-primary" />
          Redis Sync
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-secondary" />
          Ollama Active
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-accentPurple" />
          CrewAI Running
        </div>
      </div>
    </footer>
  );
}
