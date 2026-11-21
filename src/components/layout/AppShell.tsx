import React, { useState } from 'react';
import { Domain } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { PersonalLockModal } from '../auth/PersonalLockModal';
import { AuthModal } from '../auth/AuthModal';
import { EmployeeDashboard } from '../professional/EmployeeDashboard';
import { PersonalDashboard } from '../personal/PersonalDashboard';
import { ManagerDashboard } from '../manager/ManagerDashboard';
import { HRDashboard } from '../hr/HRDashboard';
import { EventsModule } from '../modules/EventsModule';
import { ProjectsModule } from '../modules/ProjectsModule';
import { SalaryVaultModule } from '../modules/SalaryVaultModule';
import { AttendanceModule } from '../modules/AttendanceModule';
import { MeetingsModule } from '../modules/MeetingsModule';
import { DecisionSimulatorModule } from '../modules/DecisionSimulatorModule';
import { AchievementsModule } from '../modules/AchievementsModule';
import { CommunityModule } from '../modules/CommunityModule';
import { CopilotModule } from '../modules/CopilotModule';
import { Sparkles } from 'lucide-react';

export const AppShell: React.FC = () => {
  const { currentPersona, switchPersona, isLiveAuth, openAuthModal } = useAuth();
  const [currentDomain, setCurrentDomain] = useState<Domain>('professional');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          currentPersona={currentPersona}
          onSwitchPersona={(p) => switchPersona(p)}
          isPersonalUnlocked={isPersonalUnlocked}
          onTogglePersonalLock={handleTogglePersonalLock}
          onOpenCopilot={() => {
            setActiveTab(currentDomain === 'professional' ? 'pro-copilot' : 'personal-copilot');
          }}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenAuthModal={openAuthModal}
          isLiveAuth={isLiveAuth}
        />

        {/* Scrollable Viewport Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {currentDomain === 'professional' ? (
            currentPersona.role === 'manager' && (activeTab === 'overview' || activeTab.startsWith('manager-')) ? (
              <ManagerDashboard
                persona={currentPersona}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            ) : currentPersona.role === 'hr' && (activeTab === 'overview' || activeTab.startsWith('hr-')) ? (
              <HRDashboard
                persona={currentPersona}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            ) : activeTab === 'overview' ? (
              <EmployeeDashboard
                persona={currentPersona}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            ) : activeTab === 'events' ? (
              <EventsModule currentUserId={currentPersona.id} userRole={currentPersona.role} />
            ) : activeTab === 'projects' ? (
              <ProjectsModule currentUserId={currentPersona.id} userRole={currentPersona.role} />
            ) : activeTab === 'salary-vault' ? (
              <SalaryVaultModule />
            ) : activeTab === 'attendance' ? (
              <AttendanceModule />
            ) : activeTab === 'meetings' ? (
              <MeetingsModule />
            ) : activeTab === 'pro-copilot' ? (
              <CopilotModule currentDomain="professional" />
            ) : (
              /* Company Module Placeholder */
              <div className="p-8 rounded-2xl bg-[#10182A] border border-[#1E293B] text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#151F35] border border-blue-500/30 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F8FAFC] capitalize">
                    {activeTab.replace('-', ' ')}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 max-w-md mx-auto">
                    Corporate collaboration module with company RBAC authorization and audit boundaries.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="py-2 px-4 rounded-xl bg-[#151F35] hover:bg-[#19253F] text-xs font-medium text-cyan-300 border border-[#1E293B] transition-colors"
                  >
                    Return to Company Overview
                  </button>
                </div>
              </div>
            )
          ) : activeTab === 'decision-simulator' ? (
            <DecisionSimulatorModule />
          ) : activeTab === 'personal-overview' || activeTab === 'my-profile' || activeTab === 'privacy' ? (
            <PersonalDashboard
              persona={currentPersona}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          ) : activeTab === 'achievements' ? (
            <AchievementsModule />
          ) : activeTab === 'community' ? (
            <CommunityModule />
          ) : activeTab === 'personal-copilot' ? (
            <CopilotModule currentDomain="personal" />
          ) : (
            /* Personal Module Placeholder */
            <div className="p-8 rounded-2xl bg-[#10182A] border border-[#1E293B] text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#151F35] border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F8FAFC] capitalize">
                  {activeTab.replace('-', ' ')}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 max-w-md mx-auto">
                  Private personal space protected from employer access with client-side verification.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('personal-overview')}
                  className="py-2 px-4 rounded-xl bg-[#151F35] hover:bg-[#19253F] text-xs font-medium text-cyan-300 border border-[#1E293B] transition-colors"
                >
                  Return to Personal Overview
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Personal Domain Lock Gate Modal */}
      <PersonalLockModal
        isOpen={showLockModal}
        onClose={() => setShowLockModal(false)}
        onUnlockSuccess={handleUnlockSuccess}
      />

      {/* Supabase Authentication & Session Modal */}
      <AuthModal />
    </div>
  );
};
