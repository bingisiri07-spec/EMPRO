import React, { useState } from 'react';
import { X, Calendar, CheckCircle2 } from 'lucide-react';
import { LeaveBalance } from '../../types';

interface LeaveApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveBalances: LeaveBalance;
  onSubmitLeave: (type: 'Casual' | 'Sick' | 'Earned', days: number, reason: string) => void;
}

export const LeaveApplyModal: React.FC<LeaveApplyModalProps> = ({
  isOpen,
  onClose,
  leaveBalances,
  onSubmitLeave,
}) => {
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Earned'>('Casual');
  const [startDate, setStartDate] = useState('2026-11-28');
  const [endDate, setEndDate] = useState('2026-11-29');
  const [reason, setReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitLeave(leaveType, 2, reason || 'Personal / Travel request');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const getAvailableDays = () => {
    switch (leaveType) {
      case 'Casual': return leaveBalances.casual.available;
      case 'Sick': return leaveBalances.sick.available;
      case 'Earned': return leaveBalances.earned.available;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#10182A] border border-[#1E293B] rounded-2xl p-6 shadow-2xl shadow-blue-950/40 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg hover:bg-[#151F35] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-blue-glow">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Apply for Workplace Leave</h3>
            <p className="text-xs text-[#94A3B8]">Request time-off subject to manager approval</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="text-sm font-bold text-[#F8FAFC]">Leave Request Submitted</h4>
            <p className="text-xs text-[#94A3B8]">Forwarded to Director Sarah Jenkins for approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Leave Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Casual', 'Sick', 'Earned'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLeaveType(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      leaveType === type
                        ? 'bg-blue-600/20 border-blue-500 text-cyan-300'
                        : 'bg-[#080D1B] border-[#1E293B] text-[#94A3B8] hover:bg-[#151F35]'
                    }`}
                  >
                    {type} ({type === 'Casual' ? leaveBalances.casual.available : type === 'Sick' ? leaveBalances.sick.available : leaveBalances.earned.available}d left)
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Reason for Absence</label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief note for your manager and HR..."
                className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Remaining balance after request:</span>
              <span className="font-mono font-bold text-cyan-400">
                {Math.max(0, getAvailableDays() - 2)} Days
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#151F35] hover:bg-[#19253F] text-[#94A3B8] font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs shadow-blue-glow transition-all"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
