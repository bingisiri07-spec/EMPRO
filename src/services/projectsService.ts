import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CompanyProject, RecommendedContributor, ProjectContributionRecord, ContributionAllocationMode } from '../types';
import { aiIntelligenceService } from './aiIntelligenceService';
import { MOCK_PROJECTS, MOCK_PROJECT_CONTRIBUTIONS } from '../data/mockData';

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
   * with multi-dimensional scoring and cross-organization isolation.
   */
  async discoverRecommendedContributors(projectId: string, _roleTitle?: string, userOrgId?: string): Promise<RecommendedContributor[]> {
    return aiIntelligenceService.matchProjectContributors(projectId, userOrgId);
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

  /**
   * Creates a new company project
   */
  async createProject(payload: {
    organizationId: string;
    name: string;
    description: string;
    department?: string;
    projectManagerId?: string;
    startDate?: string;
    expectedCompletionDate: string;
    requiredSkills?: string[];
    objectives?: string[];
    isRequiringContributors?: boolean;
    openRolesNeeded?: any[];
  }) {
    const newProject: CompanyProject = {
      id: `proj_${Date.now()}`,
      name: payload.name,
      description: payload.description,
      department: payload.department || 'Engineering',
      projectManager: 'Project Lead',
      projectManagerId: payload.projectManagerId || 'lead_01',
      projectManagerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      startDate: payload.startDate || new Date().toISOString().split('T')[0],
      expectedCompletionDate: payload.expectedCompletionDate,
      status: 'active',
      progressPercentage: 0,
      teamMembers: [],
      requiredSkills: payload.requiredSkills || [],
      objectives: payload.objectives || [],
      milestones: [],
      isRequiringContributors: payload.isRequiringContributors ?? false,
      openRolesNeeded: payload.openRolesNeeded || [],
    };

    if (!isSupabaseConfigured()) {
      MOCK_PROJECTS.unshift(newProject);
      return { success: true, simulated: true, data: newProject };
    }

    const { data, error } = await supabase
      .from('projects' as any)
      .insert({
        organization_id: payload.organizationId,
        name: payload.name,
        description: payload.description,
        department: payload.department || 'Engineering',
        project_manager_id: payload.projectManagerId,
        start_date: payload.startDate || new Date().toISOString().split('T')[0],
        expected_completion_date: payload.expectedCompletionDate,
        status: 'active',
        progress_percentage: 0,
        required_skills: payload.requiredSkills || [],
        objectives: payload.objectives || [],
        is_requiring_contributors: payload.isRequiringContributors ?? false,
        open_roles_needed: payload.openRolesNeeded || [],
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Adds or assigns a team member to a project
   */
  async addProjectMember(projectId: string, memberId: string, role = 'Contributor', allocationPercentage = 50) {
    if (!isSupabaseConfigured()) {
      return { success: true, simulated: true };
    }

    const { data, error } = await supabase
      .from('project_members' as any)
      .upsert({
        project_id: projectId,
        member_id: memberId,
        role,
        allocation_percentage: allocationPercentage,
      }, { onConflict: 'project_id,member_id' })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};
