-- ==============================================================================
-- EMPRO — Collaboration & Organizational Intelligence Migration
-- New Modules: Events, Projects & Contribution Intelligence, Decision Simulator
-- ==============================================================================

-- ==============================================================================
-- 1. COMPANY DOMAIN: EVENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN (
    'Technical Meetup', 'Workshop', 'Hackathon', 'Seminar', 
    'Training Session', 'Innovation Challenge', 'Company Celebration', 'Town Hall'
  )),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  venue_or_link TEXT NOT NULL DEFAULT 'Office HQ',
  is_online BOOLEAN NOT NULL DEFAULT false,
  organizer_id UUID REFERENCES public.organization_members(id) ON DELETE SET NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  max_attendees INT,
  available_opportunities TEXT[] DEFAULT '{}',
  schedule_agenda JSONB DEFAULT '[]'::jsonb,
  participation_requirements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Event Registrations (Separate from attendance)
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_event_registration UNIQUE (event_id, member_id)
);

-- Event Contribution Requests (Volunteer helper applications)
CREATE TABLE IF NOT EXISTS public.event_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  contribution_category TEXT NOT NULL,
  relevant_skills TEXT[] DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  availability TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  assigned_role TEXT,
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_event_contributions_updated_at
  BEFORE UPDATE ON public.event_contributions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Event Attendance (Recorded separately from registration upon verified check-in)
CREATE TABLE IF NOT EXISTS public.event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  verification_method TEXT NOT NULL DEFAULT 'organizer_checkin',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_event_attendance UNIQUE (event_id, member_id)
);

-- ==============================================================================
-- 2. COMPANY DOMAIN: PROJECTS & CONTRIBUTION INTELLIGENCE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT 'Engineering',
  project_manager_id UUID REFERENCES public.organization_members(id) ON DELETE SET NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_completion_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'completed', 'on_hold')),
  progress_percentage INT NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  required_skills TEXT[] DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}',
  milestones JSONB DEFAULT '[]'::jsonb,
  is_requiring_contributors BOOLEAN NOT NULL DEFAULT false,
  open_roles_needed JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Project Team Members
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'Contributor',
  allocation_percentage INT NOT NULL DEFAULT 50 CHECK (allocation_percentage BETWEEN 0 AND 100),
  is_temporary_contributor BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_project_member UNIQUE (project_id, member_id)
);

-- Project Contribution Records (Tracks Open, AI-Recommended, and Manager-Assigned modes)
CREATE TABLE IF NOT EXISTS public.project_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  assigned_responsibility TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('open_contribution', 'ai_recommended', 'manager_assigned')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'declined')),
  work_delivered TEXT,
  manager_feedback TEXT,
  performance_evidence_score INT CHECK (performance_evidence_score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_project_contributions_updated_at
  BEFORE UPDATE ON public.project_contributions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 3. LIFE DOMAIN: AI DECISION SIMULATOR
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.decision_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('company_based', 'personal_project')),
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  scenarios JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_assessment JSONB NOT NULL DEFAULT '[]'::jsonb,
  resource_analysis TEXT,
  skill_gap_analysis JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_approach TEXT NOT NULL DEFAULT '',
  recommendation_rationale TEXT NOT NULL DEFAULT '',
  execution_roadmap JSONB NOT NULL DEFAULT '[]'::jsonb,
  important_considerations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_decision_simulations_updated_at
  BEFORE UPDATE ON public.decision_simulations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_simulations ENABLE ROW LEVEL SECURITY;

-- Events Policies: Visible to organization members
CREATE POLICY "View organization events" ON public.events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = events.organization_id AND om.profile_id = auth.uid()
    )
  );

CREATE POLICY "Manage events (Organizers / HR / Admins)" ON public.events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = events.organization_id 
        AND om.profile_id = auth.uid()
        AND (om.role IN ('manager', 'hr', 'admin') OR om.id = events.organizer_id)
    )
  );

-- Event Registration Policies
CREATE POLICY "Register for events" ON public.event_registrations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = event_registrations.member_id AND om.profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.organization_members om ON om.organization_id = e.organization_id
      WHERE e.id = event_registrations.event_id AND om.profile_id = auth.uid() AND om.role IN ('manager', 'hr', 'admin')
    )
  );

-- Event Contributions Policies
CREATE POLICY "View and submit event contributions" ON public.event_contributions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = event_contributions.member_id AND om.profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.organization_members om ON om.organization_id = e.organization_id
      WHERE e.id = event_contributions.event_id AND om.profile_id = auth.uid() AND (om.role IN ('manager', 'hr', 'admin') OR om.id = e.organizer_id)
    )
  );

-- Projects Policies: Visible to company members
CREATE POLICY "View organization projects" ON public.projects
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = projects.organization_id AND om.profile_id = auth.uid()
    )
  );

CREATE POLICY "Manage projects (Managers / Admins)" ON public.projects
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = projects.organization_id 
        AND om.profile_id = auth.uid()
        AND (om.role IN ('manager', 'admin') OR om.id = projects.project_manager_id)
    )
  );

-- Project Contributions Policies
CREATE POLICY "Manage project contributions" ON public.project_contributions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = project_contributions.member_id AND om.profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = project_contributions.project_id AND om.profile_id = auth.uid() AND om.role IN ('manager', 'admin', 'hr')
    )
  );

-- Decision Simulator Policies: Strictly user-owned privacy
CREATE POLICY "Decision simulations are strictly individual" ON public.decision_simulations
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());
