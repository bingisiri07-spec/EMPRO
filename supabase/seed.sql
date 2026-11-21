-- ==============================================================================
-- EMPRO — Seed Data Script
-- Deterministic Demonstration Dataset for Nexus Technologies Ltd
-- ==============================================================================

-- 1. Create Organization: Nexus Technologies Ltd
INSERT INTO public.organizations (
  id,
  organization_name,
  organization_email,
  industry,
  company_size,
  logo_url,
  address
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Nexus Technologies Ltd',
  'contact@nexustech.io',
  'Enterprise Software & AI Platform',
  '500-1000 employees',
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=250',
  'Tech Horizon Park, Bangalore, India'
) ON CONFLICT (id) DO NOTHING;

-- 2. Create Departments for Nexus Technologies
INSERT INTO public.departments (id, organization_id, department_name, description) VALUES
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Engineering & Platform', 'Core software development, platform architecture, and cloud infrastructure'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'People Operations', 'Human resources, talent acquisition, culture, and employee welfare'),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Product & Design', 'Product management, user experience research, and UI design')
ON CONFLICT (organization_id, department_name) DO NOTHING;

-- 3. Create Designations for Nexus Technologies
INSERT INTO public.designations (id, organization_id, designation_name, description) VALUES
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'Lead Frontend Engineer', 'IC4/IC5 Senior Technical Lead specializing in React/TypeScript ecosystems'),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'Director of Engineering', 'Engineering leadership overseeing multiple engineering squads and delivery'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'VP of People Operations', 'Executive head of HR, compensation, compliance, and talent strategy')
ON CONFLICT (organization_id, designation_name) DO NOTHING;

-- 4. Create Standard Leave Types for Nexus Technologies
INSERT INTO public.leave_types (id, organization_id, name, code, default_days_per_year, is_paid) VALUES
  ('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', 'Casual Leave', 'CL', 12, true),
  ('44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', 'Sick / Medical Leave', 'SL', 10, true),
  ('44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', 'Earned / Privilege Leave', 'EL', 18, true),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Unpaid Leave', 'UL', 30, false)
ON CONFLICT (organization_id, code) DO NOTHING;

-- 5. Create Corporate Documents
INSERT INTO public.corporate_documents (organization_id, title, category, file_url, file_size) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Employee Code of Conduct 2026', 'handbook', 'https://documents.nexustech.io/policies/code-of-conduct-2026.pdf', '2.4 MB'),
  ('11111111-1111-1111-1111-111111111111', 'Hybrid Work & Remote Attendance Policy', 'policy', 'https://documents.nexustech.io/policies/hybrid-work-guidelines.pdf', '1.1 MB'),
  ('11111111-1111-1111-1111-111111111111', 'Medical Insurance & Wellness Benefits', 'compliance', 'https://documents.nexustech.io/policies/insurance-benefits-guide.pdf', '3.8 MB'),
  ('11111111-1111-1111-1111-111111111111', 'Standard Non-Disclosure Agreement (NDA)', 'template', 'https://documents.nexustech.io/templates/nexus-standard-nda.pdf', '650 KB')
ON CONFLICT DO NOTHING;
