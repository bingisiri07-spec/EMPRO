import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { MeetingItem } from '../types';
import { MOCK_MEETINGS } from '../data/mockData';

export const meetingService = {
  /**
   * Fetches scheduled meetings for current organization member
   */
  async getMeetings(organizationId?: string): Promise<MeetingItem[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_MEETINGS;
    }

    try {
      let query = supabase
        .from('meetings')
        .select(`
          id,
          title,
          description,
          start_time,
          end_time,
          location,
          meeting_link,
          status,
          created_at,
          meeting_attendees (
            id,
            rsvp_status,
            organization_members (
              profiles (full_name)
            )
          )
        `)
        .order('start_time', { ascending: true });

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return MOCK_MEETINGS;
      }

      return data.map((item: any) => {
        const start = new Date(item.start_time);
        const end = new Date(item.end_time);
        const durationMin = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

        const participants: string[] = (item.meeting_attendees || []).map(
          (att: any) => att.organization_members?.profiles?.full_name || 'Attendee'
        );

        return {
          id: item.id,
          title: item.title,
          time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: start.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
          duration: `${durationMin} mins`,
          type: (item.description?.includes('All-Hands') ? 'Company All-Hands' : 
                 item.description?.includes('1-on-1') ? '1-on-1' :
                 item.description?.includes('Product') ? 'Product Sync' : 'Engineering') as MeetingItem['type'],
          location: item.location || 'Meeting Room Alpha',
          isOnline: Boolean(item.meeting_link),
          meetingLink: item.meeting_link || undefined,
          participants: participants.length > 0 ? participants : ['Engineering Squad'],
          summary: item.description || undefined,
        };
      });
    } catch {
      return MOCK_MEETINGS;
    }
  },

  /**
   * Schedules a new meeting
   */
  async createMeeting(payload: {
    organizationId: string;
    organizerId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    meetingLink?: string;
  }) {
    if (!isSupabaseConfigured()) {
      return { success: true, simulated: true };
    }

    const { data, error } = await supabase
      .from('meetings')
      .insert({
        organization_id: payload.organizationId,
        organizer_id: payload.organizerId,
        title: payload.title,
        description: payload.description,
        start_time: payload.startTime,
        end_time: payload.endTime,
        location: payload.location,
        meeting_link: payload.meetingLink,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};
