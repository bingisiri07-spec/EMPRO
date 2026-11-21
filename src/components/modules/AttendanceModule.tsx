import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle2 
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
import { AttendanceRecord } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { useTheme } from '../../context/ThemeContext';

export const AttendanceModule: React.FC = () => {
  const { isDark } = useTheme();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:10 AM');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  useEffect(() => {
    attendanceService.getAttendanceHistory().then((data) => {
      setAttendanceData(data);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  // November 2026 calendar days simulation
  const calendarDays = [
    { day: 1, status: 'Holiday' }, { day: 2, status: 'Weekend' }, { day: 3, status: 'Present' },
    { day: 4, status: 'Present' }, { day: 5, status: 'Present' }, { day: 6, status: 'Present' },
    { day: 7, status: 'Present' }, { day: 8, status: 'Weekend' }, { day: 9, status: 'Weekend' },
    { day: 10, status: 'Present' }, { day: 11, status: 'Present' }, { day: 12, status: 'Present' },
    { day: 13, status: 'Present' }, { day: 14, status: 'Late' }, { day: 15, status: 'Weekend' },
    { day: 16, status: 'Weekend' }, { day: 17, status: 'Present' }, { day: 18, status: 'Present' },
    { day: 19, status: 'Late' }, { day: 20, status: 'Present' }, { day: 21, status: 'Present', isToday: true },
    { day: 22, status: 'Weekend' }, { day: 23, status: 'Weekend' }, { day: 24, status: 'Upcoming' },
    { day: 25, status: 'Upcoming' }, { day: 26, status: 'Upcoming' }, { day: 27, status: 'Upcoming' },
    { day: 28, status: 'Leave' }, { day: 29, status: 'Leave' }, { day: 30, status: 'Upcoming' }
  ];

  const handleToggleAttendance = async () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
    } else {
      setIsCheckedIn(true);
      const now = new Date();
      setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      await attendanceService.checkIn('org_default', 'member_current', 'Office HQ (Verified)');
    }
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrectionSuccess(true);
    setTimeout(() => {
      setCorrectionSuccess(false);
      setShowCorrectionModal(false);
      setCorrectionReason('');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Shift & Timesheet Management
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Biometric & Geotag Verification</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Attendance Hub</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Log working shifts, inspect monthly compliance, and request punch corrections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCorrectionModal(true)}
            className="py-2 px-3.5 rounded-xl bg-[#151F35] hover:bg-[#19253F] text-xs font-medium text-cyan-300 border border-[#1E293B] transition-colors"
          >
            Request Correction
          </button>
          <button
            onClick={handleToggleAttendance}
            className={`py-2 px-4 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 ${
              isCheckedIn
                ? 'bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/40'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-glow'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{isCheckedIn ? 'Clock Out' : 'Clock In'}</span>
          </button>
        </div>
      </div>

      {/* Top Shift Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Current Status</span>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-3 h-3 rounded-full ${isCheckedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <p className="text-xl font-bold text-[#F8FAFC]">
              {isCheckedIn ? 'Checked In' : 'Checked Out'}
            </p>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            {isCheckedIn ? `In at ${checkInTime}` : 'Shift ended'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Today's Duration</span>
          <p className="text-xl font-bold text-[#F8FAFC] mt-2">6h 45m</p>
          <p className="text-xs text-cyan-400 mt-1">Standard: 8h 00m</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Monthly Attendance</span>
          <p className="text-xl font-bold text-emerald-400 mt-2">97.2%</p>
          <p className="text-xs text-[#94A3B8] mt-1">19 Days on duty</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Location Tag</span>
          <p className="text-xl font-bold text-[#F8FAFC] mt-2 truncate">HQ - 4F</p>
          <p className="text-[11px] text-[#94A3B8] mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Bangalore HQ (Fictional Demo)</span>
          </p>
        </div>
      </div>

      {/* Monthly Attendance Calendar Grid */}
      <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">November 2026 Attendance Heatmap</h3>
            <p className="text-xs text-[#94A3B8]">Click any date to view punch logs and timestamps</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /><span className="text-[#94A3B8]">Present</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /><span className="text-[#94A3B8]">Late</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500" /><span className="text-[#94A3B8]">Leave</span></span>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[11px] font-semibold text-[#64748B] py-1">
              {day}
            </div>
          ))}

          {calendarDays.map((item) => {
            const isPresent = item.status === 'Present';
            const isLate = item.status === 'Late';
            const isLeave = item.status === 'Leave';
            const isWeekend = item.status === 'Weekend';
            return (
              <div
                key={item.day}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  item.isToday
                    ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-500/20'
                    : isPresent
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-[#F8FAFC]'
                    : isLate
                    ? 'border-amber-500/30 bg-amber-950/20 text-amber-200'
                    : isLeave
                    ? 'border-red-500/30 bg-red-950/20 text-red-200'
                    : isWeekend
                    ? 'border-[#1E293B]/40 bg-[#080D1B] text-[#64748B]'
                    : 'border-[#1E293B] bg-[#10182A] text-[#94A3B8]'
                }`}
              >
                <span className="text-xs font-bold block">{item.day}</span>
                <span className="text-[9px] block mt-0.5 truncate font-medium">
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Work Hours Recharts Chart */}
      <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
        <h3 className="text-sm font-bold text-[#F8FAFC]">Weekly Shift Hours Breakdown</h3>
        <div className="h-60 w-full pt-2">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-[#94A3B8]">
              Loading attendance telemetry...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  formatter={(value: any) => [`${value} hrs`, 'Logged']}
                />
                <Bar dataKey="hoursWorked" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Logged Hours" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Attendance Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#10182A] border border-[#1E293B] rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-[#F8FAFC]">Attendance Correction Request</h3>
            <p className="text-xs text-[#94A3B8]">
              Missed a check-in or encountered a kiosk error? Submit a correction for manager verification.
            </p>

            {correctionSuccess ? (
              <div className="py-6 flex flex-col items-center text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                <h4 className="text-sm font-bold text-[#F8FAFC]">Correction Request Submitted</h4>
                <p className="text-xs text-[#94A3B8]">Forwarded to Director Sarah Jenkins for approval.</p>
              </div>
            ) : (
              <form onSubmit={handleCorrectionSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Date</label>
                  <input
                    type="date"
                    defaultValue="2026-11-19"
                    className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Requested Check-In Time</label>
                  <input
                    type="time"
                    defaultValue="09:00"
                    className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1">Reason for Punch Discrepancy</label>
                  <textarea
                    rows={3}
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    placeholder="E.g., RFID turnstile glitch at HQ 4th floor entrance..."
                    className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl p-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionModal(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#151F35] text-xs text-[#94A3B8] font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium text-xs shadow-blue-glow transition-all"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
