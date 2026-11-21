import React, { useState } from 'react';
import { 
  Clock, 
  Wallet, 
  CalendarCheck, 
  Video, 
  MapPin, 
  Sparkles, 
  ArrowUpRight, 
  Download, 
  ChevronRight, 
  Send
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { Persona, LeaveBalance } from '../../types';
import { 
  MOCK_ATTENDANCE_WEEK, 
  MOCK_SALARY_DATA, 
  MOCK_LEAVE_BALANCES, 
  MOCK_MEETINGS 
} from '../../data/mockData';
import { LeaveApplyModal } from './LeaveApplyModal';
import { useTheme } from '../../context/ThemeContext';

interface EmployeeDashboardProps {
  persona: Persona;
  onNavigateTab: (tabId: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  persona,
  onNavigateTab,
}) => {
  const { isDark } = useTheme();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:10 AM');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance>(MOCK_LEAVE_BALANCES);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  const handleToggleAttendance = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
    } else {
      setIsCheckedIn(true);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckInTime(timeStr);
    }
  };

  const handleApplyLeaveSubmit = (type: 'Casual' | 'Sick' | 'Earned', days: number) => {
    setLeaveBalances(prev => ({
      ...prev,
      [type.toLowerCase()]: {
        ...prev[type.toLowerCase() as keyof typeof prev],
        available: Math.max(0, (prev[type.toLowerCase() as keyof typeof prev] as { available: number; total: number }).available - days),
      }
    }));
  };

  const handleCopilotAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;

    setIsCopilotThinking(true);
    setCopilotResponse(null);

    // Context-isolated company policy answers
    setTimeout(() => {
      const q = copilotQuery.toLowerCase();
      if (q.includes('leave') || q.includes('carry')) {
        setCopilotResponse('Nexus Technologies Leave Policy: Up to 10 days of unused Earned Leave carry forward to the next fiscal calendar. Casual and Sick leaves expire annually on Dec 31st.');
      } else if (q.includes('salary') || q.includes('pf') || q.includes('deduct')) {
        setCopilotResponse('Nexus Technologies Payroll FAQ: Employee Provident Fund (PF) is computed at 12% of Basic Pay (₹92,500), resulting in ₹11,100 monthly statutory contribution matching employer share.');
      } else if (q.includes('meeting') || q.includes('today')) {
        setCopilotResponse('You have 2 scheduled sessions today: Core Platform Sync at 02:30 PM (Google Meet) and 1-on-1 Sync with Director Sarah Jenkins at 04:00 PM.');
      } else {
        setCopilotResponse(`Nexus Policy Assistant: Your inquiry regarding "${copilotQuery}" has been checked against the employee handbook. For exceptional approvals, reach out to HR Marcus Vance.`);
      }
      setIsCopilotThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Live Clock-In Action Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10182A] via-[#111C33] to-[#10182A] border border-[#1E293B] shadow-dark-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-cyan-400 tracking-wide uppercase">
              Professional Workspace
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Friday, 21 November 2026</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Good afternoon, {persona.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-2">
            <span>{persona.designation}</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-mono">{persona.employeeId}</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-cyan-400" />
              {persona.location}
            </span>
          </p>
        </div>

        {/* Attendance Action Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#080D1B]/80 p-3 rounded-2xl border border-[#1E293B]">
          <div className="px-3">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isCheckedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-xs font-bold text-[#F8FAFC]">
                {isCheckedIn ? 'Present & Working' : 'Not Clocked In'}
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              {isCheckedIn ? `In at ${checkInTime} • Geotag: HQ-4F` : 'Shift starts 09:00 AM'}
            </p>
          </div>

          <button
            onClick={handleToggleAttendance}
            className={`py-2 px-4 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 ${
              isCheckedIn
                ? 'bg-[#151F35] hover:bg-red-950/40 text-red-400 border border-red-500/30'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-glow'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{isCheckedIn ? 'Clock Out Shift' : 'Daily Clock In'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Working Hours Card */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Hours</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[#F8FAFC]">6h 45m</p>
            <span className="text-xs text-[#94A3B8]">/ 8h 00m</span>
          </div>
          <div className="w-full bg-[#080D1B] rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full" style={{ width: '84%' }} />
          </div>
          <p className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center justify-between">
            <span>On-time streak: 14 days</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </p>
        </div>

        {/* Net Salary Card */}
        <div 
          onClick={() => onNavigateTab('salary-vault')}
          className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Take-Home</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/50 border border-blue-800/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[#F8FAFC]">₹1,46,200</p>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              Nov 2026
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2">
            Gross ₹1,85,000 <span className="text-[10px] text-amber-400/80 font-mono">(Sample)</span>
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-blue-400 font-medium">
            <span>Salary Vault Records</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>

        {/* Leave Balance Card */}
        <div 
          onClick={() => onNavigateTab('leave')}
          className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Leave Balance</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">
            {leaveBalances.casual.available + leaveBalances.sick.available + leaveBalances.earned.available} Days
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            Casual {leaveBalances.casual.available} • Sick {leaveBalances.sick.available} • Earned {leaveBalances.earned.available}
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
            <span onClick={(e) => { e.stopPropagation(); setShowLeaveModal(true); }} className="hover:underline">
              + Apply Leave
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>

        {/* Next Scheduled Meeting Card */}
        <div 
          onClick={() => onNavigateTab('meetings')}
          className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Next Sync</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/50 border border-blue-800/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-[#F8FAFC] truncate">Core Platform Sync</p>
          <p className="text-xs text-cyan-400 font-medium mt-1">
            02:30 PM Today <span className="text-[10px] text-slate-500">(in 45m)</span>
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>4 attendees</span>
            <span className="text-emerald-400 font-medium">Google Meet</span>
          </div>
        </div>
      </div>

      {/* 3. Visual Analytics Split (Row 2): Attendance Rechart & Salary Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Attendance Graph (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Weekly Attendance & Work Hours</h3>
              <p className="text-xs text-[#94A3B8]">Target: 8.0 hours/day (40 hours standard shift)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-[#94A3B8]">Logged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-400" />
                <span className="text-[#94A3B8]">Target</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ATTENDANCE_WEEK} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} vertical={false} />
                <XAxis dataKey="day" stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} tickLine={false} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: isDark ? '#10182A' : '#FFFFFF', 
                    borderColor: isDark ? '#1E293B' : '#CBD5E1', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }}
                  cursor={{ fill: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)' }}
                  formatter={(value: any) => [`${value} hrs`, 'Duration']}
                />
                <Bar dataKey="hoursWorked" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Logged Hours" />
                <Bar dataKey="expectedHours" fill="#06B6D4" radius={[6, 6, 0, 0]} opacity={isDark ? 0.3 : 0.45} name="Target Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#94A3B8] border-t border-[#1E293B]">
            <span>Weekly Average: <strong className="text-[#F8FAFC]">7.78 hrs/day</strong></span>
            <span className="text-emerald-400 font-medium">97.2% Attendance Compliance</span>
          </div>
        </div>

        {/* Salary Breakdown & Cascade (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC]">Compensation Breakdown</h3>
                <p className="text-xs text-[#94A3B8]">Effective Nov 2026 Payroll Cycle</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Sample Data
              </span>
            </div>

            {/* Cascade Line items */}
            <div className="space-y-2.5 pt-4 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#94A3B8]">Basic Pay (50%)</span>
                <span className="font-mono font-semibold text-[#F8FAFC]">₹{MOCK_SALARY_DATA.basicPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#94A3B8]">House Rent Allowance (HRA)</span>
                <span className="font-mono font-semibold text-[#F8FAFC]">₹{MOCK_SALARY_DATA.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#94A3B8]">Special Allowance</span>
                <span className="font-mono font-semibold text-[#F8FAFC]">₹{MOCK_SALARY_DATA.specialAllowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 text-red-400">
                <span>Provident Fund (Statutory PF 12%)</span>
                <span className="font-mono font-semibold">-₹{MOCK_SALARY_DATA.providentFund.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 text-red-400">
                <span>Income Tax (TDS Estimate)</span>
                <span className="font-mono font-semibold">-₹{MOCK_SALARY_DATA.incomeTaxTds.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-[#F8FAFC]">Monthly Net Take-Home</span>
              <span className="text-cyan-400 font-mono text-base">₹{MOCK_SALARY_DATA.netSalary.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 border-t border-[#1E293B]/60">
              <span>Payout Date: 30 Nov 2026</span>
              <button 
                onClick={() => onNavigateTab('salary-vault')}
                className="text-blue-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Download Sample Payslip</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Meetings, Actions & Professional Copilot (Row 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule & Meetings (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Today's Meetings & Agendas</h3>
              <p className="text-xs text-[#94A3B8]">Connected to corporate workspace calendar</p>
            </div>
            <button
              onClick={() => onNavigateTab('meetings')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_MEETINGS.slice(0, 2).map((meeting) => (
              <div 
                key={meeting.id}
                className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
                      {meeting.type}
                    </span>
                    <span className="text-xs font-semibold text-[#F8FAFC]">{meeting.title}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{meeting.time} ({meeting.duration})</span>
                    <span>•</span>
                    <span>{meeting.participants.join(', ')}</span>
                  </p>
                  {meeting.summary && (
                    <p className="text-[11px] text-slate-400 mt-1 italic">
                      "{meeting.summary}"
                    </p>
                  )}
                </div>

                {meeting.isOnline && meeting.meetingLink && (
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/40 text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meet</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Professional Copilot Assistant Card (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#10182A] via-[#121E36] to-[#10182A] border border-blue-500/30 shadow-blue-glow space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F8FAFC]">Professional Copilot</h3>
                  <p className="text-[11px] text-cyan-400">Strictly isolated to corporate policies & records</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                0 Personal Leakage
              </span>
            </div>

            {/* Response area */}
            <div className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B] min-h-[90px] flex items-center text-xs leading-relaxed">
              {isCopilotThinking ? (
                <div className="flex items-center gap-2 text-cyan-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Searching corporate handbook and authorized payroll records...</span>
                </div>
              ) : copilotResponse ? (
                <p className="text-[#F8FAFC]">{copilotResponse}</p>
              ) : (
                <p className="text-[#94A3B8]">
                  Ask questions about leave policies, salary deductions, meeting summaries, or compliance rules.
                </p>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'Explain my PF deduction',
                'Carry forward leave rules',
                'Next meeting agenda'
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setCopilotQuery(prompt);
                  }}
                  className="text-[10px] py-1 px-2.5 rounded-lg bg-[#151F35] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#19253F] border border-[#1E293B] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleCopilotAsk} className="relative mt-2">
            <input
              type="text"
              value={copilotQuery}
              onChange={(e) => setCopilotQuery(e.target.value)}
              placeholder="Ask workplace policy assistant..."
              className="w-full bg-[#080D1B] border border-[#1E293B] focus:border-cyan-500 rounded-xl py-2.5 pl-3 pr-10 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isCopilotThinking || !copilotQuery.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Leave Application Modal */}
      <LeaveApplyModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        leaveBalances={leaveBalances}
        onSubmitLeave={handleApplyLeaveSubmit}
      />
    </div>
  );
};
