import React, { useState } from 'react';
import { Domain, Persona } from '../../types';
import { DEMO_PERSONAS } from '../../data/mockData';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { PersonalLockModal } from '../auth/PersonalLockModal';
import { 
  Building2, 
  User, 
  Sparkles, 
  Clock, 
  Wallet, 
  CalendarCheck, 
  ShieldCheck, 
  BookOpen, 
  Users 
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const [currentPersona, setCurrentPersona] = useState<Persona>(DEMO_PERSONAS.employee);
  const [currentDomain, setCurrentDomain] = useState<Domain>('professional');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPersonalUnlocked, setIsPersonalUnlocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const handleSelectDomain = (domain: Domain) => {
    if (domain === 'personal' && !isPersonalUnlocked) {
      setShowLockModal(true);
      setPendingTab('personal-overview');
      return;
    }
    setCurrentDomain(domain);
    setActiveTab(domain === 'professional' ? 'overview' : 'personal-overview');
  };

  const handleSelectTab = (tabId: string) => {
    // Check if selecting a personal tab while locked
    if (currentDomain === 'personal' && !isPersonalUnlocked) {
      setShowLockModal(true);
      setPendingTab(tabId);
      return;
    }
    setActiveTab(tabId);
  };

  const handleUnlockSuccess = () => {
    setIsPersonalUnlocked(true);
    setShowLockModal(false);
    if (pendingTab) {
      setCurrentDomain('personal');
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleTogglePersonalLock = () => {
    if (isPersonalUnlocked) {
      setIsPersonalUnlocked(false);
      if (currentDomain === 'personal') {
        setCurrentDomain('professional');
        setActiveTab('overview');
      }
    } else {
      setShowLockModal(true);
    }
  };

  return (
    <div className="flex h-screen bg-[#080D1B] text-[#F8FAFC] overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentDomain={currentDomain}
        onSelectDomain={handleSelectDomain}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        userRole={currentPersona.role}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isPersonalUnlocked={isPersonalUnlocked}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          currentPersona={currentPersona}
          onSwitchPersona={(p) => setCurrentPersona(p)}
          isPersonalUnlocked={isPersonalUnlocked}
          onTogglePersonalLock={handleTogglePersonalLock}
          onOpenCopilot={() => {
            setActiveTab(currentDomain === 'professional' ? 'pro-copilot' : 'personal-copilot');
          }}
        />

        {/* Scrollable Viewport Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Domain Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#10182A] border border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                currentDomain === 'professional' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-blue-glow' 
                  : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-cyan-glow'
              }`}>
                {currentDomain === 'professional' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#F8FAFC]">
                    {currentDomain === 'professional' 
                      ? `${currentPersona.company} — Workspace` 
                      : 'Personal Sanctuary & Portable Identity'}
                  </h2>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    currentDomain === 'professional'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                  }`}>
                    {currentDomain === 'professional' ? 'Company Context' : 'Individual Owned'}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {currentDomain === 'professional'
                    ? `Role: ${currentPersona.designation} (${currentPersona.roleLabel}) • Access governed by company RBAC`
                    : 'Lifelong individual domain. Company administrators have zero visibility into your personal records.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#94A3B8]">Active Tab:</span>
              <span className="text-xs font-semibold text-cyan-400 font-mono px-2.5 py-1 rounded-lg bg-[#080D1B] border border-[#1E293B]">
                {activeTab}
              </span>
            </div>
          </div>

          {/* Phase 2 Architecture Ready Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-colors">
              <div className="flex items-center justify-between text-[#94A3B8] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Attendance Status</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-[#F8FAFC]">Clocked In</p>
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <span>● 09:10 AM today</span>
                <span className="text-[#64748B]">• 6.8 hrs logged</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-colors">
              <div className="flex items-center justify-between text-[#94A3B8] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Net Take-Home Pay</span>
                <Wallet className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-[#F8FAFC]">₹1,46,200</p>
              <p className="text-xs text-[#94A3B8] mt-1">
                Gross ₹1,85,000 <span className="text-[10px] text-amber-400/80">(Sample data)</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-colors">
              <div className="flex items-center justify-between text-[#94A3B8] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Leave Balance</span>
                <CalendarCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-[#F8FAFC]">28 Days</p>
              <p className="text-xs text-[#94A3B8] mt-1">
                Casual: 6 • Sick: 8 • Earned: 14
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-colors">
              <div className="flex items-center justify-between text-[#94A3B8] mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">Personal Identity</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-[#F8FAFC]">{currentPersona.name}</p>
              <p className="text-xs text-cyan-400 mt-1">
                Persistent EMPRO ID • Lifetime Ownership
              </p>
            </div>
          </div>

          {/* Quick Module Capabilities Preview */}
          <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F8FAFC]">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Phase 2 Shell & Visual Tokens Active</span>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40">
                Ready for Phase 3: Employee Professional Dashboard
              </span>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              The deep-space navy/blue visual identity inspired by VISION is fully operational: Inter typography, collapsible dual-domain sidebar, Demo Mode persona switcher (Alex Rivera, Sarah Jenkins, Marcus Vance), and the transparent Demo Lock Simulation gate for personal privacy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B]">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Workplace Modules</span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Digital ID, Attendance with geotags, Salary Vault with cascade breakdowns, Leaves, Meetings.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B]">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Personal Sanctuary</span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Private Diary, 4-tier visibility Achievements, Life Timeline, Goals, and Cross-Company Community.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B]">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Cross-Role Workflows</span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Manager leave review, HR employee directory, and payroll processing views with zero personal data leakage.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Personal Domain Lock Gate Modal */}
      <PersonalLockModal
        isOpen={showLockModal}
        onClose={() => setShowLockModal(false)}
        onUnlockSuccess={handleUnlockSuccess}
      />
    </div>
  );
};
