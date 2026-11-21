import React, { useState } from 'react';
import { 
  Lock, 
  Plus, 
  Search, 
  Trash2, 
  Star 
} from 'lucide-react';
import { DiaryEntry } from '../../types';
import { MOCK_DIARY_ENTRIES } from '../../data/mockData';

export const DiaryModule: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>(MOCK_DIARY_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Entry Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'Energized' | 'Focused' | 'Reflective' | 'Accomplished'>('Reflective');
  const [tagInput, setTagInput] = useState('');

  const allTags = ['All', 'Architecture', 'Philosophy', 'Product', 'Rust', 'Learning', 'Discipline'];

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newEntry: DiaryEntry = {
      id: `dr_${Date.now()}`,
      title: title.trim() || 'Personal Reflection',
      content: content.trim(),
      date: 'Today, 21 Nov 2026',
      mood,
      tags: tagInput ? tagInput.split(',').map(t => t.trim()) : ['Personal'],
      isFavorite: false,
      isPrivate: true,
    };

    setEntries([newEntry, ...entries]);
    setTitle('');
    setContent('');
    setTagInput('');
    setShowNewModal(false);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
  };

  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || e.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Encrypted Personal Vault</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Private Sanctuary</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Private Diary & Quick Notes</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Your private thoughts, learning logs, and reflections. Completely isolated from employer visibility.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-cyan-glow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Private Entry</span>
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#10182A] border border-[#1E293B]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search private notes by title or keywords..."
            className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                selectedTag === t
                  ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300 font-semibold'
                  : 'bg-[#080D1B] border-[#1E293B] text-[#94A3B8] hover:bg-[#151F35]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Diary Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-semibold">
                      {entry.mood}
                    </span>
                    <span className="text-[10px] text-slate-500">{entry.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F8FAFC] mt-2">{entry.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleFavorite(entry.id)}
                    className={`p-1.5 rounded-lg hover:bg-[#151F35] transition-colors ${
                      entry.isFavorite ? 'text-amber-400' : 'text-[#64748B]'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-red-400 hover:bg-[#151F35] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 flex-wrap">
                {entry.tags.map(t => (
                  <span key={t} className="text-[10px] text-[#94A3B8] bg-[#080D1B] px-2 py-0.5 rounded border border-[#1E293B]">
                    #{t}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Private Only</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Entry Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#10182A] border border-[#1E293B] rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-base font-bold text-[#F8FAFC]">New Private Diary Entry</h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                🔒 Private Vault
              </span>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Concurrency models and reflections"
                  className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Mood Selector</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Energized', 'Focused', 'Reflective', 'Accomplished'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                        mood === m
                          ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                          : 'bg-[#080D1B] border-[#1E293B] text-[#94A3B8] hover:bg-[#151F35]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Content</label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your private entry..."
                  className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl p-3 text-xs text-[#F8FAFC] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Architecture, Rust, Ideas"
                  className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#151F35] text-xs text-[#94A3B8] font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium text-xs shadow-cyan-glow transition-all"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
