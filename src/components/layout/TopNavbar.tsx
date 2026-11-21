import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Lock, 
  Unlock, 
  Building2, 
  ChevronDown, 
  Sparkles,
  Check
} from 'lucide-react';
import { Persona, Role } from '../../types';
import { DEMO_PERSONAS } from '../../data/mockData';

interface TopNavbarProps {
  currentPersona: Persona;
  onSwitchPersona: (persona: Persona) => void;
  isPersonalUnlocked: boolean;
  onTogglePersonalLock: () => void;
  onOpenCopilot: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentPersona,
  onSwitchPersona,
  isPersonalUnlocked,
  onTogglePersonalLock,
  onOpenCopilot,
}) => {
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const notifications = [
    { id: 1, title: 'Salary Slip Nov 2026 Ready', time: '10m ago', unread: true },
    { id: 2, title: 'Leave Request Approved by Sarah', time: '1h ago', unread: true },
    { id: 3, title: 'Architecture Sync in 45 mins', time: '3h ago', unread: false },
  ];

  return (
    <header className="h-16 bg-[#080D1B]/90 backdrop-blur-md border-b border-[#1E293B] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Search Bar & Context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records, policies, notes, meetings (Ctrl + K)..."
            className="w-full bg-[#10182A] text-xs text-[#F8FAFC] placeholder-[#64748B] pl-9 pr-4 py-2 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Company Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10182A] border border-[#1E293B] text-xs">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[#F8FAFC] font-medium">{currentPersona.company}</span>
          <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
            {currentPersona.employeeId}
          </span>
        </div>

        {/* Copilot Quick Launch */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-900/40 to-cyan-900/30 border border-blue-500/30 text-cyan-300 hover:text-white text-xs font-medium hover:border-cyan-400/60 transition-all shadow-blue-glow"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">EMPRO Copilot</span>
        </button>

        {/* Personal Sanctuary Lock/Unlock Status */}
        <button
          onClick={onTogglePersonalLock}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            isPersonalUnlocked
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/30'
              : 'bg-[#10182A] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
          title={isPersonalUnlocked ? 'Personal Domain Unlocked' : 'Personal Domain Locked (Click to Unlock)'}
        >
          {isPersonalUnlocked ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Personal: Active</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Personal: Locked</span>
            </>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
            className="p-2 rounded-xl bg-[#10182A] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-[#080D1B]" />
          </button>

          {showNotificationDrawer && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#10182A] border border-[#1E293B] shadow-2xl p-4 z-40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                <h4 className="text-xs font-semibold text-[#F8FAFC]">Workplace Notifications</h4>
                <span className="text-[10px] text-cyan-400 font-medium">2 unread</span>
              </div>
              <div className="space-y-2">
                {notifications.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-[#080D1B] border border-[#1E293B]/60 text-xs">
                    <p className="text-[#F8FAFC] font-medium">{item.title}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Persona Switcher (Explicitly Labelled Demo Mode) */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#10182A] hover:bg-[#151F35] border border-[#1E293B] transition-colors"
          >
            <img
              src={currentPersona.avatar}
              alt={currentPersona.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/40"
            />
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#F8FAFC]">{currentPersona.name}</span>
                <span className="text-[9px] uppercase tracking-wider font-bold px-1 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
                  {currentPersona.role}
                </span>
              </div>
              <p className="text-[10px] text-[#94A3B8] leading-none">{currentPersona.designation}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {showPersonaDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#10182A] border border-[#1E293B] shadow-2xl p-3 z-40 space-y-2">
              <div className="px-2 py-1 border-b border-[#1E293B]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <span>⚡ Demo Mode Persona Switcher</span>
                </span>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  Select an authenticated demo persona:
                </p>
              </div>

              <div className="space-y-1">
                {(Object.keys(DEMO_PERSONAS) as Role[]).map((r) => {
                  const p = DEMO_PERSONAS[r];
                  const isSelected = p.id === currentPersona.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSwitchPersona(p);
                        setShowPersonaDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                        isSelected ? 'bg-blue-950/60 border border-blue-500/40' : 'hover:bg-[#151F35]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-[#F8FAFC]">{p.name}</p>
                          <p className="text-[10px] text-[#94A3B8]">{p.roleLabel}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
