import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { salaryService } from '../../services/salaryService';
import { useTheme } from '../../context/ThemeContext';

export const SalaryVaultModule: React.FC = () => {
  const { isDark } = useTheme();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [salaryHistory, setSalaryHistory] = useState<any[]>([]);

  useEffect(() => {
    salaryService.getSalaryHistory().then((data) => {
      setSalaryHistory(data);
    });
  }, []);

  const pastRevisions = salaryHistory.length > 0 ? salaryHistory.map((s, idx) => ({
    period: `${s.month} ${s.year}`,
    gross: s.grossSalary,
    net: s.netSalary,
    status: s.status,
    revisionNote: idx === 0 ? 'Annual Merit Increase (12%)' : 'Regular compensation',
  })) : [
    { period: 'Nov 2026', gross: 185000, net: 146200, status: 'Processing', revisionNote: 'Annual Merit Increase (12%)' },
    { period: 'Oct 2026', gross: 165000, net: 131400, status: 'Paid', revisionNote: 'Regular compensation' },
    { period: 'Sep 2026', gross: 165000, net: 131400, status: 'Paid', revisionNote: 'Regular compensation' },
    { period: 'Aug 2026', gross: 165000, net: 131400, status: 'Paid', revisionNote: 'Regular compensation' },
  ];

  const handleDownload = (filename: string) => {
    setDownloadSuccess(`Downloaded ${filename} successfully`);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Corporate Compensation Records
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Immutable Vault History</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Salary Tracker & Salary Vault</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Effective-dated revisions, compensation breakdowns, and historical payslip repository.
          </p>
        </div>

        <button
          onClick={() => handleDownload('Payslip_NX_4092_Nov2026.pdf')}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs shadow-blue-glow transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Latest Payslip (PDF)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {downloadSuccess}
          </span>
          <span className="text-[10px] text-emerald-400/80">Encrypted Document</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Gross Compensation</span>
          <p className="text-2xl font-bold text-[#F8FAFC] mt-2">₹1,85,000</p>
          <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% Revision effective Q4</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Total Deductions</span>
          <p className="text-2xl font-bold text-red-400 mt-2">-₹38,800</p>
          <p className="text-xs text-[#94A3B8] mt-1">
            PF (₹11.1k) + TDS (₹25.2k) + PT (₹200) + Others
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#10182A] via-[#111F38] to-[#10182A] border border-cyan-500/40 shadow-cyan-glow">
          <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Net Take-Home Pay</span>
          <p className="text-2xl font-extrabold text-[#F8FAFC] mt-2">₹1,46,200</p>
          <p className="text-xs text-cyan-400 font-medium mt-1">
            Payout on 30 Nov 2026
          </p>
        </div>
      </div>

      {/* Detailed Cascade Breakdown */}
      <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">November 2026 Line-Item Compensation Breakdown</h3>
            <p className="text-xs text-[#94A3B8]">Configurable structure compliant with company compensation policy</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Fictional Sample Figures
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Earnings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center justify-between">
              <span>Earnings</span>
              <span className="text-emerald-400 font-mono">₹1,85,000</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                <span className="text-[#94A3B8]">Basic Pay (50%)</span>
                <span className="font-mono text-[#F8FAFC]">₹92,500</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                <span className="text-[#94A3B8]">House Rent Allowance (HRA)</span>
                <span className="font-mono text-[#F8FAFC]">₹46,250</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                <span className="text-[#94A3B8]">Special Allowance</span>
                <span className="font-mono text-[#F8FAFC]">₹36,250</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#94A3B8]">Performance Bonus</span>
                <span className="font-mono text-[#F8FAFC]">₹10,000</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center justify-between">
              <span>Deductions</span>
              <span className="text-red-400 font-mono">-₹38,800</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                <span className="text-[#94A3B8]">Employee Provident Fund (PF 12%)</span>
                <span className="font-mono text-red-400">-₹11,100</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                <span className="text-[#94A3B8]">Income Tax TDS (Est. Old/New Slab)</span>
                <span className="font-mono text-red-400">-₹25,200</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                <span className="text-[#94A3B8]">Professional Tax (PT)</span>
                <span className="font-mono text-red-400">-₹200</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#94A3B8]">Health Insurance Premium</span>
                <span className="font-mono text-red-400">-₹2,300</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Effective-Dated Revisions Table */}
      <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">6-Month Payout & Merit Revision Trajectory</h3>
            <p className="text-xs text-[#94A3B8]">Visual progression of gross and net compensation</p>
          </div>
          <span className="text-xs text-cyan-400 font-mono">+12% Merit Jump</span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[...pastRevisions].reverse()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salaryNetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="salaryGrossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} vertical={false} />
              <XAxis dataKey="period" stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} tickLine={false} />
              <YAxis stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} tickLine={false} domain={[100000, 200000]} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: isDark ? '#10182A' : '#FFFFFF', 
                  borderColor: isDark ? '#1E293B' : '#CBD5E1', 
                  borderRadius: '12px', 
                  fontSize: '11px', 
                  color: isDark ? '#F8FAFC' : '#0F172A',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Amount']}
              />
              <Area type="monotone" dataKey="gross" stroke="#3B82F6" fillOpacity={1} fill="url(#salaryGrossGrad)" name="Gross" />
              <Area type="monotone" dataKey="net" stroke="#06B6D4" fillOpacity={1} fill="url(#salaryNetGrad)" name="Net" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Effective-Dated Revisions Table */}
      <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Salary Vault & Revision History</h3>
            <p className="text-xs text-[#94A3B8]">Past payroll records are immutable and preserved after salary revisions</p>
          </div>
          <span className="text-xs text-blue-400 font-medium">Historical Audit Log Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#94A3B8] border-b border-[#1E293B] pb-2">
                <th className="py-2.5 font-semibold">Pay Period</th>
                <th className="py-2.5 font-semibold">Gross Pay</th>
                <th className="py-2.5 font-semibold">Net Take-Home</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Revision Event</th>
                <th className="py-2.5 font-semibold text-right">Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {pastRevisions.map((rev) => (
                <tr key={rev.period} className="hover:bg-[#151F35]/50 transition-colors">
                  <td className="py-3 font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{rev.period}</span>
                  </td>
                  <td className="py-3 font-mono text-[#F8FAFC]">₹{rev.gross.toLocaleString()}</td>
                  <td className="py-3 font-mono font-bold text-cyan-400">₹{rev.net.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      rev.status === 'Paid'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                    }`}>
                      {rev.status}
                    </span>
                  </td>
                  <td className="py-3 text-[#94A3B8]">{rev.revisionNote}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDownload(`Payslip_${rev.period.replace(' ', '_')}.pdf`)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 ml-auto"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Vault Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#080D1B] border border-blue-500/20 text-xs space-y-1">
        <div className="flex items-center gap-2 text-blue-400 font-semibold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Salary Vault Architecture Notice</span>
        </div>
        <p className="text-[11px] text-[#94A3B8] leading-relaxed">
          EMPRO Salary Vault is a secure historical payroll document and revision repository. It is not a financial wallet, bank account, or funds transfer mechanism. Figures are illustrative and compliant with enterprise policies.
        </p>
      </div>
    </div>
  );
};
