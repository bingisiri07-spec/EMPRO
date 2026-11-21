import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { LeaveBalance, LeaveRequest } from '../types';
import { MOCK_LEAVE_BALANCES, MOCK_LEAVE_REQUESTS } from '../data/mockData';

export const leaveService = {
  /**
   * Fetches leave balances for an employee
   */
  async getLeaveBalances(memberId?: string): Promise<LeaveBalance> {
    if (!isSupabaseConfigured() || !memberId) {
      return MOCK_LEAVE_BALANCES;
    }

    const currentYear = new Date().getFullYear();
    const { data, error } = await supabase
      .from('leave_balances')
      .select(`
        allocated_days,
        used_days,
        pending_days,
        leave_types (code)
      `)
      .eq('member_id', memberId)
      .eq('year', currentYear);

    if (error || !data || data.length === 0) {
      return MOCK_LEAVE_BALANCES;
    }

    const balances: LeaveBalance = {
      casual: { available: 8, total: 12 },
      sick: { available: 7, total: 10 },
      earned: { available: 14, total: 18 },
      unpaid: { taken: 0 },
    };

    data.forEach((item: any) => {
      const code = item.leave_types?.code;
      const allocated = Number(item.allocated_days) || 0;
      const used = Number(item.used_days) || 0;
      const available = Math.max(0, allocated - used);

      if (code === 'CL') balances.casual = { available, total: allocated };
      if (code === 'SL') balances.sick = { available, total: allocated };
      if (code === 'EL') balances.earned = { available, total: allocated };
      if (code === 'UL') balances.unpaid = { taken: used };
    });

    return balances;
  },

  /**
   * Fetches leave requests
   */
  async getLeaveRequests(orgId: string, memberId?: string): Promise<LeaveRequest[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_LEAVE_REQUESTS;
    }

    let query = supabase
      .from('leave_requests')
      .select(`
        id,
        start_date,
        end_date,
        total_days,
        reason,
        status,
        created_at,
        leave_types (name, code),
        organization_members!leave_requests_member_id_fkey (
          employee_id,
          profiles (full_name)
        )
      `)
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return MOCK_LEAVE_REQUESTS;
    }

    return data.map((item: any) => {
      const typeCode = item.leave_types?.code;
      let typeName: LeaveRequest['type'] = 'Casual';
      if (typeCode === 'SL') typeName = 'Sick';
      if (typeCode === 'EL') typeName = 'Earned';
      if (typeCode === 'UL') typeName = 'Unpaid';

      return {
        id: item.id,
        employeeName: item.organization_members?.profiles?.full_name || 'Employee',
        employeeId: item.organization_members?.employee_id || 'NX-0000',
        type: typeName,
        startDate: item.start_date,
        endDate: item.end_date,
        days: Number(item.total_days),
        reason: item.reason,
        status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as LeaveRequest['status'],
        appliedDate: new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      };
    });
  },

  /**
   * Submits a new leave request
   */
  async submitLeaveRequest(payload: {
    orgId: string;
    memberId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
  }) {
    if (!isSupabaseConfigured()) {
      return { success: true, simulated: true };
    }

    const { data, error } = await supabase
      .from('leave_requests')
      .insert({
        organization_id: payload.orgId,
        member_id: payload.memberId,
        leave_type_id: payload.leaveTypeId,
        start_date: payload.startDate,
        end_date: payload.endDate,
        total_days: payload.totalDays,
        reason: payload.reason,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Leave submit error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};
