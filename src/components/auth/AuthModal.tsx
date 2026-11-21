import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Server
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured, verifySupabaseConnection } from '../../lib/supabaseClient';
import { Role } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    signInWithEmail, 
    signUpWithEmail, 
    authError,
    isLiveAuth,
    user,
    signOut
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('employee');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalMessage(null);
    setIsSubmitting(true);

    if (mode === 'signin') {
      const res = await signInWithEmail(email, password);
      if (!res.success) {
        setLocalMessage({ type: 'error', text: res.error || 'Authentication failed' });
      } else {
        setLocalMessage({ type: 'success', text: 'Successfully authenticated with Supabase!' });
        setTimeout(() => closeAuthModal(), 700);
      }
    } else {
      if (!fullName.trim()) {
        setLocalMessage({ type: 'error', text: 'Please enter your full name.' });
        setIsSubmitting(false);
        return;
      }
      const res = await signUpWithEmail(email, password, fullName, role);
      if (!res.success) {
        setLocalMessage({ type: 'error', text: res.error || 'Sign up failed' });
      } else {
        setLocalMessage({ 
          type: 'success', 
          text: 'Account created! If email confirmation is enabled on your Supabase project, check your inbox.' 
        });
        setTimeout(() => closeAuthModal(), 1200);
      }
    }
    setIsSubmitting(false);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    const result = await verifySupabaseConnection();
    setConnectionStatus(result.message);
    setIsTestingConnection(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#10182A] border border-[#1E293B] rounded-2xl p-6 shadow-2xl shadow-blue-950/50 space-y-5">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-xl hover:bg-[#151F35] transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-2xl bg-[#151F35] border border-blue-500/30 text-blue-400 mb-2 shadow-blue-glow">
            {isLiveAuth ? <ShieldCheck className="w-6 h-6 text-emerald-400" /> : <Lock className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">
            {isLiveAuth ? 'Supabase Account Active' : mode === 'signin' ? 'Sign In to EMPRO' : 'Create EMPRO Account'}
          </h2>
          <p className="text-xs text-[#94A3B8]">
            {isLiveAuth 
              ? `Connected as ${user?.email}` 
              : 'Direct PostgreSQL & Supabase Auth integration'}
          </p>
        </div>

        {/* Supabase Status Banner */}
        <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Server className={`w-4 h-4 ${isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-[#94A3B8]">
              Backend Status:{' '}
              <span className={`font-semibold ${isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isSupabaseConfigured() ? 'Configured' : 'Demo / Mock Mode'}
              </span>
            </span>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline disabled:opacity-50"
          >
            {isTestingConnection ? 'Pinging...' : 'Verify'}
          </button>
        </div>

        {connectionStatus && (
          <div className="p-2.5 rounded-lg text-xs bg-blue-950/40 border border-blue-800/40 text-blue-200">
            {connectionStatus}
          </div>
        )}

        {isLiveAuth ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Live Session Verified
              </div>
              <p className="text-xs text-[#94A3B8]">
                You are currently signed in with user ID: <span className="font-mono text-cyan-300">{user?.id}</span>
              </p>
            </div>

            <button
              onClick={async () => {
                await signOut();
                closeAuthModal();
              }}
              className="w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-800/40 text-red-300 text-xs font-semibold transition-colors"
            >
              Sign Out & Return to Demo Persona
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#080D1B] border border-[#1E293B] text-xs">
              <button
                type="button"
                onClick={() => { setMode('signin'); setLocalMessage(null); }}
                className={`py-2 rounded-lg font-medium transition-all ${
                  mode === 'signin'
                    ? 'bg-[#151F35] text-[#38BDF8] shadow'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setLocalMessage(null); }}
                className={`py-2 rounded-lg font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-[#151F35] text-[#38BDF8] shadow'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error or Success notification */}
            {(localMessage || authError) && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  localMessage?.type === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border border-red-500/40 text-red-300'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{localMessage?.text || authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-[#080D1B] border border-[#1E293B] text-xs text-[#F8FAFC] pl-9 pr-3 py-2.5 rounded-xl focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Organizational Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="w-full bg-[#080D1B] border border-[#1E293B] text-xs text-[#F8FAFC] px-3 py-2.5 rounded-xl focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="employee">Employee (Individual Contributor)</option>
                      <option value="manager">Manager (Team Lead / Engineering Manager)</option>
                      <option value="hr">HR Administrator</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.chen@acme.corp"
                    className="w-full bg-[#080D1B] border border-[#1E293B] text-xs text-[#F8FAFC] pl-9 pr-3 py-2.5 rounded-xl focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#080D1B] border border-[#1E293B] text-xs text-[#F8FAFC] pl-9 pr-3 py-2.5 rounded-xl focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs transition-all shadow-blue-glow disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : mode === 'signin' ? (
                  <>
                    <LogIn className="w-4 h-4" /> Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Create Account
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={closeAuthModal}
                className="text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                Continue using Demo Personas without signing in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
