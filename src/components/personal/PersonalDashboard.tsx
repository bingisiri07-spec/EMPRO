import React, { useState } from 'react';
import { 
  Lock, 
  Shield, 
  Sparkles, 
  BookOpen, 
  Award, 
  CheckSquare, 
  Milestone, 
  Users, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  Plus
} from 'lucide-react';
import { 
  Persona, 
  AchievementItem, 
  AchievementVisibility, 
  DiaryEntry, 
  PersonalGoal 
} from '../../types';
import { 
  MOCK_ACHIEVEMENTS, 
  MOCK_DIARY_ENTRIES, 
  MOCK_PERSONAL_GOALS 
} from '../../data/mockData';

interface PersonalDashboardProps {
  persona: Persona;
  onNavigateTab: (tabId: string) => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  persona,
  onNavigateTab,
}) => {
  const [achievements, setAchievements] = useState<AchievementItem[]>(MOCK_ACHIEVEMENTS);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(MOCK_DIARY_ENTRIES);
  const [goals] = useState<PersonalGoal[]>(MOCK_PERSONAL_GOALS);
  const [tasks, setTasks] = useState([
    { id: 'tsk_1', text: 'Review Chapter 4 on Memory Safety in Rust', completed: true },
    { id: 'tsk_2', text: 'Complete 8km interval pacing run', completed: false },
    { id: 'tsk_3', text: 'Draft abstract for autonomous agent privacy paper', completed: false },
  ]);

  // Quick Capture State
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [quickMood, setQuickMood] = useState<'Energized' | 'Focused' | 'Reflective' | 'Accomplished'>('Reflective');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Personal Copilot State
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotReply, setCopilotReply] = useState<string | null>(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  const handleQuickCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContent.trim()) return;

    const newEntry: DiaryEntry = {
      id: `dr_${Date.now()}`,
      title: quickTitle.trim() || 'Evening Reflection',
      content: quickContent.trim(),
      date: 'Today, 21 Nov 2026',
      mood: quickMood,
      tags: ['Personal', 'Reflection'],
      isFavorite: false,
      isPrivate: true,
    };

    setDiaryEntries([newEntry, ...diaryEntries]);
    setQuickTitle('');
    setQuickContent('');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleUpdateVisibility = (id: string, newVisibility: AchievementVisibility) => {
    setAchievements(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, visibility: newVisibility };
      }
      return item;
    }));
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAskPersonalCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    setIsCopilotThinking(true);
    setCopilotReply(null);

    setTimeout(() => {
      const q = copilotInput.toLowerCase();
      if (q.includes('goal') || q.includes('rust')) {
        setCopilotReply('Your Rust Systems Architecture goal is at 75% progress! You have 24 days remaining until your target deadline on Dec 15th. Consistent daily blocks of 45 mins will complete the final chapter.');
      } else if (q.includes('marathon') || q.includes('run')) {
        setCopilotReply('For your Bangalore 10K goal (target: sub 48m), today calls for interval pacing: 8km with 4x1km repeats at 4:35/km. Remember to hydrate and prioritize sleep recovery.');
      } else if (q.includes('career') || q.includes('identity')) {
        setCopilotReply('Your EMPRO identity is yours for life. With 4 verified credentials and achievements spanning Apex Labs and Nexus Tech, your portable track record remains independent of any single employer.');
      } else {
        setCopilotReply(`Personal Coach: That is a thoughtful reflection on "${copilotInput}". Balancing focused deep work with personal recovery is key to sustainable long-term creative output.`);
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
              <span>Personal Domain Sanctuary</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
              EMPRO ID: EMP-904218
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            {persona.name}'s Lifelong Space
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-xl leading-relaxed">
            Your achievements, private notes, goals, and community connections belong to you. This space remains yours regardless of employment transitions.
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

        <div 
          onClick={() => onNavigateTab('goals')}
          className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Life Goals</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/50 border border-blue-800/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">3 Active Goals</p>
          <div className="w-full bg-[#080D1B] rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full" style={{ width: '75%' }} />
          </div>
          <p className="text-[11px] text-cyan-400 font-medium mt-2 flex items-center justify-between">
            <span>75% overall completion</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('diary')}
          className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Private Diary</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">{diaryEntries.length} Entries</p>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            🔒 Private & Encrypted Vault
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
            <span>Open Quick Capture</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>

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
      </div>

      {/* 3. Middle Section: Quick Capture / Diary (Left) & Achievements Showcase (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Capture & Recent Notes (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-[#F8FAFC]">Quick Capture & Reflections</h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                Private by Default
              </span>
            </div>

            {/* Quick Capture Form */}
            <form onSubmit={handleQuickCapture} className="space-y-3 p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B]">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Title / Key insight..."
                className="w-full bg-[#10182A] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-cyan-500 focus:outline-none"
              />
              <textarea
                rows={3}
                value={quickContent}
                onChange={(e) => setQuickContent(e.target.value)}
                placeholder="Capture an idea, reflection, or note for your personal diary..."
                className="w-full bg-[#10182A] border border-[#1E293B] rounded-lg p-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-cyan-500 focus:outline-none"
              />

              <div className="flex items-center justify-between pt-1">
                {/* Mood Selectors */}
                <div className="flex items-center gap-1">
                  {(['Energized', 'Focused', 'Reflective', 'Accomplished'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setQuickMood(m)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                        quickMood === m
                          ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                          : 'bg-[#10182A] border-[#1E293B] text-[#94A3B8] hover:bg-[#151F35]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!quickContent.trim()}
                  className="py-1 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs disabled:opacity-40 transition-all flex items-center gap-1 shadow-cyan-glow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              </div>

              {isSavedNotice && (
                <p className="text-[11px] text-emerald-400 font-medium text-center animate-fade-in">
                  ✓ Saved securely to personal diary vault!
                </p>
              )}
            </form>

            {/* Recent Diary Entries List */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Recent Private Notes</h4>
              {diaryEntries.slice(0, 2).map((entry) => (
                <div key={entry.id} className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F8FAFC]">{entry.title}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{entry.mood}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-2">{entry.content}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-500">{entry.date}</span>
                    {entry.tags.map(t => (
                      <span key={t} className="text-[9px] text-[#64748B] bg-[#10182A] px-1.5 py-0.2 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Showcase with 4-Tier Visibility (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Achievements & Portable Credentials</h3>
              <p className="text-xs text-[#94A3B8]">Persists across your entire career path with explicit access tiers</p>
            </div>
            <button
              onClick={() => onNavigateTab('achievements')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Manage Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Achievement Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((item) => {
              return (
                <div 
                  key={item.id}
                  className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#F8FAFC] mt-2 line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1">{item.issuer}</p>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  {/* 4-Tier Visibility Controls */}
                  <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
                    <span className="text-[10px] text-[#94A3B8]">Visibility:</span>
                    <select
                      value={item.visibility}
                      onChange={(e) => handleUpdateVisibility(item.id, e.target.value as AchievementVisibility)}
                      className="bg-[#10182A] border border-[#1E293B] rounded-lg px-2 py-1 text-[10px] text-cyan-300 font-medium focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="private">🔒 Private (Only Me)</option>
                      <option value="connections">👥 Selected Connections</option>
                      <option value="company">🏢 Current Company</option>
                      <option value="public">🌐 Public Profile</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Life Timeline, Personal Goals & Personal Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Portable Life Timeline (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Portable Life Timeline</h3>
              <p className="text-xs text-[#94A3B8]">Career journey across employers</p>
            </div>
            <Milestone className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-4 pt-1">
            <div className="relative pl-6 pb-2 border-l border-cyan-500/40">
              <span className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-[#10182A]" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F8FAFC]">Nexus Technologies Ltd</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">Current</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">Lead Frontend Engineer (2023 - Present)</p>
            </div>

            <div className="relative pl-6 pb-2 border-l border-[#1E293B]">
              <span className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-[#10182A]" />
              <p className="text-xs font-bold text-[#F8FAFC]">AWS Solutions Architect</p>
              <p className="text-[11px] text-[#94A3B8]">Associate Certification (Aug 2024)</p>
            </div>

            <div className="relative pl-6 pb-2 border-l border-[#1E293B]">
              <span className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-500 ring-4 ring-[#10182A]" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F8FAFC]">Apex Labs Inc</span>
                <span className="text-[9px] text-[#64748B]">Archived Employer</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">Software Engineer (2020 - 2023)</p>
              <p className="text-[10px] text-slate-500 italic">Personal achievements retained upon departure</p>
            </div>
          </div>
        </div>

        {/* Life Goals & Personal Checklist (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Active Life Goals</h3>
              <p className="text-xs text-[#94A3B8]">Self-directed personal growth</p>
            </div>
            <CheckSquare className="w-4 h-4 text-blue-400" />
          </div>

          <div className="space-y-3 pt-1">
            {goals.map((goal) => (
              <div key={goal.id} className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#F8FAFC]">{goal.title}</span>
                  <span className="text-cyan-400 font-mono font-bold">{goal.progress}%</span>
                </div>
                <div className="w-full bg-[#10182A] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full" 
                    style={{ width: `${goal.progress}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#94A3B8]">
                  <span>{goal.category}</span>
                  <span>Target: {goal.targetDate}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1E293B] space-y-2">
            <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Today's Focus Habits</h4>
            <div className="space-y-1.5">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#080D1B] border border-[#1E293B]/60 text-xs cursor-pointer hover:border-blue-500/40 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="rounded bg-[#10182A] border-[#1E293B] text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-[11px] ${task.completed ? 'line-through text-slate-500' : 'text-[#F8FAFC]'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Copilot (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-[#10182A] via-[#112038] to-[#10182A] border border-cyan-500/30 shadow-cyan-glow space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F8FAFC]">Personal Copilot</h3>
                  <p className="text-[11px] text-cyan-400">Private mentor & life organizer</p>
                </div>
              </div>
              <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                Private AI
              </span>
            </div>

            {/* Response area */}
            <div className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B] min-h-[90px] flex items-center text-xs leading-relaxed">
              {isCopilotThinking ? (
                <div className="flex items-center gap-2 text-cyan-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing personal goals and reflections...</span>
                </div>
              ) : copilotReply ? (
                <p className="text-[#F8FAFC]">{copilotReply}</p>
              ) : (
                <p className="text-[#94A3B8]">
                  Ask about your goals, study plans, running schedule, or reflections. Zero connection to your employer.
                </p>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'My 10K marathon target',
                'Status of Rust goal',
                'Explain portable identity'
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setCopilotInput(prompt)}
                  className="text-[10px] py-1 px-2.5 rounded-lg bg-[#151F35] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#19253F] border border-[#1E293B] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAskPersonalCopilot} className="relative mt-2">
            <input
              type="text"
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder="Ask personal growth coach..."
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
    </div>
  );
};
