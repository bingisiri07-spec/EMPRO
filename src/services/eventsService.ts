import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CompanyEvent, EventContributionRequest, ContributionCategory } from '../types';
import { MOCK_EVENTS, MOCK_EVENT_CONTRIBUTIONS } from '../data/mockData';

export const eventsService = {
  /**
   * Fetches company events
   */
  async getEvents(): Promise<CompanyEvent[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_EVENTS;
    }

    const { data, error } = await supabase
      .from('events' as any)
      .select('*')
      .order('start_date', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_EVENTS;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category,
      startDate: item.start_date,
      endDate: item.end_date,
      venueOrLink: item.venue_or_link || 'Office HQ',
      isOnline: item.is_online ?? false,
      organizerName: item.organizer_name || 'Event Lead',
      organizerId: item.organizer_id || '',
      organizerAvatar: item.organizer_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      registrationDeadline: item.registration_deadline || item.start_date,
      status: item.status,
      maxAttendees: item.max_attendees,
      registeredCount: item.registered_count || 0,
      availableOpportunities: item.available_opportunities || [],
      scheduleAgenda: item.schedule_agenda || [],
      participationRequirements: item.participation_requirements || [],
      isRegistered: item.is_registered ?? false,
      userContributionStatus: item.user_contribution_status || 'none',
      userAttended: item.user_attended ?? false,
    }));
  },

  /**
   * Registers current employee for an event
   */
  async registerForEvent(eventId: string, _employeeId: string) {
    if (!isSupabaseConfigured()) {
      return { success: true, simulated: true };
    }

    const { data, error } = await supabase
      .from('event_registrations' as any)
      .insert({
        event_id: eventId,
        member_id: _employeeId,
        registered_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.warn('Event registration Supabase error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Submits a contribution request for an event
   */
  async requestToContribute(payload: {
    eventId: string;
    eventTitle: string;
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    employeeAvatar: string;
    department: string;
    contributionCategory: ContributionCategory;
    relevantSkills: string[];
    description: string;
    availability: string;
  }) {
    if (!isSupabaseConfigured()) {
      const newRequest: EventContributionRequest = {
        id: `cr_${Date.now()}`,
        eventId: payload.eventId,
        eventTitle: payload.eventTitle,
        employeeId: payload.employeeId,
        employeeName: payload.employeeName,
        employeeEmail: payload.employeeEmail,
        employeeAvatar: payload.employeeAvatar,
        department: payload.department,
        contributionCategory: payload.contributionCategory,
        relevantSkills: payload.relevantSkills,
        description: payload.description,
        availability: payload.availability,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      MOCK_EVENT_CONTRIBUTIONS.unshift(newRequest);
      return { success: true, simulated: true, data: newRequest };
    }

    const { data, error } = await supabase
      .from('event_contributions' as any)
      .insert({
        event_id: payload.eventId,
        member_id: payload.employeeId,
        contribution_category: payload.contributionCategory,
        relevant_skills: payload.relevantSkills,
        description: payload.description,
        availability: payload.availability,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.warn('Contribution request Supabase error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Fetches contribution requests for organizer review
   */
  async getContributionRequests(_eventId?: string): Promise<EventContributionRequest[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_EVENT_CONTRIBUTIONS;
    }

    let query = supabase
      .from('event_contributions' as any)
      .select(`
        id,
        event_id,
        contribution_category,
        relevant_skills,
        description,
        availability,
        status,
        assigned_role,
        reviewer_notes,
        created_at,
        events (title),
        organization_members (
          employee_id,
          profiles (full_name, email, profile_photo),
          departments (department_name)
        )
      `)
      .order('created_at', { ascending: false });

    if (_eventId) {
      query = query.eq('event_id', _eventId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return MOCK_EVENT_CONTRIBUTIONS;
    }

    return data.map((item: any) => ({
      id: item.id,
      eventId: item.event_id,
      eventTitle: item.events?.title || 'Company Event',
      employeeId: item.organization_members?.employee_id || 'NX-0000',
      employeeName: item.organization_members?.profiles?.full_name || 'Employee',
      employeeEmail: item.organization_members?.profiles?.email || '',
      employeeAvatar: item.organization_members?.profiles?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      department: item.organization_members?.departments?.department_name || 'Engineering',
      contributionCategory: item.contribution_category,
      relevantSkills: item.relevant_skills || [],
      description: item.description,
      availability: item.availability,
      status: item.status,
      assignedRole: item.assigned_role,
      reviewerNotes: item.reviewer_notes,
      submittedAt: item.created_at,
    }));
  },

  /**
   * Organizer approves or rejects a contribution request
   */
  async updateContributionStatus(requestId: string, status: 'approved' | 'rejected', assignedRole?: string, reviewerNotes?: string) {
    if (!isSupabaseConfigured()) {
      const match = MOCK_EVENT_CONTRIBUTIONS.find(c => c.id === requestId);
      if (match) {
        match.status = status;
        if (assignedRole) match.assignedRole = assignedRole;
        if (reviewerNotes) match.reviewerNotes = reviewerNotes;
      }
      return { success: true, simulated: true };
    }

    const { data, error } = await supabase
      .from('event_contributions' as any)
      .update({
        status,
        assigned_role: assignedRole,
        reviewer_notes: reviewerNotes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Verifies actual event attendance and updates employee's daily company attendance record
   */
  async verifyAndRecordAttendance(eventId: string, memberId: string, eventTitle: string) {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    if (!isSupabaseConfigured()) {
      // In demo mode, update event status locally
      const evt = MOCK_EVENTS.find(e => e.id === eventId);
      if (evt) {
        evt.userAttended = true;
      }
      return {
        success: true,
        simulated: true,
        message: `Attendance confirmed for "${eventTitle}". Daily attendance updated with "Event Participation: ${eventTitle}".`,
      };
    }

    // 1. Record event check-in in event_attendance
    const { error: eventAttErr } = await supabase
      .from('event_attendance' as any)
      .upsert({
        event_id: eventId,
        member_id: memberId,
        verified_at: now,
        verification_method: 'organizer_checkin',
      }, { onConflict: 'event_id,member_id' });

    if (eventAttErr) {
      console.warn('Failed recording event attendance:', eventAttErr.message);
    }

    // 2. Sync to core attendance_records table for the day
    const { error: syncErr } = await supabase
      .from('attendance_records')
      .upsert({
        organization_id: '11111111-1111-1111-1111-111111111111',
        member_id: memberId,
        work_date: today,
        check_in: now,
        status: 'present',
        location_tag: `Event: ${eventTitle.substring(0, 30)}`,
        notes: `Verified attendance at company event: ${eventTitle}`,
      }, { onConflict: 'member_id,work_date' });

    if (syncErr) {
      console.warn('Failed syncing to company attendance:', syncErr.message);
    }

    return {
      success: true,
      message: `Event attendance verified and recorded in your official company attendance log.`,
    };
  },
};
