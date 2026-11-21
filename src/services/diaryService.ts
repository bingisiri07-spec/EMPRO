import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DiaryEntry } from '../types';
import { MOCK_DIARY_ENTRIES } from '../data/mockData';

export const diaryService = {
  /**
   * Fetches individual's private diary entries
   * Strictly isolated: Company administrators have 0 access
   */
  async getEntries(profileId?: string): Promise<DiaryEntry[]> {
    if (!isSupabaseConfigured() || !profileId) {
      return MOCK_DIARY_ENTRIES;
    }

    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_DIARY_ENTRIES;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      date: new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      mood: (item.mood || 'Reflective') as DiaryEntry['mood'],
      tags: item.tags || [],
      isFavorite: item.is_pinned || false,
      isPrivate: true,
    }));
  },

  /**
   * Creates a private diary entry
   */
  async createEntry(profileId: string, entry: { title: string; content: string; mood: string; tags: string[] }) {
    if (!isSupabaseConfigured()) {
      return { success: true, simulated: true };
    }

    const { data, error } = await supabase
      .from('diary_entries')
      .insert({
        profile_id: profileId,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
      })
      .select()
      .single();

    if (error) {
      console.error('Diary insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};
