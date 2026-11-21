import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Send 
} from 'lucide-react';
import { CommunityPost } from '../../types';
import { MOCK_COMMUNITY_POSTS } from '../../data/mockData';

export const CommunityModule: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const groups = ['All', 'Engineering', 'AI-ML', 'Architecture', 'Design', 'Leadership'];

  const handleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.userLiked ? p.likes - 1 : p.likes + 1,
          userLiked: !p.userLiked
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityPost = {
      id: `cp_${Date.now()}`,
      authorName: 'Alex Rivera',
      authorCompany: 'Nexus Technologies Ltd',
      authorRole: 'Lead Frontend Engineer',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      content: newPostText.trim(),
      tags: ['Engineering', 'Architecture'],
      likes: 1,
      commentsCount: 0,
      timestamp: 'Just now',
      userLiked: true,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cross-Company Professional Exchange</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Employee-Owned Community</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">EMPRO Community Hub</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Connect with professionals across companies. Your connections and network persist across employer transitions.
          </p>
        </div>
      </div>

      {/* Group Tags Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {groups.map(group => (
          <button
            key={group}
            onClick={() => setSelectedTag(group)}
            className={`text-xs px-3.5 py-1.5 rounded-xl border transition-colors shrink-0 ${
              selectedTag === group
                ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-blue-glow'
                : 'bg-[#10182A] border-[#1E293B] text-[#94A3B8] hover:bg-[#151F35]'
            }`}
          >
            #{group}
          </button>
        ))}
      </div>

      {/* Share a Thought Form */}
      <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-3">
        <textarea
          rows={3}
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="Share an insight, question, or discussion point with the cross-company community..."
          className="w-full bg-[#080D1B] border border-[#1E293B] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-cyan-500 focus:outline-none"
        />
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[#94A3B8]">
            Posting as: <strong className="text-[#F8FAFC]">Alex Rivera (Nexus Technologies)</strong>
          </span>
          <button
            type="submit"
            disabled={!newPostText.trim()}
            className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-blue-glow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Post</span>
          </button>
        </div>
      </form>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-3">
            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-blue-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#F8FAFC]">{post.authorName}</h4>
                    <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/40">
                      {post.authorCompany}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8]">{post.authorRole} • {post.timestamp}</p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-xs text-[#F8FAFC] leading-relaxed">
              {post.content}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-1.5 pt-1">
              {post.tags.map(tag => (
                <span key={tag} className="text-[10px] text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/30">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-[#1E293B] flex items-center gap-6 text-xs text-[#94A3B8]">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.userLiked ? 'text-red-400 font-semibold' : 'hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>{post.commentsCount} comments</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors ml-auto">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
