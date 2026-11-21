import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Video, 
  ShieldCheck, 
  Calendar
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
import { Persona, LeaveRequest } from '../../types';
import { MOCK_LEAVE_REQUESTS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

interface ManagerDashboardProps {
  persona: Persona;
  onNavigateTab: (tabId: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  persona,
  onNavigateTab: _onNavigateTab,
}) => {
  const { isDark } = useTheme();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const teamAttendanceData = [
    { day: 'Mon', present: 8, late: 0, onLeave: 0 },
    { day: 'Tue', present: 7, late: 1, onLeave: 0 },
    { day: 'Wed', present: 6, late: 1, onLeave: 1 },
    { day: 'Thu', present: 7, late: 1, onLeave: 0 },
    { day: 'Fri', present: 6, late: 1, onLeave: 1 },
  ];

  const teamMembers = [
    { id: 'NX-4092', name: 'Alex Rivera', role: 'Lead Frontend Engineer', status: 'Present', checkIn: '09:10 AM', location: 'HQ - 4F' },
    { id: 'NX-4105', name: 'Elena Rostova', role: 'Senior Systems Architect', status: 'Present', checkIn: '08:50 AM', location: 'HQ - 4F' },
    { id: 'NX-4120', name: 'David Kim', role: 'Staff Backend Engineer', status: 'Remote', checkIn: '09:25 AM', location: 'Remote / Home' },
    { id: 'NX-4188', name: 'Priya Patel', role: 'UI/UX Design Lead', status: 'On Leave', checkIn: '--:--', location: 'Casual Leave' },
    { id: 'NX-4201', name: 'Marcus Cole', role: 'DevOps / SRE Engineer', status: 'Present', checkIn: '09:00 AM', location: 'HQ - Server Room' },
    { id: 'NX-4215', name: 'Chloe Bennett', role: 'Frontend Engineer', status: 'Present', checkIn: '09:15 AM', location: 'HQ - 4F' },
    { id: 'NX-4230', name: 'Daniel Wu', role: 'Full Stack Engineer', status: 'Present', checkIn: '09:05 AM', location: 'HQ - 4F' },
    { id: 'NX-4255', name: 'Samira Khan', role: 'QA Automation Lead', status: 'Present', checkIn: '09:12 AM', location: 'HQ - 4F' },
  ];

  const handleLeaveAction = (id: string, action: 'Approved' | 'Rejected') => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: action, approver: persona.name };
      }
      return req;
    }));

    setFeedbackNotice(`Request ${action} for ${leaveRequests.find(r => r.id === id)?.employeeName}`);
    setTimeout(() => setFeedbackNotice(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Scope Restriction Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10182A] via-[#111E36] to-[#10182A] border border-[#1E293B] shadow-dark-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">
              Management & Approvals Console
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Engineering & Platform Division</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            Director {persona.name.split(' ')[0]}'s Workspace
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-2">
            <span>{persona.designation}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-mono">Scope: Core Platform Team (8 Engineers)</span>
          </p>
        </div>

        {/* Manager Privacy Boundary Tag */}
        <div className="p-3.5 rounded-xl bg-[#080D1B] border border-blue-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#F8FAFC]">
              <span>Restricted Manager Scope</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-0.5 max-w-xs">
              Zero access to team members' personal diaries, private goals, or personal copilots.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedbackNotice}
          </span>
          <span className="text-[10px] text-emerald-400/80">Audit Log Recorded</span>
        </div>
      )}

      {/* 2. Team Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Team Roster</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">8 Engineers</p>
          <p className="text-[11px] text-cyan-400 font-medium mt-1">
            Core Platform & Systems
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Team Attendance</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">6 Present</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            1 Remote • 1 Approved Leave
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Leave Requests</span>
            <CalendarCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">
            {leaveRequests.filter(r => r.status === 'Pending').length} Pending
          </p>
          <p className="text-[11px] text-amber-400 mt-1">
            Requires Manager Action
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Upcoming 1-on-1s</span>
            <Video className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">2 Today</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            Alex Rivera (04:00 PM) • Elena (05:00 PM)
          </p>
        </div>
      </div>

      {/* 3. Leave Approvals & Team Punctuality Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Approvals Panel (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Pending Leave Approvals</h3>
              <p className="text-xs text-[#94A3B8]">Review team absence requests against shift coverage</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
              {leaveRequests.filter(r => r.status === 'Pending').length} Action Required
            </span>
          </div>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div 
                key={req.id}
                className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F8FAFC]">{req.employeeName}</span>
                      <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/40">
                        {req.employeeId}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                        {req.type} Leave ({req.days} days)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{req.startDate} to {req.endDate}</span>
                      <span>•</span>
                      <span>Reason: "{req.reason}"</span>
                    </p>
                  </div>

                  {/* Status Badge or Action Buttons */}
                  <div className="shrink-0">
                    {req.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLeaveAction(req.id, 'Approved')}
                          className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1 transition-colors shadow-dark-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleLeaveAction(req.id, 'Rejected')}
                          className="py-1.5 px-3 rounded-lg bg-[#151F35] hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-red-500/30 font-medium text-xs flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                        req.status === 'Approved' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                          : 'bg-red-950 text-red-400 border border-red-800/40'
                      }`}>
                        {req.status} by {req.approver}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Team Attendance Trends Chart (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Team Attendance Trends</h3>
              <p className="text-xs text-[#94A3B8]">Present vs Remote vs On-Leave (Week 47)</p>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} vertical={false} />
                <XAxis dataKey="day" stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} tickLine={false} domain={[0, 8]} />
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
                />
                <Bar dataKey="present" fill="#3B82F6" radius={[4, 4, 0, 0]} name="In-Office" stackId="a" />
                <Bar dataKey="late" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Remote/Late" stackId="a" />
                <Bar dataKey="onLeave" fill="#EF4444" radius={[4, 4, 0, 0]} name="On Leave" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#94A3B8] border-t border-[#1E293B]">
            <span>Average On-Time Rate: <strong className="text-emerald-400">94.8%</strong></span>
            <span className="text-blue-400 font-medium">Coverage: Full</span>
          </div>
        </div>
      </div>

      {/* 4. Live Team Availability Roster Table */}
      <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Direct Reports Live Roster</h3>
            <p className="text-xs text-[#94A3B8]">Authorized reporting scope for Director Sarah Jenkins</p>
          </div>
          <span className="text-xs text-[#94A3B8] font-mono">8 of 8 Accounted For</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#94A3B8] border-b border-[#1E293B] pb-2">
                <th className="py-2.5 font-semibold">Engineer</th>
                <th className="py-2.5 font-semibold">Designation</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Check-In</th>
                <th className="py-2.5 font-semibold">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {teamMembers.map((m) => (
                <tr key={m.id} className="hover:bg-[#151F35]/50 transition-colors">
                  <td className="py-3 font-semibold text-[#F8FAFC] flex items-center gap-2">
                    <span>{m.name}</span>
                    <span className="text-[10px] font-mono text-[#64748B]">{m.id}</span>
                  </td>
                  <td className="py-3 text-[#94A3B8]">{m.role}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      m.status === 'Present' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : m.status === 'Remote'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                        : 'bg-red-950 text-red-400 border border-red-800/40'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[#F8FAFC]">{m.checkIn}</td>
                  <td className="py-3 text-[#94A3B8]">{m.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
