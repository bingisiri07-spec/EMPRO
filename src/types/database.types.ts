export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'employee' | 'manager' | 'hr' | 'admin';
export type EmploymentStatus = 'active' | 'probation' | 'notice_period' | 'terminated' | 'resigned';
export type AttendanceStatus = 'present' | 'late' | 'half_day' | 'absent' | 'on_leave' | 'holiday';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type PayslipStatus = 'draft' | 'published' | 'paid';
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type RsvpStatus = 'invited' | 'accepted' | 'declined' | 'tentative';
export type DocumentCategory = 'policy' | 'handbook' | 'template' | 'compliance' | 'letter';
export type AchievementCategory = 'certification' | 'award' | 'publication' | 'patent' | 'project' | 'education';
export type AchievementVisibility = 'private' | 'connections' | 'company' | 'public';
export type LifeGoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';
export type CommunityGroupTag = 'General' | 'Engineering' | 'AI/ML' | 'Design' | 'Leadership' | 'Entrepreneurship' | 'Career';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          profile_photo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          email: string;
          phone?: string | null;
          profile_photo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          profile_photo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          organization_name: string;
          organization_email: string | null;
          industry: string | null;
          company_size: string | null;
          logo_url: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_name: string;
          organization_email?: string | null;
          industry?: string | null;
          company_size?: string | null;
          logo_url?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_name?: string;
          organization_email?: string | null;
          industry?: string | null;
          company_size?: string | null;
          logo_url?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          id: string;
          organization_id: string;
          department_name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          department_name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          department_name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      designations: {
        Row: {
          id: string;
          organization_id: string;
          designation_name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          designation_name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          designation_name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          profile_id: string;
          employee_id: string;
          department_id: string | null;
          designation_id: string | null;
          role: UserRole;
          employment_status: EmploymentStatus;
          joining_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          profile_id: string;
          employee_id: string;
          department_id?: string | null;
          designation_id?: string | null;
          role?: UserRole;
          employment_status?: EmploymentStatus;
          joining_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          profile_id?: string;
          employee_id?: string;
          department_id?: string | null;
          designation_id?: string | null;
          role?: UserRole;
          employment_status?: EmploymentStatus;
          joining_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      attendance_records: {
        Row: {
          id: string;
          organization_id: string;
          member_id: string;
          work_date: string;
          check_in: string | null;
          check_out: string | null;
          total_hours: number;
          status: AttendanceStatus;
          location_tag: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          member_id: string;
          work_date?: string;
          check_in?: string | null;
          check_out?: string | null;
          total_hours?: number;
          status?: AttendanceStatus;
          location_tag?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          member_id?: string;
          work_date?: string;
          check_in?: string | null;
          check_out?: string | null;
          total_hours?: number;
          status?: AttendanceStatus;
          location_tag?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leave_types: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          code: string;
          default_days_per_year: number;
          is_paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          code: string;
          default_days_per_year?: number;
          is_paid?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          code?: string;
          default_days_per_year?: number;
          is_paid?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      leave_balances: {
        Row: {
          id: string;
          member_id: string;
          leave_type_id: string;
          year: number;
          allocated_days: number;
          used_days: number;
          pending_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          leave_type_id: string;
          year: number;
          allocated_days?: number;
          used_days?: number;
          pending_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          leave_type_id?: string;
          year?: number;
          allocated_days?: number;
          used_days?: number;
          pending_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leave_requests: {
        Row: {
          id: string;
          organization_id: string;
          member_id: string;
          leave_type_id: string;
          start_date: string;
          end_date: string;
          total_days: number;
          reason: string;
          status: LeaveStatus;
          reviewed_by: string | null;
          review_comment: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          member_id: string;
          leave_type_id: string;
          start_date: string;
          end_date: string;
          total_days: number;
          reason: string;
          status?: LeaveStatus;
          reviewed_by?: string | null;
          review_comment?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          member_id?: string;
          leave_type_id?: string;
          start_date?: string;
          end_date?: string;
          total_days?: number;
          reason?: string;
          status?: LeaveStatus;
          reviewed_by?: string | null;
          review_comment?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      salary_structures: {
        Row: {
          id: string;
          member_id: string;
          effective_from: string;
          currency: string;
          basic_salary: number;
          hra: number;
          special_allowances: number;
          pf_deduction: number;
          tax_deduction: number;
          medical_insurance: number;
          gross_salary: number;
          net_salary: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          effective_from?: string;
          currency?: string;
          basic_salary?: number;
          hra?: number;
          special_allowances?: number;
          pf_deduction?: number;
          tax_deduction?: number;
          medical_insurance?: number;
          gross_salary?: number;
          net_salary?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          effective_from?: string;
          currency?: string;
          basic_salary?: number;
          hra?: number;
          special_allowances?: number;
          pf_deduction?: number;
          tax_deduction?: number;
          medical_insurance?: number;
          gross_salary?: number;
          net_salary?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payslips: {
        Row: {
          id: string;
          organization_id: string;
          member_id: string;
          month: number;
          year: number;
          issue_date: string;
          currency: string;
          basic_salary: number;
          hra: number;
          allowances: number;
          gross_pay: number;
          pf_deduction: number;
          tax_deduction: number;
          other_deductions: number;
          net_pay: number;
          status: PayslipStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          member_id: string;
          month: number;
          year: number;
          issue_date?: string;
          currency?: string;
          basic_salary?: number;
          hra?: number;
          allowances?: number;
          gross_pay?: number;
          pf_deduction?: number;
          tax_deduction?: number;
          other_deductions?: number;
          net_pay?: number;
          status?: PayslipStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          member_id?: string;
          month?: number;
          year?: number;
          issue_date?: string;
          currency?: string;
          basic_salary?: number;
          hra?: number;
          allowances?: number;
          gross_pay?: number;
          pf_deduction?: number;
          tax_deduction?: number;
          other_deductions?: number;
          net_pay?: number;
          status?: PayslipStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      meetings: {
        Row: {
          id: string;
          organization_id: string;
          organizer_id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string;
          meeting_link: string | null;
          location: string | null;
          status: MeetingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          organizer_id: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time: string;
          meeting_link?: string | null;
          location?: string | null;
          status?: MeetingStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          organizer_id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string;
          meeting_link?: string | null;
          location?: string | null;
          status?: MeetingStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      meeting_attendees: {
        Row: {
          id: string;
          meeting_id: string;
          member_id: string;
          rsvp_status: RsvpStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          member_id: string;
          rsvp_status?: RsvpStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          member_id?: string;
          rsvp_status?: RsvpStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      corporate_documents: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          category: DocumentCategory;
          file_url: string;
          file_size: string | null;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          category: DocumentCategory;
          file_url: string;
          file_size?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          category?: DocumentCategory;
          file_url?: string;
          file_size?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      diary_entries: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          content: string;
          mood: string | null;
          tags: string[];
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          content?: string;
          mood?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          content?: string;
          mood?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          issuer: string;
          issue_date: string | null;
          credential_id: string | null;
          credential_url: string | null;
          category: AchievementCategory;
          visibility: AchievementVisibility;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          issuer: string;
          issue_date?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          category: AchievementCategory;
          visibility?: AchievementVisibility;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          issuer?: string;
          issue_date?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          category?: AchievementCategory;
          visibility?: AchievementVisibility;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      life_goals: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          category: string;
          target_date: string | null;
          progress_percent: number;
          status: LifeGoalStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          category?: string;
          target_date?: string | null;
          progress_percent?: number;
          status?: LifeGoalStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          category?: string;
          target_date?: string | null;
          progress_percent?: number;
          status?: LifeGoalStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      community_posts: {
        Row: {
          id: string;
          author_profile_id: string;
          title: string;
          content: string;
          group_tag: CommunityGroupTag;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_profile_id: string;
          title: string;
          content: string;
          group_tag?: CommunityGroupTag;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_profile_id?: string;
          title?: string;
          content?: string;
          group_tag?: CommunityGroupTag;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      community_comments: {
        Row: {
          id: string;
          post_id: string;
          author_profile_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_profile_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_profile_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string;
          category: string;
          start_date: string;
          end_date: string;
          venue_or_link: string;
          is_online: boolean;
          organizer_id: string | null;
          registration_deadline: string;
          status: string;
          max_attendees: number | null;
          available_opportunities: string[];
          schedule_agenda: Json;
          participation_requirements: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          description?: string;
          category: string;
          start_date: string;
          end_date: string;
          venue_or_link?: string;
          is_online?: boolean;
          organizer_id?: string | null;
          registration_deadline: string;
          status?: string;
          max_attendees?: number | null;
          available_opportunities?: string[];
          schedule_agenda?: Json;
          participation_requirements?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          description?: string;
          category?: string;
          start_date?: string;
          end_date?: string;
          venue_or_link?: string;
          is_online?: boolean;
          organizer_id?: string | null;
          registration_deadline?: string;
          status?: string;
          max_attendees?: number | null;
          available_opportunities?: string[];
          schedule_agenda?: Json;
          participation_requirements?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          member_id: string;
          registered_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          member_id: string;
          registered_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          member_id?: string;
          registered_at?: string;
        };
        Relationships: [];
      };
      event_contributions: {
        Row: {
          id: string;
          event_id: string;
          member_id: string;
          contribution_category: string;
          relevant_skills: string[];
          description: string;
          availability: string;
          status: string;
          assigned_role: string | null;
          reviewer_notes: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          member_id: string;
          contribution_category: string;
          relevant_skills?: string[];
          description?: string;
          availability?: string;
          status?: string;
          assigned_role?: string | null;
          reviewer_notes?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          member_id?: string;
          contribution_category?: string;
          relevant_skills?: string[];
          description?: string;
          availability?: string;
          status?: string;
          assigned_role?: string | null;
          reviewer_notes?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_attendance: {
        Row: {
          id: string;
          event_id: string;
          member_id: string;
          verified_at: string;
          verification_method: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          member_id: string;
          verified_at?: string;
          verification_method?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          member_id?: string;
          verified_at?: string;
          verification_method?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string;
          department: string;
          project_manager_id: string | null;
          start_date: string;
          expected_completion_date: string;
          status: string;
          progress_percentage: number;
          required_skills: string[];
          objectives: string[];
          milestones: Json;
          is_requiring_contributors: boolean;
          open_roles_needed: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string;
          department?: string;
          project_manager_id?: string | null;
          start_date?: string;
          expected_completion_date: string;
          status?: string;
          progress_percentage?: number;
          required_skills?: string[];
          objectives?: string[];
          milestones?: Json;
          is_requiring_contributors?: boolean;
          open_roles_needed?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string;
          department?: string;
          project_manager_id?: string | null;
          start_date?: string;
          expected_completion_date?: string;
          status?: string;
          progress_percentage?: number;
          required_skills?: string[];
          objectives?: string[];
          milestones?: Json;
          is_requiring_contributors?: boolean;
          open_roles_needed?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          member_id: string;
          role: string;
          allocation_percentage: number;
          is_temporary_contributor: boolean;
          joined_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          member_id: string;
          role?: string;
          allocation_percentage?: number;
          is_temporary_contributor?: boolean;
          joined_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          member_id?: string;
          role?: string;
          allocation_percentage?: number;
          is_temporary_contributor?: boolean;
          joined_at?: string;
        };
        Relationships: [];
      };
      project_contributions: {
        Row: {
          id: string;
          project_id: string;
          member_id: string;
          assigned_responsibility: string;
          mode: string;
          start_date: string;
          end_date: string | null;
          status: string;
          work_delivered: string | null;
          manager_feedback: string | null;
          performance_evidence_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          member_id: string;
          assigned_responsibility: string;
          mode: string;
          start_date?: string;
          end_date?: string | null;
          status?: string;
          work_delivered?: string | null;
          manager_feedback?: string | null;
          performance_evidence_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          member_id?: string;
          assigned_responsibility?: string;
          mode?: string;
          start_date?: string;
          end_date?: string | null;
          status?: string;
          work_delivered?: string | null;
          manager_feedback?: string | null;
          performance_evidence_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      decision_simulations: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          scope: string;
          input: Json;
          scenarios: Json;
          risk_assessment: Json;
          resource_analysis: string | null;
          skill_gap_analysis: Json;
          recommended_approach: string;
          recommendation_rationale: string;
          execution_roadmap: Json;
          important_considerations: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          scope: string;
          input?: Json;
          scenarios?: Json;
          risk_assessment?: Json;
          resource_analysis?: string | null;
          skill_gap_analysis?: Json;
          recommended_approach?: string;
          recommendation_rationale?: string;
          execution_roadmap?: Json;
          important_considerations?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          scope?: string;
          input?: Json;
          scenarios?: Json;
          risk_assessment?: Json;
          resource_analysis?: string | null;
          skill_gap_analysis?: Json;
          recommended_approach?: string;
          recommendation_rationale?: string;
          execution_roadmap?: Json;
          important_considerations?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      employee_skills: {
        Row: {
          id: string;
          member_id: string;
          skill_name: string;
          category: string;
          proficiency_level: string;
          years_of_experience: number;
          is_verified: boolean;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          skill_name: string;
          category?: string;
          proficiency_level: string;
          years_of_experience?: number;
          is_verified?: boolean;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          skill_name?: string;
          category?: string;
          proficiency_level?: string;
          years_of_experience?: number;
          is_verified?: boolean;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      employee_availability: {
        Row: {
          id: string;
          member_id: string;
          declared_hours_per_week: number;
          available_contribution_hours_per_week: number;
          current_workload_percent: number;
          workload_status: string;
          next_available_date: string;
          availability_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          declared_hours_per_week?: number;
          available_contribution_hours_per_week?: number;
          current_workload_percent?: number;
          workload_status?: string;
          next_available_date?: string;
          availability_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          declared_hours_per_week?: number;
          available_contribution_hours_per_week?: number;
          current_workload_percent?: number;
          workload_status?: string;
          next_available_date?: string;
          availability_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      employment_status: EmploymentStatus;
      attendance_status: AttendanceStatus;
      leave_status: LeaveStatus;
      payslip_status: PayslipStatus;
      meeting_status: MeetingStatus;
      rsvp_status: RsvpStatus;
      document_category: DocumentCategory;
      achievement_category: AchievementCategory;
      achievement_visibility: AchievementVisibility;
      life_goal_status: LifeGoalStatus;
      community_group_tag: CommunityGroupTag;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
