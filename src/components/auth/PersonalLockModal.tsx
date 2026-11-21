import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertCircle, X } from 'lucide-react';

interface PersonalLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

export const PersonalLockModal: React.FC<PersonalLockModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setError(false);
      setPin('');
      onUnlockSuccess();
    } else {
      setError(true);
    }
  };

  const handleQuickDemoUnlock = () => {
    setError(false);
    setPin('');
    onUnlockSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#10182A] border border-[#1E293B] rounded-2xl p-6 shadow-2xl shadow-blue-950/40 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg hover:bg-[#151F35] transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#151F35] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F8FAFC]">Personal Domain Access</h3>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-xs">
              Your personal sanctuary is isolated from employer surveillance and requires individual authentication.
            </p>
          </div>
        </div>

        {/* Transparent Demo Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#080D1B] border border-amber-500/20 text-left space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Demo Lock Simulation</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">
            For this evaluation, enter demo PIN <span className="text-[#F8FAFC] font-mono font-bold bg-[#151F35] px-1.5 py-0.5 rounded">1234</span>. In production, this gate enforces WebAuthn / Passkey device biometrics with zero storage of biometric data.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5 text-center">
              Enter Personal Access PIN
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••"
                className={`w-full text-center text-2xl tracking-[0.5em] font-mono py-2.5 px-4 bg-[#080D1B] rounded-xl border ${
                  error ? 'border-red-500/80 text-red-400' : 'border-[#1E293B] text-[#F8FAFC] focus:border-cyan-500'
                } focus:outline-none transition-colors`}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-1.5 text-center">
                Incorrect PIN. Use demo code <span className="font-mono font-bold">1234</span>.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-sm shadow-blue-glow transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Personal Sanctuary</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="w-full py-2 px-4 rounded-xl bg-[#151F35] hover:bg-[#19253F] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-medium border border-[#1E293B] transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>1-Click Demo Unlock (PIN 1234)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
