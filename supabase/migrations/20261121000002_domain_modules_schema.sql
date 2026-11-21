-- ==============================================================================
-- EMPRO — Phase 3: Domain Modules Database Migration
-- Professional Domain & Personal Domain Tables with Complete Domain Separation
-- ==============================================================================

-- ==============================================================================
-- PART 1: PROFESSIONAL DOMAIN TABLES (Company-Controlled Workspaces)
-- ==============================================================================

-- 1. Attendance Records
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  work_date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  total_hours NUMERIC(4, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'late', 'half_day', 'absent', 'on_leave', 'holiday')),
  location_tag TEXT DEFAULT 'Office HQ',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_member_work_date UNIQUE (member_id, work_date)
);

CREATE TRIGGER trg_attendance_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Leave Types (Configured by Organization)
CREATE TABLE IF NOT EXISTS public.leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  default_days_per_year INT NOT NULL DEFAULT 12,
  is_paid BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_org_leave_code UNIQUE (organization_id, code)
);

-- 3. Leave Balances (Per Member Per Year)
CREATE TABLE IF NOT EXISTS public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES public.leave_types(id) ON DELETE CASCADE,
  year INT NOT NULL,
  allocated_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
  used_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
  pending_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_member_leave_year UNIQUE (member_id, leave_type_id, year)
);

CREATE TRIGGER trg_leave_balances_updated_at
  BEFORE UPDATE ON public.leave_balances
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Leave Requests
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES public.leave_types(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days NUMERIC(4, 1) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  reviewed_by UUID REFERENCES public.organization_members(id) ON DELETE SET NULL,
  review_comment TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_leave_requests_updated_at
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Salary Structures
CREATE TABLE IF NOT EXISTS public.salary_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  currency TEXT NOT NULL DEFAULT 'USD',
  basic_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
  hra NUMERIC(12, 2) NOT NULL DEFAULT 0,
  special_allowances NUMERIC(12, 2) NOT NULL DEFAULT 0,
  pf_deduction NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_deduction NUMERIC(12, 2) NOT NULL DEFAULT 0,
  medical_insurance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  gross_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
  net_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_salary_structures_updated_at
  BEFORE UPDATE ON public.salary_structures
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Monthly Payslips
CREATE TABLE IF NOT EXISTS public.payslips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  currency TEXT NOT NULL DEFAULT 'USD',
  basic_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
  hra NUMERIC(12, 2) NOT NULL DEFAULT 0,
  allowances NUMERIC(12, 2) NOT NULL DEFAULT 0,
  gross_pay NUMERIC(12, 2) NOT NULL DEFAULT 0,
  pf_deduction NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_deduction NUMERIC(12, 2) NOT NULL DEFAULT 0,
  other_deductions NUMERIC(12, 2) NOT NULL DEFAULT 0,
  net_pay NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_member_payslip_period UNIQUE (member_id, month, year)
);

CREATE TRIGGER trg_payslips_updated_at
  BEFORE UPDATE ON public.payslips
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. Meetings & Schedules
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  meeting_link TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Meeting Attendees
CREATE TABLE IF NOT EXISTS public.meeting_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
  rsvp_status TEXT NOT NULL DEFAULT 'invited' CHECK (rsvp_status IN ('invited', 'accepted', 'declined', 'tentative')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_meeting_attendee UNIQUE (meeting_id, member_id)
);

-- 9. Corporate Documents & Handbooks
CREATE TABLE IF NOT EXISTS public.corporate_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('policy', 'handbook', 'template', 'compliance', 'letter')),
  file_url TEXT NOT NULL,
  file_size TEXT,
  uploaded_by UUID REFERENCES public.organization_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_corporate_documents_updated_at
  BEFORE UPDATE ON public.corporate_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- PART 2: PERSONAL DOMAIN TABLES (Individual-Controlled & Private by Design)
-- Company administrators and managers have ZERO access to these personal records
-- ==============================================================================

-- 10. Private Diary & Quick Capture
CREATE TABLE IF NOT EXISTS public.diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  mood TEXT,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_diary_entries_updated_at
  BEFORE UPDATE ON public.diary_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. Achievements & Portable Credentials (4-Tier Visibility)
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('certification', 'award', 'publication', 'patent', 'project', 'education')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'connections', 'company', 'public')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 12. Life Goals & Milestones
CREATE TABLE IF NOT EXISTS public.life_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Career',
  target_date DATE,
  progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_life_goals_updated_at
  BEFORE UPDATE ON public.life_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 13. Cross-Company Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  group_tag TEXT NOT NULL DEFAULT 'General' CHECK (group_tag IN ('General', 'Engineering', 'AI/ML', 'Design', 'Leadership', 'Entrepreneurship', 'Career')),
  likes_count INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 14. Community Comments
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_community_comments_updated_at
  BEFORE UPDATE ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- PART 3: ROW LEVEL SECURITY & DOMAIN SEPARATION POLICIES
