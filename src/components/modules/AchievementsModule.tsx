import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AchievementItem, AchievementVisibility } from '../../types';
import { MOCK_ACHIEVEMENTS } from '../../data/mockData';

export const AchievementsModule: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>(MOCK_ACHIEVEMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Achievement Form
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [category, setCategory] = useState<'Certification' | 'Award' | 'Hackathon' | 'Publication' | 'Project'>('Certification');
  const [visibility, setVisibility] = useState<AchievementVisibility>('public');
  const [description, setDescription] = useState('');

  const handleUpdateVisibility = (id: string, newVisibility: AchievementVisibility) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, visibility: newVisibility } : a));
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAch: AchievementItem = {
      id: `ach_${Date.now()}`,
      title: title.trim(),
      issuer: issuer.trim() || 'Verified Issuer',
      date: 'Nov 2026',
      category,
      visibility,
      description: description.trim() || 'Verified professional milestone recorded on permanent EMPRO identity.',
      badgeColor: '#06B6D4',
    };

    setAchievements([newAch, ...achievements]);
    setTitle('');
    setIssuer('');
    setDescription('');
    setShowAddModal(false);
  };

  const filtered = achievements.filter(a => selectedCategory === 'All' || a.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Lifelong Verified Credentials
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">4-Tier Visibility Governance</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Achievements Vault</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Your achievements stay with you across employers. Set explicit visibility per credential.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-cyan-glow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credential</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Certification', 'Hackathon', 'Publication', 'Project'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-xl border transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-blue-glow'
                : 'bg-[#10182A] border-[#1E293B] text-[#94A3B8] hover:bg-[#151F35]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  {item.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">{item.date}</span>
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">{item.title}</h3>
              <p className="text-xs text-cyan-300 font-medium">{item.issuer}</p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{item.description}</p>
              {item.credentialId && (
                <p className="text-[10px] font-mono text-[#64748B]">ID: {item.credentialId}</p>
              )}
            </div>

            {/* 4-Tier Visibility Control */}
            <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">Visibility Permission:</span>
              <select
                value={item.visibility}
                onChange={(e) => handleUpdateVisibility(item.id, e.target.value as AchievementVisibility)}
                className="bg-[#080D1B] border border-[#1E293B] rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-medium focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="private">🔒 Private (Only Me)</option>
                <option value="connections">👥 Selected Connections</option>
                <option value="company">🏢 Current Company</option>
                <option value="public">🌐 Public Profile</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#10182A] border border-[#1E293B] rounded-2xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-bold text-[#F8FAFC]">Add Achievement to Vault</h3>

            <form onSubmit={handleAddAchievement} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#94A3B8] mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Google Cloud Certified Professional"
                  className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-[#F8FAFC] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Issuer / Institution</label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="E.g., Google Cloud"
                  className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-[#F8FAFC] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#94A3B8] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-[#F8FAFC] focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Certification">Certification</option>
                    <option value="Award">Award</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Publication">Publication</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1">Default Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as AchievementVisibility)}
                    className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-[#F8FAFC] focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="private">🔒 Private (Only Me)</option>
                    <option value="connections">👥 Selected Connections</option>
                    <option value="company">🏢 Current Company</option>
                    <option value="public">🌐 Public Profile</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key competencies, achievements, or project scope..."
                  className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl p-2.5 text-[#F8FAFC] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#151F35] text-[#94A3B8] font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-cyan-glow transition-all"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
