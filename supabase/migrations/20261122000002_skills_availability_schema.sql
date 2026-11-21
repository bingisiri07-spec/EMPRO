-- ==============================================================================
-- EMPRO — Employee Skills & Availability Schema Migration
-- Required for AI Contribution Intelligence and Resource Allocation
-- ==============================================================================

-- 1. Employee Skills Table
CREATE TABLE IF NOT EXISTS public.employee_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  proficiency_level TEXT NOT NULL CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  years_of_experience NUMERIC(4, 1) NOT NULL DEFAULT 1.0 CHECK (years_of_experience >= 0),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES public.organization_members(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_member_skill UNIQUE (member_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_employee_skills_member_id ON public.employee_skills(member_id);
CREATE INDEX IF NOT EXISTS idx_employee_skills_name ON public.employee_skills(skill_name);

CREATE TRIGGER trg_employee_skills_updated_at
  BEFORE UPDATE ON public.employee_skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Employee Availability Table
CREATE TABLE IF NOT EXISTS public.employee_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL UNIQUE REFERENCES public.organization_members(id) ON DELETE CASCADE,
  declared_hours_per_week NUMERIC(4, 1) NOT NULL DEFAULT 40.0 CHECK (declared_hours_per_week >= 0),
  available_contribution_hours_per_week NUMERIC(4, 1) NOT NULL DEFAULT 10.0 CHECK (available_contribution_hours_per_week >= 0),
  current_workload_percent INT NOT NULL DEFAULT 65 CHECK (current_workload_percent BETWEEN 0 AND 150),
  workload_status TEXT NOT NULL DEFAULT 'Moderate (70%)' CHECK (workload_status IN ('Low (45%)', 'Moderate (70%)', 'Heavy (90%)', 'Overloaded')),
  next_available_date DATE NOT NULL DEFAULT CURRENT_DATE,
  availability_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_employee_availability_member_id ON public.employee_availability(member_id);

CREATE TRIGGER trg_employee_availability_updated_at
  BEFORE UPDATE ON public.employee_availability
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_availability ENABLE ROW LEVEL SECURITY;

-- Skills: Visible to organization colleagues
CREATE POLICY "View organization colleague skills" ON public.employee_skills
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om_self
      JOIN public.organization_members om_target ON om_target.organization_id = om_self.organization_id
      WHERE om_target.id = employee_skills.member_id AND om_self.profile_id = auth.uid()
    )
  );

-- Skills: Manage own skills
CREATE POLICY "Manage own skills" ON public.employee_skills
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = employee_skills.member_id AND om.profile_id = auth.uid()
    )
  );

-- Skills: Verify skills (Managers / HR / Admin)
CREATE POLICY "Verify colleague skills" ON public.employee_skills
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om_self
      JOIN public.organization_members om_target ON om_target.organization_id = om_self.organization_id
      WHERE om_target.id = employee_skills.member_id 
        AND om_self.profile_id = auth.uid()
        AND om_self.role IN ('manager', 'hr', 'admin')
    )
  );

-- Availability: View colleague availability
CREATE POLICY "View colleague availability" ON public.employee_availability
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om_self
      JOIN public.organization_members om_target ON om_target.organization_id = om_self.organization_id
      WHERE om_target.id = employee_availability.member_id AND om_self.profile_id = auth.uid()
    )
  );

-- Availability: Manage own availability
CREATE POLICY "Manage own availability" ON public.employee_availability
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = employee_availability.member_id AND om.profile_id = auth.uid()
    )
  );
