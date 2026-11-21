import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AttendanceRecord } from '../types';
import { MOCK_ATTENDANCE_WEEK } from '../data/mockData';

export const attendanceService = {
  /**
   * Fetches monthly attendance history for an employee
   */
  async getAttendanceHistory(memberId?: string): Promise<AttendanceRecord[]> {
    if (!isSupabaseConfigured() || !memberId) {
      return MOCK_ATTENDANCE_WEEK;
    }

    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('member_id', memberId)
      .order('work_date', { ascending: false })
      .limit(30);

    if (error || !data || data.length === 0) {
      return MOCK_ATTENDANCE_WEEK;
    }

    return data.map((record: any) => {
      const dateObj = new Date(record.work_date);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return {
        date: record.work_date,
        day: dayNames[dateObj.getDay()],
        checkIn: record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
        checkOut: record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
        hoursWorked: Number(record.total_hours) || 0,
        expectedHours: 8.5,
        status: (record.status.charAt(0).toUpperCase() + record.status.slice(1)) as AttendanceRecord['status'],
        locationTag: record.location_tag || 'Office HQ',
      };
    });
  },

  /**
   * Records daily check-in
   */
  async checkIn(orgId: string, memberId: string, locationTag = 'Office HQ (Verified)') {
    if (!isSupabaseConfigured()) {
      return { success: true, timestamp: new Date().toISOString(), simulated: true };
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('attendance_records')
      .upsert({
        organization_id: orgId,
        member_id: memberId,
        work_date: today,
        check_in: now,
        status: 'present',
        location_tag: locationTag,
      }, { onConflict: 'member_id,work_date' })
      .select()
      .single();

    if (error) {
      console.error('Check-in error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Records daily check-out
   */
  async checkOut(memberId: string) {
    if (!isSupabaseConfigured()) {
      return { success: true, timestamp: new Date().toISOString(), simulated: true };
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('attendance_records')
      .update({
        check_out: now,
      })
      .eq('member_id', memberId)
      .eq('work_date', today)
      .select()
      .single();

    if (error) {
      console.error('Check-out error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};