-- ==============================================================================

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Attendance Policies: Member can view own; HR/Managers can view organization
CREATE POLICY "Members view own attendance" ON public.attendance_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = attendance_records.member_id AND om.profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = attendance_records.organization_id
        AND om.profile_id = auth.uid()
        AND om.role IN ('manager', 'hr', 'admin')
    )
  );

CREATE POLICY "Members can check in/out" ON public.attendance_records
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = member_id AND om.profile_id = auth.uid()
    )
  );

-- Leave Policies
CREATE POLICY "View leave types" ON public.leave_types
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = leave_types.organization_id AND om.profile_id = auth.uid()
    )
  );

CREATE POLICY "View leave balances" ON public.leave_balances
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = leave_balances.member_id AND om.profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.organization_members current_om ON current_om.organization_id = om.organization_id
      WHERE om.id = leave_balances.member_id
        AND current_om.profile_id = auth.uid()
        AND current_om.role IN ('manager', 'hr', 'admin')
    )
  );

CREATE POLICY "Manage leave requests" ON public.leave_requests
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = leave_requests.member_id AND om.profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = leave_requests.organization_id
        AND om.profile_id = auth.uid()
        AND om.role IN ('manager', 'hr', 'admin')
    )
  );

-- Salary Vault Policies: STRICT ACCESS - Member view own; HR/Admin manage
CREATE POLICY "View own salary structure" ON public.salary_structures
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = salary_structures.member_id AND om.profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.organization_members current_om ON current_om.organization_id = om.organization_id
      WHERE om.id = salary_structures.member_id
        AND current_om.profile_id = auth.uid()
        AND current_om.role IN ('hr', 'admin')
    )
  );

CREATE POLICY "View own payslips" ON public.payslips
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = payslips.member_id AND om.profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = payslips.organization_id
        AND om.profile_id = auth.uid()
        AND om.role IN ('hr', 'admin')
    )
  );

-- Meetings Policies
CREATE POLICY "View organization meetings" ON public.meetings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = meetings.organization_id AND om.profile_id = auth.uid()
    )
  );

CREATE POLICY "Manage meetings" ON public.meetings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.id = meetings.organizer_id AND om.profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = meetings.organization_id
        AND om.profile_id = auth.uid()
        AND om.role IN ('manager', 'hr', 'admin')
    )
  );

CREATE POLICY "View meeting attendees" ON public.meeting_attendees
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.meetings m
      JOIN public.organization_members om ON om.organization_id = m.organization_id
      WHERE m.id = meeting_attendees.meeting_id AND om.profile_id = auth.uid()
    )
  );

-- Corporate Documents Policies
CREATE POLICY "View corporate docs" ON public.corporate_documents
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = corporate_documents.organization_id AND om.profile_id = auth.uid()
    )
  );

CREATE POLICY "Manage corporate docs" ON public.corporate_documents
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = corporate_documents.organization_id
        AND om.profile_id = auth.uid()
        AND om.role IN ('hr', 'admin')
    )
  );

-- ==============================================================================
-- PERSONAL DOMAIN STRICT PRIVACY POLICIES
-- Zero employer access: auth.uid() = profile_id ONLY
-- ==============================================================================

-- 1. Private Diary: ONLY the owner can read, insert, update or delete
CREATE POLICY "Private diary is strictly individual" ON public.diary_entries
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- 2. Life Goals: ONLY the owner can read or manage
CREATE POLICY "Life goals are strictly individual" ON public.life_goals
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- 3. Achievements (4-Tier Visibility)
CREATE POLICY "Achievements visibility control" ON public.achievements
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid() OR
    visibility = 'public' OR
    (
      visibility = 'company' AND EXISTS (
        SELECT 1 FROM public.organization_members viewer_om
        JOIN public.organization_members owner_om ON owner_om.organization_id = viewer_om.organization_id
        WHERE viewer_om.profile_id = auth.uid() AND owner_om.profile_id = achievements.profile_id
      )
    )
  );

CREATE POLICY "Manage own achievements" ON public.achievements
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- 4. Community Hub
CREATE POLICY "View community posts" ON public.community_posts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Create community posts" ON public.community_posts
  FOR INSERT TO authenticated
  WITH CHECK (author_profile_id = auth.uid());

CREATE POLICY "Update own community posts" ON public.community_posts
  FOR UPDATE TO authenticated
  USING (author_profile_id = auth.uid());

CREATE POLICY "Delete own community posts" ON public.community_posts
  FOR DELETE TO authenticated
  USING (author_profile_id = auth.uid());

CREATE POLICY "View community comments" ON public.community_comments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Create community comments" ON public.community_comments
  FOR INSERT TO authenticated
  WITH CHECK (author_profile_id = auth.uid());

CREATE POLICY "Delete own community comments" ON public.community_comments
  FOR DELETE TO authenticated
  USING (author_profile_id = auth.uid());
