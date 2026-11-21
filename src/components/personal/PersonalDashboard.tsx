import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Shield, 
  Sparkles, 
  Award, 
  Users, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  BrainCircuit, 
  ArrowRight
} from 'lucide-react';
import { 
  Persona, 
  AchievementItem, 
  AchievementVisibility 
} from '../../types';
import { achievementService } from '../../services/achievementService';
import { decisionSimulatorService } from '../../services/decisionSimulatorService';

interface PersonalDashboardProps {
  persona: Persona;
  onNavigateTab: (tabId: string) => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  persona,
  onNavigateTab,
}) => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [simulations, setSimulations] = useState<any[]>([]);

  useEffect(() => {
    achievementService.getAchievements(persona.id).then(setAchievements);
    decisionSimulatorService.getSimulations().then(setSimulations);
  }, [persona.id]);

  // Personal Copilot State
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotReply, setCopilotReply] = useState<string | null>(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  const handleUpdateVisibility = (id: string, newVisibility: AchievementVisibility) => {
    setAchievements(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, visibility: newVisibility };
      }
      return item;
    }));
  };

  const handleAskPersonalCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    setIsCopilotThinking(true);
    setCopilotReply(null);

    setTimeout(() => {
      const q = copilotInput.toLowerCase();
      if (q.includes('decision') || q.includes('simulation') || q.includes('scenario')) {
        setCopilotReply('In your latest simulation for Ingestion Service, Scenario B (Node.js/Fastify tuning) achieved a 92% feasibility index, outperforming full Rust rewrite on short-term risk while meeting the sub-80ms p99 latency target.');
      } else if (q.includes('career') || q.includes('identity')) {
        setCopilotReply('Your EMPRO identity is portable across employers. You have 4 verified achievements and credentials that remain solely yours.');
      } else {
        setCopilotReply(`Life Copilot: Analyzed your personal inquiry regarding "${copilotInput}". Your personal insights and simulations remain completely confidential from employer visibility.`);
      }
      setIsCopilotThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Permanent Lifelong Identity Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10182A] via-[#141F38] to-[#10182A] border border-cyan-500/30 shadow-cyan-glow flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Life Domain Sanctuary</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
              EMPRO ID: EMP-904218
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            {persona.name}'s Life & Intelligence Space
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-xl leading-relaxed">
            Your achievements, verified credentials, decision simulations, and cross-company connections belong to you. This space remains yours across companies.
          </p>
        </div>

        {/* Privacy Assurance Pill */}
        <div className="p-3.5 rounded-xl bg-[#080D1B] border border-cyan-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Employer Surveillance Blocked</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              Company admins have zero access to this domain.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Personal Metrics (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Achievements Card */}
        <div 
          onClick={() => onNavigateTab('achievements')}
          className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Achievements</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">{achievements.length} Verified</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            Certifications, Awards & Papers
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
            <span>4-Tier Visibility Active</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>

        {/* Decision Simulator Card */}
        <div 
          onClick={() => onNavigateTab('decision-simulator')}
          className="p-5 rounded-2xl bg-[#10182A] border border-cyan-500/40 shadow-cyan-glow hover:border-cyan-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Decision Simulator</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{simulations.length} Simulations</p>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            Scenario Stress-Testing Active
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
            <span>Launch Simulation Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Community Hub Card */}
        <div 
          onClick={() => onNavigateTab('community')}
          className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Community Hub</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/50 border border-blue-800/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">Cross-Company</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            #Engineering • #AI-ML • #Design
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-blue-400 font-medium">
            <span>Explore Peer Posts</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>

        {/* Lifelong Profile Card */}
        <div 
          onClick={() => onNavigateTab('my-profile')}
          className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Identity & Bio</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">100% Portable</p>
          <p className="text-[11px] text-cyan-300 mt-1">
            Persists across career moves
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
            <span>View Identity Profile</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Decision Simulator Quick Launcher & Achievements Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Decision Simulator Quick Launcher (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10182A] border border-cyan-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-[#F8FAFC]">AI Decision Simulator Studio</h3>
              </div>
              <span className="text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                VISION Analytical Engine
              </span>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Stress-test proposed approaches against resource constraints, team skill availability, and technical risks before committing time and budget.
            </p>

            {/* Latest Simulation Snapshot */}
            {simulations.length > 0 && (
              <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">Latest Decision Report:</span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{simulations[0].input.title}</h4>
                <div className="p-2.5 rounded-lg bg-[#10182A] text-cyan-300">
                  <span className="font-semibold block text-[10px] uppercase text-[#64748B]">Recommended Strategy:</span>
                  <p className="font-medium line-clamp-2 mt-0.5">{simulations[0].recommendedApproach}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('decision-simulator')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-blue-glow transition-all"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Open Interactive Decision Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Portable Achievements Showcase (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Verified Portable Credentials</h3>
              <p className="text-xs text-[#94A3B8]">Controlled with 4-tier visibility permissions</p>
            </div>
            <button
              onClick={() => onNavigateTab('achievements')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Manage Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800/40">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">{item.title}</h4>
                  <p className="text-[11px] text-[#94A3B8]">{item.issuer}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#1E293B]">
                  <span className="text-slate-400">Visibility:</span>
                  <select
                    value={item.visibility}
                    onChange={(e) => handleUpdateVisibility(item.id, e.target.value as AchievementVisibility)}
                    className="bg-[#10182A] text-cyan-400 border border-[#1E293B] rounded px-2 py-0.5 text-[10px] focus:outline-none"
                  >
                    <option value="private">🔒 Private</option>
                    <option value="connections">👥 Connections</option>
                    <option value="company">🏢 Company</option>
                    <option value="public">🌐 Public</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Life Copilot */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10182A] via-[#112038] to-[#10182A] border border-cyan-500/30 shadow-cyan-glow space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Life Domain Copilot</h3>
              <p className="text-[11px] text-cyan-400">Personal strategic advisor with 0 corporate observation</p>
            </div>
          </div>
          <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
            Encrypted & Private
          </span>
        </div>

        {/* Response area */}
        <div className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B] min-h-[70px] flex items-center text-xs leading-relaxed">
          {isCopilotThinking ? (
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Synthesizing decision variables and strategic hypotheses...</span>
            </div>
          ) : copilotReply ? (
            <p className="text-[#F8FAFC]">{copilotReply}</p>
          ) : (
            <p className="text-[#94A3B8]">
              Ask for strategic feedback on project decisions, skill acquisition roadmaps, or scenario trade-offs.
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleAskPersonalCopilot} className="relative mt-2">
          <input
            type="text"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            placeholder="Ask personal strategy advisor..."
            className="w-full bg-[#080D1B] border border-[#1E293B] focus:border-cyan-500 rounded-xl py-2.5 pl-3 pr-10 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isCopilotThinking || !copilotInput.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
