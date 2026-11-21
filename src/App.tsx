import { ShieldCheck, Sparkles, Building2, User } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-sm font-semibold border border-violet-100">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span>EMPRO Foundation Verified</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            EMPRO
          </h1>
          <p className="text-sm font-medium text-violet-600 mt-1">
            Your Professional Identity. Your Personal World.
          </p>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">
          The dual-domain platform bridging employer-managed workforce tools and lifelong individual ownership.
        </p>

        <div className="grid grid-cols-2 gap-4 text-left pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-violet-700 font-semibold text-sm mb-1">
              <Building2 className="w-4 h-4" />
              <span>Professional</span>
            </div>
            <p className="text-xs text-slate-500">
              Employer-controlled records, Digital ID, Attendance, Leave, Salary Vault.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
            <div className="flex items-center gap-2 text-violet-800 font-semibold text-sm mb-1">
              <User className="w-4 h-4" />
              <span>Personal</span>
            </div>
            <p className="text-xs text-slate-500">
              Individual-owned sanctuary, private diary, portable achievements & community.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Phase 0: Scaffold & Setup</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Vite + React + Tailwind Ready
          </span>
        </div>
      </div>
    </div>
  );
}
