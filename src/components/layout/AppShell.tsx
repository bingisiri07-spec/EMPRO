import React, { useState } from 'react';
import { Domain, Persona } from '../../types';
import { DEMO_PERSONAS } from '../../data/mockData';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { PersonalLockModal } from '../auth/PersonalLockModal';
import { EmployeeDashboard } from '../professional/EmployeeDashboard';
import { 
  Building2, 
  User, 
  Sparkles 
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
          {currentDomain === 'professional' && activeTab === 'overview' ? (
            <EmployeeDashboard
              persona={currentPersona}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          ) : (
            <>
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
                  <span className="text-xs text-[#94A3B8]">Active Module:</span>
                  <span className="text-xs font-semibold text-cyan-400 font-mono px-2.5 py-1 rounded-lg bg-[#080D1B] border border-[#1E293B]">
                    {activeTab}
                  </span>
                </div>
              </div>

              {/* Module View Placeholder Container */}
              <div className="p-8 rounded-2xl bg-[#10182A] border border-[#1E293B] text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#151F35] border border-blue-500/30 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F8FAFC] capitalize">
                    {activeTab.replace('-', ' ')}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 max-w-md mx-auto">
                    {currentDomain === 'professional'
                      ? 'Corporate workforce module with strict company RBAC authorization and audit boundaries.'
                      : 'Private personal space protected from employer access with client-side verification.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (currentDomain === 'professional') {
                        setActiveTab('overview');
                      } else {
                        setActiveTab('personal-overview');
                      }
                    }}
                    className="py-2 px-4 rounded-xl bg-[#151F35] hover:bg-[#19253F] text-xs font-medium text-cyan-300 border border-[#1E293B] transition-colors"
                  >
                    Return to {currentDomain === 'professional' ? 'Professional' : 'Personal'} Overview
                  </button>
                </div>
              </div>
            </>
          )}
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
