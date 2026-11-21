import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Persona } from '../types';
import { DEMO_PERSONAS } from '../data/mockData';

export const organizationService = {
  /**
   * Fetches the active organization details
   */
  async getOrganization(orgId: string) {
    if (!isSupabaseConfigured()) {
      return {
        id: orgId,
        organization_name: 'Nexus Technologies Ltd',
        industry: 'Enterprise Software & AI Platform',
        company_size: '500-1000 employees',
        logo_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=250',
      };
    }

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .maybeSingle();

    if (error) {
      console.warn('Failed to fetch organization from Supabase, using mock:', error.message);
      return {
        id: orgId,
        organization_name: 'Nexus Technologies Ltd',
        industry: 'Enterprise Software & AI Platform',
        company_size: '500-1000 employees',
        logo_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=250',
      };
    }

    return data;
  },

  /**
   * Fetches members for an organization
   */
  async getMembers(orgId: string): Promise<Persona[]> {
    if (!isSupabaseConfigured()) {
      return Object.values(DEMO_PERSONAS);
    }

    const { data, error } = await supabase
      .from('organization_members')
      .select(`
        id,
        employee_id,
        role,
        employment_status,
        joining_date,
        profiles (
          id,
          full_name,
          email,
          profile_photo
        ),
        departments (
          department_name
        ),
        designations (
          designation_name
        ),
        organizations (
          id,
          organization_name
        )
      `)
      .eq('organization_id', orgId);

    if (error || !data || data.length === 0) {
      return Object.values(DEMO_PERSONAS);
    }

    return data.map((item: any) => ({
      id: item.profiles?.id || item.id,
      name: item.profiles?.full_name || 'Team Member',
      email: item.profiles?.email || '',
      role: item.role as Persona['role'],
      roleLabel: item.designations?.designation_name || item.role,
      avatar: item.profiles?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      designation: item.designations?.designation_name || 'Engineer',
      department: item.departments?.department_name || 'Engineering',
      employeeId: item.employee_id,
      company: item.organizations?.organization_name || 'Nexus Technologies',
      companyId: item.organizations?.id || orgId,
      joinedDate: item.joining_date,
      employmentStatus: item.employment_status === 'active' ? 'Active' : 'On Leave',
      workEmail: item.profiles?.email || '',
      personalEmail: item.profiles?.email || '',
      location: 'Bangalore, India',
    }));
  },
};
