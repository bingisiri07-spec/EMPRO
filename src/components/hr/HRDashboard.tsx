import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  CalendarCheck, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Download,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Persona } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface HRDashboardProps {
  persona: Persona;
  onNavigateTab: (tabId: string) => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({
  persona,
  onNavigateTab,
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const deptData = [
    { name: 'Engineering', count: 62, color: '#3B82F6' },
    { name: 'Product & Design', count: 28, color: '#06B6D4' },
    { name: 'Sales & Growth', count: 32, color: '#8B5CF6' },
    { name: 'Operations & HR', count: 20, color: '#10B981' },
  ];

  const organizationEmployees = [
    { id: 'NX-4092', name: 'Alex Rivera', role: 'Lead Frontend Engineer', dept: 'Engineering', joined: '15 Mar 2023', status: 'Active', email: 'alex.rivera@nexustech.io' },
    { id: 'NX-1048', name: 'Sarah Jenkins', role: 'Director of Engineering', dept: 'Engineering', joined: '10 Jan 2021', status: 'Active', email: 'sarah.jenkins@nexustech.io' },
    { id: 'NX-4105', name: 'Elena Rostova', role: 'Senior Systems Architect', dept: 'Engineering', joined: '12 May 2022', status: 'Active', email: 'elena.rostova@nexustech.io' },
    { id: 'NX-2041', name: 'Kavita Sundaram', role: 'Head of Product', dept: 'Product & Design', joined: '01 Aug 2021', status: 'Active', email: 'kavita.s@nexustech.io' },
    { id: 'NX-3012', name: 'Arjun Mehta', role: 'VP of Global Enterprise Sales', dept: 'Sales & Growth', joined: '14 Feb 2020', status: 'Active', email: 'arjun.mehta@nexustech.io' },
    { id: 'NX-4188', name: 'Priya Patel', role: 'UI/UX Design Lead', dept: 'Product & Design', joined: '18 Nov 2023', status: 'On Leave', email: 'priya.patel@nexustech.io' },
    { id: 'NX-5002', name: 'Ananya Roy', role: 'People Operations Lead', dept: 'Operations & HR', joined: '11 Oct 2022', status: 'Active', email: 'ananya.roy@nexustech.io' },
  ];

  const filteredEmployees = organizationEmployees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Organization Context */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10182A] via-[#12203D] to-[#10182A] border border-[#1E293B] shadow-dark-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-cyan-400 tracking-wide uppercase">
              People Operations & Workforce Governance
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Nexus Technologies Ltd (org_nexus_tech)</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
            VP {persona.name.split(' ')[0]}'s HR Administration
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-2">
            <span>{persona.designation}</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-mono">Headcount: 142 Active Members</span>
          </p>
        </div>

        {/* HR Privacy & Boundary Pill */}
        <div className="p-3.5 rounded-xl bg-[#080D1B] border border-cyan-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Strict Professional Scope</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-0.5 max-w-xs">
              HR authority applies strictly to company workforce records. Employee personal diaries & goals remain 100% private.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Organization Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Headcount</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">142 Employees</p>
          <p className="text-[11px] text-cyan-400 font-medium mt-1">
            +4 Joined this quarter
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active On Duty</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">134 (94.4%)</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            8 on approved leave
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Payroll Cycle (Nov)</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">₹1.98 Cr</p>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            Disbursement Audit Approved
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B]">
          <div className="flex items-center justify-between text-[#94A3B8] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Compliance Status</span>
            <CalendarCheck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-[#F8FAFC]">100% In Order</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            PF, ESI & TDS filings verified
          </p>
        </div>
      </div>

      {/* 3. Analytics Split: Department Headcount & Payroll Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Distribution (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Department Workforce Distribution</h3>
              <p className="text-xs text-[#94A3B8]">Headcount allocation across Nexus business units</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">4 Divisions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} vertical={false} />
                  <XAxis dataKey="name" stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} tickLine={false} />
                  <YAxis stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} tickLine={false} domain={[0, 70]} />
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
                    formatter={(value: any) => [`${value} members`, 'Headcount']}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Distribution Breakdown */}
            <div className="md:col-span-4 h-52 flex flex-col items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {deptData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke={isDark ? '#080D1B' : '#FFFFFF'} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: isDark ? '#10182A' : '#FFFFFF', 
                      borderColor: isDark ? '#1E293B' : '#CBD5E1', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(val: any) => [`${val} members`, 'Headcount']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-lg font-extrabold text-[#F8FAFC]">142</span>
                <span className="text-[9px] uppercase tracking-wider text-[#64748B]">Total Staff</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1E293B] text-xs">
            {deptData.map((d) => (
              <div key={d.name} className="p-2 rounded-lg bg-[#080D1B] border border-[#1E293B]">
                <span className="text-[#94A3B8] block text-[10px] truncate">{d.name}</span>
                <span className="text-sm font-bold text-[#F8FAFC]">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Payroll & Disbursal Status (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC]">Payroll Disbursement Status</h3>
                <p className="text-xs text-[#94A3B8]">November 2026 Scheduled Payout</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                Audit Verified
              </span>
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] flex justify-between items-center">
                <span className="text-[#94A3B8]">Total Gross Payroll:</span>
                <span className="font-mono font-bold text-[#F8FAFC] text-sm">₹2,42,80,000</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] flex justify-between items-center">
                <span className="text-[#94A3B8]">Statutory Deductions (PF & Tax):</span>
                <span className="font-mono font-bold text-red-400 text-sm">₹44,80,000</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080D1B] border border-blue-500/30 flex justify-between items-center">
                <span className="text-cyan-300 font-semibold">Net Disbursable Amount:</span>
                <span className="font-mono font-bold text-cyan-400 text-base">₹1,98,00,000</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-[#F8FAFC]">Disbursement Date</p>
              <p className="text-[10px] text-[#94A3B8]">30 Nov 2026 • 142 Accounts</p>
            </div>
            <button 
              onClick={() => onNavigateTab('hr-payroll')}
              className="py-1.5 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/40 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Searchable Organization Directory */}
      <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Nexus Organization Directory</h3>
            <p className="text-xs text-[#94A3B8]">Manage employment records, status, and designations</p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID or role..."
                className="bg-[#080D1B] border border-[#1E293B] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-blue-500 focus:outline-none w-56"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#080D1B] border border-[#1E293B] rounded-xl px-2.5 py-1.5 text-xs text-[#94A3B8] focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Sales & Growth">Sales & Growth</option>
              <option value="Operations & HR">Operations & HR</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#94A3B8] border-b border-[#1E293B] pb-2">
                <th className="py-2.5 font-semibold">Employee</th>
                <th className="py-2.5 font-semibold">Designation</th>
                <th className="py-2.5 font-semibold">Department</th>
                <th className="py-2.5 font-semibold">Joined Date</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Corporate Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#151F35]/50 transition-colors">
                  <td className="py-3 font-semibold text-[#F8FAFC] flex items-center gap-2">
                    <span>{emp.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 px-1 py-0.2 rounded bg-cyan-950 border border-cyan-800/40">
                      {emp.id}
                    </span>
                  </td>
                  <td className="py-3 text-[#94A3B8]">{emp.role}</td>
                  <td className="py-3 text-[#94A3B8]">{emp.dept}</td>
                  <td className="py-3 text-[#64748B]">{emp.joined}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      emp.status === 'Active' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : 'bg-red-950 text-red-400 border border-red-800/40'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[#94A3B8]">{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
