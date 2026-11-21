import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { LeaveBalance, LeaveRequest } from '../../types';
import { MOCK_LEAVE_BALANCES, MOCK_LEAVE_REQUESTS } from '../../data/mockData';
import { LeaveApplyModal } from '../professional/LeaveApplyModal';

export const LeaveModule: React.FC = () => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance>(MOCK_LEAVE_BALANCES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const companyHolidays2026 = [
    { name: 'Diwali (Festival of Lights)', date: '08 Nov 2026', day: 'Sunday', type: 'Mandatory' },
    { name: 'Guru Nanak Jayanti', date: '24 Nov 2026', day: 'Tuesday', type: 'Mandatory' },
    { name: 'Christmas Day', date: '25 Dec 2026', day: 'Friday', type: 'Mandatory' },
    { name: 'New Year Day', date: '01 Jan 2027', day: 'Friday', type: 'Mandatory' },
  ];

  const handleApplyLeaveSubmit = (type: 'Casual' | 'Sick' | 'Earned', days: number, reason: string) => {
    const newReq: LeaveRequest = {
      id: `lv_${Date.now()}`,
      employeeName: 'Alex Rivera',
      employeeId: 'NX-4092',
      type,
      startDate: '28 Nov 2026',
      endDate: '29 Nov 2026',
      days,
      reason,
      status: 'Pending',
      appliedDate: '21 Nov 2026',
    };

    setLeaveRequests([newReq, ...leaveRequests]);
    setLeaveBalances(prev => ({
      ...prev,
      [type.toLowerCase()]: {
        ...prev[type.toLowerCase() as keyof typeof prev],
        available: Math.max(0, (prev[type.toLowerCase() as keyof typeof prev] as { available: number; total: number }).available - days),
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Paid Time Off & Absence Ledger
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Company Leave Policy 2026</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Leave Management</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Check leave quotas, review carry-forward entitlements, and submit time-off requests.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs shadow-blue-glow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Casual Leave (CL)</span>
          <p className="text-2xl font-bold text-[#F8FAFC] mt-2">{leaveBalances.casual.available} Days</p>
          <p className="text-xs text-[#94A3B8] mt-1">Available out of {leaveBalances.casual.total} allocated</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Sick Leave (SL)</span>
          <p className="text-2xl font-bold text-cyan-400 mt-2">{leaveBalances.sick.available} Days</p>
          <p className="text-xs text-[#94A3B8] mt-1">Paid sick leave (out of {leaveBalances.sick.total})</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Earned Leave (EL)</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{leaveBalances.earned.available} Days</p>
          <p className="text-xs text-[#94A3B8] mt-1">Up to 10 days carry forward</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Unpaid Leave (LWP)</span>
          <p className="text-2xl font-bold text-slate-400 mt-2">{leaveBalances.unpaid.taken} Days</p>
          <p className="text-xs text-[#94A3B8] mt-1">No salary deductions taken</p>
        </div>
      </div>

      {/* Leave History Ledger */}
      <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Leave Application History</h3>
            <p className="text-xs text-[#94A3B8]">Audit trail of approved and pending requests</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">{leaveRequests.length} Applications</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#94A3B8] border-b border-[#1E293B] pb-2">
                <th className="py-2.5 font-semibold">Type</th>
                <th className="py-2.5 font-semibold">Period</th>
                <th className="py-2.5 font-semibold">Days</th>
                <th className="py-2.5 font-semibold">Reason</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-[#151F35]/50 transition-colors">
                  <td className="py-3 font-semibold text-[#F8FAFC]">{req.type}</td>
                  <td className="py-3 font-mono text-[#94A3B8]">{req.startDate} - {req.endDate}</td>
                  <td className="py-3 font-bold text-[#F8FAFC]">{req.days}d</td>
                  <td className="py-3 text-[#94A3B8] max-w-xs truncate">{req.reason}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      req.status === 'Approved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : req.status === 'Pending'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                        : 'bg-red-950 text-red-400 border border-red-800/40'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 text-[#64748B]">{req.approver || 'Pending Review'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2026 Corporate Holidays */}
      <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
        <h3 className="text-sm font-bold text-[#F8FAFC]">Upcoming Company Holidays (Q4 2026 - Q1 2027)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {companyHolidays2026.map((h) => (
            <div key={h.name} className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-1">
              <span className="text-[10px] font-semibold text-cyan-400 block">{h.date} ({h.day})</span>
              <p className="text-xs font-bold text-[#F8FAFC]">{h.name}</p>
              <span className="text-[10px] text-slate-500 block">{h.type} Company Holiday</span>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Leave Modal */}
      <LeaveApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        leaveBalances={leaveBalances}
        onSubmitLeave={handleApplyLeaveSubmit}
      />
    </div>
  );
};
