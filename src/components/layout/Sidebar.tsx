import React from 'react';
import { 
  Building2, 
  User, 
  LayoutDashboard, 
  Clock, 
  Wallet, 
  Video, 
  Sparkles, 
  Award, 
  Users, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Briefcase,
  BrainCircuit,
  X
} from 'lucide-react';
import { Domain, Role } from '../../types';

interface SidebarProps {
  currentDomain: Domain;
  onSelectDomain: (domain: Domain) => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  userRole: Role;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isPersonalUnlocked: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentDomain,
  onSelectDomain,
  activeTab,
  onSelectTab,
  userRole,
  isCollapsed,
  onToggleCollapse,
  isPersonalUnlocked,
  isMobileOpen,
  onCloseMobile,
}) => {
  const companyTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar, badge: '4 active' },
    { id: 'projects', label: 'Projects', icon: Briefcase, badge: 'AI Match' },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'salary-vault', label: 'Salary & Vault', icon: Wallet },
    { id: 'meetings', label: 'Meetings', icon: Video, badge: '2 today' },
    { id: 'pro-copilot', label: 'Company Copilot', icon: Sparkles },
    ...(userRole === 'manager' ? [
      { id: 'manager-team', label: 'Team Attendance', icon: Users, roleRequired: 'manager' }
    ] : []),
    ...(userRole === 'hr' ? [
      { id: 'hr-directory', label: 'Workforce Directory', icon: Users, roleRequired: 'hr' },
      { id: 'hr-payroll', label: 'Payroll Processing', icon: Wallet, roleRequired: 'hr' }
    ] : []),
  ];

  const lifeTabs = [
    { id: 'personal-overview', label: 'Life Overview', icon: LayoutDashboard },
    { id: 'decision-simulator', label: 'Decision Simulator', icon: BrainCircuit, badge: 'AI Studio' },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'community', label: 'Community Hub', icon: Users },
    { id: 'my-profile', label: 'My Profile', icon: User },
    { id: 'personal-copilot', label: 'Life Copilot', icon: Sparkles },
    { id: 'privacy', label: 'Privacy & Sharing', icon: Shield },
  ];

  const currentTabs = currentDomain === 'professional' ? companyTabs : lifeTabs;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden animate-fade-in"
        />
      )}

      <aside
        className={`h-screen bg-[#080D1B] border-r border-[#1E293B] flex flex-col justify-between transition-all duration-300 z-40 shrink-0 ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-64 shadow-2xl translate-x-0'
            : 'hidden md:flex md:sticky md:top-0'
        } ${isCollapsed && !isMobileOpen ? 'md:w-20' : 'md:w-64'}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E293B] shrink-0">
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-blue-glow">
                  <span className="font-extrabold text-white text-base tracking-wider">E</span>
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-[#F8FAFC]">EMPRO</span>
                  <span className="block text-[9px] font-semibold text-cyan-400 uppercase tracking-widest">
                    Enterprise • Life
                  </span>
                </div>
              </div>
            )}
            {isCollapsed && !isMobileOpen && (
              <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-blue-glow">
                <span className="font-extrabold text-white text-base">E</span>
              </div>
            )}
            
            {/* Collapse toggle (Desktop) */}
            <button
              onClick={onToggleCollapse}
              className={`p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F35] transition-colors hidden md:block ${
                isCollapsed ? 'hidden' : 'block'
              }`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Close button (Mobile) */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F35] transition-colors md:hidden"
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dual-Domain Toggle Pill */}
          <div className="p-3 border-b border-[#1E293B] shrink-0">
            {!isCollapsed || isMobileOpen ? (
              <div className="p-1 rounded-xl bg-[#10182A] border border-[#1E293B] grid grid-cols-2 gap-1">
                <button
                  onClick={() => onSelectDomain('professional')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    currentDomain === 'professional'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-glow'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F35]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Company</span>
                </button>
                <button
                  onClick={() => onSelectDomain('personal')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    currentDomain === 'personal'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-glow'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F35]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Life</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 items-center">
                <button
                  onClick={() => onSelectDomain('professional')}
                  className={`p-2 rounded-xl transition-all ${
                    currentDomain === 'professional'
                      ? 'bg-blue-600 text-white shadow-blue-glow'
                      : 'text-[#94A3B8] hover:bg-[#151F35]'
                  }`}
                  title="Switch to Company Domain"
                >
                  <Building2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectDomain('personal')}
                  className={`p-2 rounded-xl transition-all ${
                    currentDomain === 'personal'
                      ? 'bg-cyan-600 text-white shadow-cyan-glow'
                      : 'text-[#94A3B8] hover:bg-[#151F35]'
                  }`}
                  title="Switch to Life Domain"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Item List */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            <div className="px-2 pb-1.5">
              {(!isCollapsed || isMobileOpen) && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
                  {currentDomain === 'professional' ? 'Company Workspace' : 'Life Domain'}
                </span>
              )}
            </div>

            {currentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onSelectTab(tab.id);
                    if (isMobileOpen) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#151F35] text-[#F8FAFC] border border-blue-500/30 shadow-dark-sm font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#10182A]'
                  }`}
                  title={isCollapsed && !isMobileOpen ? tab.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-[#94A3B8] group-hover:text-blue-400'
                      }`}
                    />
                    {(!isCollapsed || isMobileOpen) && <span>{tab.label}</span>}
                  </div>

                  {(!isCollapsed || isMobileOpen) && currentDomain === 'personal' && !isPersonalUnlocked && (
                    <span className="text-[10px] text-amber-400/80">🔒</span>
                  )}
                  {(!isCollapsed || isMobileOpen) && tab.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#10182A] text-cyan-400 border border-cyan-800/40">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Expand Toggle (When Collapsed) */}
          {isCollapsed && !isMobileOpen && (
            <div className="p-3 border-t border-[#1E293B] flex justify-center">
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F35] transition-colors"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
