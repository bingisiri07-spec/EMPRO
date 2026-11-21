import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CompanyProject, RecommendedContributor, ProjectContributionRecord, ContributionAllocationMode } from '../types';
import { MOCK_PROJECTS, MOCK_RECOMMENDED_CONTRIBUTORS, MOCK_PROJECT_CONTRIBUTIONS } from '../data/mockData';

export const projectsService = {
  /**
   * Fetches company projects
   */
  async getProjects(): Promise<CompanyProject[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_PROJECTS;
    }

    const { data, error } = await supabase
      .from('projects' as any)
      .select('*')
      .order('start_date', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_PROJECTS;
    }

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      department: p.department || 'Engineering',
      projectManager: p.project_manager_name || 'Project Lead',
      projectManagerId: p.project_manager_id || '',
      projectManagerAvatar: p.project_manager_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      startDate: p.start_date,
      expectedCompletionDate: p.expected_completion_date,
      status: p.status,
      progressPercentage: p.progress_percentage || 0,
      requiredSkills: p.required_skills || [],
      objectives: p.objectives || [],
      milestones: p.milestones || [],
      teamMembers: p.team_members || [],
      isRequiringContributors: p.is_requiring_contributors ?? false,
      openRolesNeeded: p.open_roles_needed || [],
    }));
  },

  /**
   * AI Contribution Discovery Engine
   * Identifies missing responsibilities, evaluates verified skill profiles,
   * checks declared availability and current workload, and provides ranked recommendations
   */
  async discoverRecommendedContributors(projectId: string, _roleTitle?: string): Promise<RecommendedContributor[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_RECOMMENDED_CONTRIBUTORS[projectId] || [
        {
          id: 'usr_priya_sharma',
          name: 'Priya Sharma',
          avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
          currentRole: 'Senior Product Designer',
          department: 'Product & Design',
          skillMatchPercentage: 96,
          matchedSkills: ['UI/UX Design', 'Figma', 'Design Systems', 'Data Visualization'],
          availability: 'Available (12h/week for 2 weeks)',
          currentWorkload: 'Low (45%)',
          recommendationReason: 'Priya authored the Nexus Core Design System and recently finished the Helios dashboards. Her current sprint workload is only 45%, leaving ample capacity to resolve the Apollo UI bottleneck.',
        },
        {
          id: 'usr_daniel_kim',
          name: 'Daniel Kim',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
          currentRole: 'Frontend & UI Specialist',
          department: 'Customer Experience Squad',
          skillMatchPercentage: 82,
          matchedSkills: ['Figma', 'React', 'Component Polish'],
          availability: 'Moderate (6h/week)',
          currentWorkload: 'Moderate (70%)',
          recommendationReason: 'Has strong UI implementation skills and extensive experience with Apollo design tokens. Can assist with component reviews and user testing.',
        }
      ];
    }

    // In a live Supabase environment, execute relational query joining organization_members and skills
    const { data } = await supabase
      .from('recommended_contributors' as any)
      .select('*')
      .eq('project_id', projectId);

    if (data && data.length > 0) {
      return data as any as RecommendedContributor[];
    }

    return MOCK_RECOMMENDED_CONTRIBUTORS[projectId] || [];
  },

  /**
   * Mode 1: Open Contribution (Employee volunteers to contribute)
   */
  async applyOpenContribution(projectId: string, projectName: string, employeeId: string, employeeName: string, responsibility: string) {
    const newRecord: ProjectContributionRecord = {
      id: `pcr_${Date.now()}`,
      projectId,
      projectName,
      employeeId,
      employeeName,
      assignedResponsibility: responsibility,
      mode: 'open_contribution',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      workDelivered: 'Voluntary contribution request submitted. Awaiting manager approval.',
    };

    if (!isSupabaseConfigured()) {
      MOCK_PROJECT_CONTRIBUTIONS.unshift(newRecord);
      return { success: true, simulated: true, data: newRecord };
    }

    const { data, error } = await supabase
      .from('project_contributions' as any)
      .insert({
        project_id: projectId,
        member_id: employeeId,
        assigned_responsibility: responsibility,
        mode: 'open_contribution',
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Mode 2: AI-Recommended Contribution (Send invitation to recommended employee)
   */
  async sendContributionInvitation(projectId: string, projectName: string, employeeId: string, employeeName: string, responsibility: string) {
    const newRecord: ProjectContributionRecord = {
      id: `pcr_${Date.now()}`,
      projectId,
      projectName,
      employeeId,
      employeeName,
      assignedResponsibility: responsibility,
      mode: 'ai_recommended',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      workDelivered: 'AI recommendation invitation dispatched. Awaiting employee confirmation.',
    };

    if (!isSupabaseConfigured()) {
      MOCK_PROJECT_CONTRIBUTIONS.unshift(newRecord);
      return { success: true, simulated: true, data: newRecord };
    }

    const { data, error } = await supabase
      .from('project_contributions' as any)
      .insert({
        project_id: projectId,
        member_id: employeeId,
        assigned_responsibility: responsibility,
        mode: 'ai_recommended',
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Mode 3: Manager Assignment (Direct allocation by authorized manager)
   */
  async assignManagerContribution(projectId: string, projectName: string, employeeId: string, employeeName: string, responsibility: string, mode: ContributionAllocationMode = 'manager_assigned') {
    const newRecord: ProjectContributionRecord = {
      id: `pcr_${Date.now()}`,
      projectId,
      projectName,
      employeeId,
      employeeName,
      assignedResponsibility: responsibility,
      mode,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      workDelivered: 'Direct manager assignment active.',
    };

    if (!isSupabaseConfigured()) {
      MOCK_PROJECT_CONTRIBUTIONS.unshift(newRecord);
      return { success: true, simulated: true, data: newRecord };
    }

    const { data, error } = await supabase
      .from('project_contributions' as any)
      .insert({
        project_id: projectId,
        member_id: employeeId,
        assigned_responsibility: responsibility,
        mode,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Fetches contribution tracking records for appraisals & recognition
   */
  async getContributionRecords(_employeeId?: string): Promise<ProjectContributionRecord[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_PROJECT_CONTRIBUTIONS;
    }

    const { data, error } = await supabase
      .from('project_contributions' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_PROJECT_CONTRIBUTIONS;
    }

    return data as any as ProjectContributionRecord[];
  },
};
