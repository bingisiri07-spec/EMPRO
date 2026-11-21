-- ==============================================================================
-- EMPRO — Database Functions, Triggers & Integrity Constraints Migration
-- Validates: Event Registrations, Event Attendance Sync, Contribution Updates,
-- and Multi-Tenant Project Membership Integrity
-- ==============================================================================

-- 1. Event Registration Validation Trigger
-- Prevents registering after deadline or exceeding max attendees limit
CREATE OR REPLACE FUNCTION public.validate_event_registration()
RETURNS TRIGGER AS $$
DECLARE
  v_deadline TIMESTAMPTZ;
  v_max_attendees INT;
  v_current_count INT;
  v_status TEXT;
BEGIN
  -- Fetch event metadata
  SELECT registration_deadline, max_attendees, status
  INTO v_deadline, v_max_attendees, v_status
  FROM public.events
  WHERE id = NEW.event_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Referenced event % does not exist', NEW.event_id;
  END IF;

  IF v_status = 'cancelled' THEN
    RAISE EXCEPTION 'Cannot register for a cancelled event';
  END IF;

  IF v_deadline IS NOT NULL AND timezone('utc'::text, now()) > v_deadline THEN
    RAISE EXCEPTION 'Registration deadline for this event has passed (% UTC)', v_deadline;
  END IF;

  IF v_max_attendees IS NOT NULL AND v_max_attendees > 0 THEN
    SELECT COUNT(*) INTO v_current_count
    FROM public.event_registrations
    WHERE event_id = NEW.event_id;

    IF v_current_count >= v_max_attendees THEN
      RAISE EXCEPTION 'Event registration capacity of % attendees has been reached', v_max_attendees;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_validate_event_registration ON public.event_registrations;
CREATE TRIGGER trg_validate_event_registration
  BEFORE INSERT ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION public.validate_event_registration();


-- 2. Event Attendance Automated Daily Attendance Sync Trigger
-- When event attendance is verified, automatically sync to attendance_records
CREATE OR REPLACE FUNCTION public.handle_event_attendance_sync()
RETURNS TRIGGER AS $$
DECLARE
  v_org_id UUID;
  v_title TEXT;
  v_today DATE;
BEGIN
  SELECT organization_id, title
  INTO v_org_id, v_title
  FROM public.events
  WHERE id = NEW.event_id;

  v_today := CURRENT_DATE;

  -- Upsert daily attendance record with event attendance badge
  INSERT INTO public.attendance_records (
    organization_id,
    member_id,
    work_date,
    check_in,
    status,
    location_tag,
    notes
  )
  VALUES (
    v_org_id,
    NEW.member_id,
    v_today,
    NEW.verified_at,
    'present',
    LEFT('Event: ' || v_title, 50),
    'Verified attendance at company event: ' || v_title
  )
  ON CONFLICT (member_id, work_date) DO UPDATE SET
    status = 'present',
    location_tag = EXCLUDED.location_tag,
    notes = COALESCE(public.attendance_records.notes || ' | ', '') || EXCLUDED.notes;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_event_attendance_sync ON public.event_attendance;
CREATE TRIGGER trg_event_attendance_sync
  AFTER INSERT OR UPDATE ON public.event_attendance
  FOR EACH ROW EXECUTE FUNCTION public.handle_event_attendance_sync();


-- 3. Event Contribution Review Trigger
-- Automatically updates reviewed_at timestamp on status approval/rejection
CREATE OR REPLACE FUNCTION public.handle_event_contribution_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('approved', 'rejected') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    NEW.reviewed_at = timezone('utc'::text, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_event_contribution_status ON public.event_contributions;
CREATE TRIGGER trg_event_contribution_status
  BEFORE UPDATE ON public.event_contributions
  FOR EACH ROW EXECUTE FUNCTION public.handle_event_contribution_status_change();


-- 4. Multi-Tenant Project Membership Organization Validation
-- Prevents adding employees to projects belonging to another company
CREATE OR REPLACE FUNCTION public.validate_project_member_organization()
RETURNS TRIGGER AS $$
DECLARE
  v_project_org UUID;
  v_member_org UUID;
BEGIN
  SELECT organization_id INTO v_project_org FROM public.projects WHERE id = NEW.project_id;
  SELECT organization_id INTO v_member_org FROM public.organization_members WHERE id = NEW.member_id;

  IF v_project_org IS DISTINCT FROM v_member_org THEN
    RAISE EXCEPTION 'Cross-organization assignment prohibited: Member organization (%) does not match Project organization (%)',
      v_member_org, v_project_org;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_validate_project_member_organization ON public.project_members;
CREATE TRIGGER trg_validate_project_member_organization
  BEFORE INSERT OR UPDATE ON public.project_members
  FOR EACH ROW EXECUTE FUNCTION public.validate_project_member_organization();


-- 5. Multi-Tenant Project Contribution Organization Validation
CREATE OR REPLACE FUNCTION public.validate_project_contribution_organization()
RETURNS TRIGGER AS $$
DECLARE
  v_project_org UUID;
  v_member_org UUID;
BEGIN
  SELECT organization_id INTO v_project_org FROM public.projects WHERE id = NEW.project_id;
  SELECT organization_id INTO v_member_org FROM public.organization_members WHERE id = NEW.member_id;

  IF v_project_org IS DISTINCT FROM v_member_org THEN
    RAISE EXCEPTION 'Cross-organization contribution prohibited: Member organization (%) does not match Project organization (%)',
      v_member_org, v_project_org;
  END IF;

  IF NEW.status = 'completed' AND NEW.end_date IS NULL THEN
    NEW.end_date = CURRENT_DATE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_validate_project_contribution_organization ON public.project_contributions;
CREATE TRIGGER trg_validate_project_contribution_organization
  BEFORE INSERT OR UPDATE ON public.project_contributions
  FOR EACH ROW EXECUTE FUNCTION public.validate_project_contribution_organization();
