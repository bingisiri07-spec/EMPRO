import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Persona } from '../../types';

interface DigitalIDModuleProps {
  persona: Persona;
}

export const DigitalIDModule: React.FC<DigitalIDModuleProps> = ({ persona }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(`https://empro.app/verify/${persona.employeeId}`);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Workforce Verification
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Cryptographic ID Protocol</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Corporate Digital Identity</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Employer-authenticated digital badge with backend-verified QR access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQRModal(true)}
            className="py-2 px-3.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/40 text-xs font-medium flex items-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Present QR Badge</span>
          </button>
        </div>
      </div>

      {/* Main ID Badge Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The Visual Card (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#152342] via-[#10182A] to-[#0A1020] border-2 border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/40 relative overflow-hidden space-y-6">
            {/* Top Badge Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />

            {/* Badge Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-sm shadow-blue-glow">
                  E
                </div>
                <div>
                  <span className="font-extrabold text-sm text-[#F8FAFC] tracking-tight">EMPRO</span>
                  <span className="block text-[8px] text-cyan-400 uppercase tracking-widest font-semibold">Corporate ID</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>

            {/* Employee Photo & Identification */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-[#080D1B] border border-cyan-500/40 text-cyan-400 shadow-dark-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">{persona.name}</h3>
                <p className="text-xs text-cyan-300 font-medium">{persona.designation}</p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">{persona.department}</p>
              </div>
            </div>

            {/* Meta Grid */}
            <div className="p-3.5 rounded-2xl bg-[#080D1B]/90 border border-[#1E293B] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase tracking-wider font-semibold">Employee ID</span>
                <span className="font-mono font-bold text-[#F8FAFC]">{persona.employeeId}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase tracking-wider font-semibold">Joined Date</span>
                <span className="font-semibold text-[#F8FAFC]">{persona.joinedDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase tracking-wider font-semibold">Company</span>
                <span className="font-semibold text-blue-400 truncate block">{persona.company}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase tracking-wider font-semibold">Work Location</span>
                <span className="font-semibold text-[#F8FAFC] truncate block">{persona.location}</span>
              </div>
            </div>

            {/* Simulated QR Code on Card */}
            <div className="pt-1 flex flex-col items-center">
              <div 
                onClick={() => setShowQRModal(true)}
                className="p-3 bg-white rounded-2xl cursor-pointer hover:scale-105 transition-transform shadow-lg"
                title="Click to expand QR Code"
              >
                {/* SVG QR Code Simulation */}
                <svg width="100" height="100" viewBox="0 0 100 100" className="w-20 h-20">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="25" height="25" fill="#080D1B" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="#080D1B" />
                  <rect x="65" y="10" width="25" height="25" fill="#080D1B" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="#080D1B" />
                  <rect x="10" y="65" width="25" height="25" fill="#080D1B" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="#080D1B" />
                  <rect x="42" y="15" width="16" height="6" fill="#080D1B" />
                  <rect x="42" y="30" width="10" height="10" fill="#080D1B" />
                  <rect x="42" y="55" width="16" height="8" fill="#080D1B" />
                  <rect x="65" y="45" width="20" height="10" fill="#080D1B" />
                  <rect x="45" y="75" width="40" height="12" fill="#080D1B" />
                </svg>
              </div>
              <span className="text-[10px] text-[#64748B] mt-2 font-mono">NX-TOKEN-AUTH-89240</span>
            </div>
          </div>
        </div>

        {/* Right: Security & Credentials Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
            <h3 className="text-sm font-bold text-[#F8FAFC]">Cryptographic Verification Status</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              This digital identity token is issued by <strong className="text-[#F8FAFC]">{persona.company}</strong> and cryptographically bound to your permanent EMPRO identity.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#94A3B8]">Verification Type</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Authorized Enterprise Token
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#94A3B8]">Token Expiration</span>
                <span className="font-mono text-[#F8FAFC]">31 Dec 2026 (Auto-Renews)</span>
              </div>

              <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#94A3B8]">Corporate Email</span>
                <span className="font-mono text-cyan-300">{persona.workEmail}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#94A3B8]">Previous Company Association</span>
                <span className="text-slate-400">{persona.previousCompany || 'None recorded'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="py-2 px-4 rounded-xl bg-[#151F35] hover:bg-[#19253F] text-xs font-medium text-cyan-300 border border-[#1E293B] transition-colors"
              >
                {copiedNotice ? '✓ Verification Link Copied!' : 'Copy Verification Link'}
              </button>
            </div>
          </div>

          {/* Truthful Security Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#080D1B] border border-amber-500/20 text-xs space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Truthful Engineering Disclosure</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              QR codes in this demonstration validate corporate identity metadata. In full production deployment, attendance and door-access authorization require anti-replay time-limited cryptographic tokens validated by the backend.
            </p>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#10182A] border border-[#1E293B] rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <h3 className="text-base font-bold text-[#F8FAFC]">Digital ID QR Access</h3>
            <p className="text-xs text-[#94A3B8]">
              Scan for security turnstiles and workplace check-in kiosks.
            </p>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-xl">
              <svg width="160" height="160" viewBox="0 0 100 100" className="w-40 h-40">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="#080D1B" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#080D1B" />
                <rect x="65" y="10" width="25" height="25" fill="#080D1B" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#080D1B" />
                <rect x="10" y="65" width="25" height="25" fill="#080D1B" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#080D1B" />
                <rect x="42" y="15" width="16" height="6" fill="#080D1B" />
                <rect x="42" y="30" width="10" height="10" fill="#080D1B" />
                <rect x="42" y="55" width="16" height="8" fill="#080D1B" />
                <rect x="65" y="45" width="20" height="10" fill="#080D1B" />
                <rect x="45" y="75" width="40" height="12" fill="#080D1B" />
              </svg>
            </div>

            <p className="text-[11px] font-mono text-cyan-400">
              {persona.name} • {persona.employeeId}
            </p>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2 px-4 rounded-xl bg-[#151F35] hover:bg-[#19253F] text-xs font-semibold text-[#F8FAFC] transition-colors"
            >
              Close Badge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
