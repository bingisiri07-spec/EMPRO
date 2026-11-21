import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS } from '../data/mockData';

export const communityService = {
  /**
   * Fetches cross-company community feed
   */
  async getPosts(groupTag?: string): Promise<CommunityPost[]> {
    if (!isSupabaseConfigured()) {
      if (groupTag && groupTag !== 'All') {
        return MOCK_COMMUNITY_POSTS.filter(p => p.tags?.includes(groupTag));
      }
      return MOCK_COMMUNITY_POSTS;
    }

    let query = supabase
      .from('community_posts')
      .select(`
        id,
        title,
        content,
        group_tag,
        likes_count,
        comments_count,
        created_at,
        profiles (
          full_name,
          profile_photo
        )
      `)
      .order('created_at', { ascending: false });

    if (groupTag && groupTag !== 'All') {
      query = query.eq('group_tag', groupTag as any);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return MOCK_COMMUNITY_POSTS;
    }

    return data.map((item: any) => ({
      id: item.id,
      authorName: item.profiles?.full_name || 'Community Member',
      authorCompany: 'Nexus Technologies',
      authorRole: 'Engineer',
      authorAvatar: item.profiles?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      content: item.content,
      tags: [item.group_tag],
      likes: item.likes_count,
      commentsCount: item.comments_count,
      timestamp: new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      userLiked: false,
    }));
  },

  /**
   * Publishes a new cross-company community post
   */
  async createPost(authorProfileId: string, post: {
    title: string;
    content: string;
    groupTag: 'General' | 'Engineering' | 'AI/ML' | 'Design' | 'Leadership' | 'Entrepreneurship' | 'Career';
  }) {
    if (!isSupabaseConfigured()) {
      return { success: true, simulated: true };
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        author_profile_id: authorProfileId,
        title: post.title,
        content: post.content,
        group_tag: post.groupTag,
      })
      .select()
      .single();

    if (error) {
      console.error('Community post error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};
