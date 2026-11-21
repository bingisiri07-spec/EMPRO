import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  User 
} from 'lucide-react';
import { Domain } from '../../types';

interface CopilotModuleProps {
  currentDomain: Domain;
}

export const CopilotModule: React.FC<CopilotModuleProps> = ({ currentDomain }) => {
  const isProfessional = currentDomain === 'professional';

  // Distinct conversation storage
  const [proMessages, setProMessages] = useState([
    { sender: 'assistant', text: 'Hello Alex! I am your Professional Copilot for Nexus Technologies. How can I help you understand your salary components, attendance policies, or meeting follow-ups today?' }
  ]);
  const [personalMessages, setPersonalMessages] = useState([
    { sender: 'assistant', text: 'Welcome back Alex! I am your Personal Growth Coach. How are your Q4 goals progressing, or would you like to reflect on your study notes?' }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messages = isProfessional ? proMessages : personalMessages;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    if (isProfessional) {
      setProMessages(prev => [...prev, { sender: 'user', text: userText }]);
    } else {
      setPersonalMessages(prev => [...prev, { sender: 'user', text: userText }]);
    }

    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = userText.toLowerCase();

      if (isProfessional) {
        if (q.includes('leave') || q.includes('carry')) {
          reply = 'Under Nexus Technologies policy, up to 10 days of unused Earned Leave can be carried forward to 2027. Casual Leave balances expire on December 31st.';
        } else if (q.includes('pf') || q.includes('salary') || q.includes('deduct')) {
          reply = 'Your PF deduction is 12% of basic pay (₹92,500), totaling ₹11,100 monthly. An equivalent contribution is matched by Nexus Technologies into your EPFO account.';
        } else {
          reply = `Corporate Copilot: Your query regarding "${userText}" has been analyzed using company handbook standards. For HR approval exceptions, submit via the Leave/Payroll portal.`;
        }
        setProMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      } else {
        if (q.includes('rust') || q.includes('goal')) {
          reply = 'Your Rust Systems goal is at 75% completion with 24 days left. Consistency in 45-minute daily sprints will have you ready for project implementation by Dec 15th.';
        } else if (q.includes('marathon') || q.includes('run')) {
          reply = 'For your 10K marathon prep, interval pacing today targets 4:35/km splits. Focus on smooth cadence and post-run recovery.';
        } else {
          reply = `Personal Coach: That is a valuable personal perspective on "${userText}". Balancing focused work with reflective renewal is key to sustainable autonomy.`;
        }
        setPersonalMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      }
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isProfessional ? 'text-blue-400' : 'text-cyan-400'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isProfessional ? 'Professional AI Copilot' : 'Personal Growth Copilot'}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">
              {isProfessional ? 'Company Context Boundary' : 'Private Life Domain'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">
            {isProfessional ? 'Corporate Workplace Assistant' : 'Personal Growth Coach'}
          </h2>
        </div>

        {/* Isolation Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2.5 py-1 rounded-full font-semibold border ${
            isProfessional 
              ? 'bg-blue-950 text-blue-300 border-blue-800/40' 
              : 'bg-cyan-950 text-cyan-300 border-cyan-800/40'
          }`}>
            {isProfessional ? '🔒 Zero Personal Data Leakage' : '🔒 Zero Corporate Access'}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#10182A] border border-[#1E293B] my-2">
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex gap-3 text-xs leading-relaxed max-w-2xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : isProfessional
                ? 'bg-blue-950 text-blue-400 border border-blue-800/40'
                : 'bg-cyan-950 text-cyan-400 border border-cyan-800/40'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className={`p-3.5 rounded-2xl ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-[#080D1B] border border-[#1E293B] text-[#F8FAFC]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 italic p-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing isolated {isProfessional ? 'corporate policies' : 'personal growth context'}...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="relative shrink-0 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isProfessional
              ? 'Ask about leave rules, PF calculation, or meeting follow-ups...'
              : 'Ask about personal goals, running pacing, or study reflections...'
          }
          className="w-full bg-[#10182A] border border-[#1E293B] focus:border-cyan-500 rounded-2xl py-3 pl-4 pr-12 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white disabled:opacity-40 transition-all shadow-blue-glow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
