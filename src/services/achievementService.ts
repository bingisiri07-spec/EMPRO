import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AchievementItem, AchievementVisibility } from '../types';
import { MOCK_ACHIEVEMENTS } from '../data/mockData';

export const achievementService = {
  /**
   * Fetches achievements with respect to 4-tier visibility
   */
  async getAchievements(profileId?: string): Promise<AchievementItem[]> {
    if (!isSupabaseConfigured() || !profileId) {
      return MOCK_ACHIEVEMENTS;
    }

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_ACHIEVEMENTS;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      date: item.issue_date || '2024',
      category: (item.category.charAt(0).toUpperCase() + item.category.slice(1)) as AchievementItem['category'],
      visibility: item.visibility as AchievementVisibility,
      credentialId: item.credential_id || undefined,
      description: item.title,
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    }));
  },

  /**
   * Creates a new portable achievement
   */
  async createAchievement(profileId: string, item: {
    title: string;
    issuer: string;
    issueDate?: string;
    category: 'certification' | 'award' | 'publication' | 'patent' | 'project' | 'education';
    visibility: AchievementVisibility;
    credentialId?: string;
    credentialUrl?: string;
  }) {
    if (!isSupabaseConfigured()) {
      return { success: true, simulated: true };
    }

    const { data, error } = await supabase
      .from('achievements')
      .insert({
        profile_id: profileId,
        title: item.title,
        issuer: item.issuer,
        issue_date: item.issueDate,
        category: item.category,
        visibility: item.visibility,
        credential_id: item.credentialId,
        credential_url: item.credentialUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Achievement insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};
