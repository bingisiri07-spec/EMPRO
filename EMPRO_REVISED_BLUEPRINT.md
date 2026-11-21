# EMPRO — Revised Prototype Execution Blueprint

**Tagline:** Your Professional Identity. Your Personal World.  
**Purpose:** Authoritative product and execution brief for Antigravity.  
**Rule:** Where the earlier `EMPRO_PROTOTYPE_PLAN.md` conflicts with this document, follow this revised blueprint.

---

## 1. Product vision

EMPRO is an employee-centric digital ecosystem combining professional workforce management and personal life management in one application while keeping the two domains separate.

Every person has one persistent EMPRO identity:
- **Professional:** employer-managed employment information and workplace tools.
- **Personal:** individual-owned profile, diary, achievements, goals, productivity and cross-company connections.

A person's employer may change. Their personal identity and personal records remain theirs.

**Core message:** Professional identity is connected to the company. Personal identity belongs to the person.

## 2. Non-negotiable product principles

1. One permanent EMPRO identity per individual.
2. Professional and Personal have separate authorization boundaries.
3. One active company workspace at a time; previous employment associations are archived history.
4. Personal data remains with the individual when company membership changes.
5. Company administrators cannot access the Personal diary or Personal Copilot conversations.
6. Achievements are private by default, with explicit visibility controls.
7. Role selection is navigation only; backend authorization validates actual roles.
8. Frontend hiding is not security. Enforce permissions in backend/database policies.
9. Label demo-only features honestly. Never call a simulated PIN biometric authentication or claim unimplemented encryption.
10. The pitch must remain usable if an external AI service fails.
11. Build and test incrementally, one task at a time.
12. Do not redesign or overwrite working parts without explaining why and getting approval.

## 3. Reconciliation of Antigravity's original plan

The original `EMPRO_PROTOTYPE_PLAN.md` is a useful starting point. Apply these changes:

| Original proposal | Revised decision |
|---|---|
| One-click persona switcher | Only as an explicitly labelled Demo Mode convenience. It never grants real permissions. |
| Floating Employee/Manager/HR pill and Work/Life toggle | Use clear Professional and Personal navigation sections in a coherent app shell. |
| Simulated geolocation | Use a fictional/demo location indicator; do not request actual location unnecessarily. |
| Diary described as encrypted | Do not claim encryption until implemented and tested. |
| UI message says admins have zero access | Enforce this with backend authorization and database policies. |
| Login not clearly prioritized | Reliable demo login and seeded accounts are Phase 0/1 foundation requirements. |
| HR/Manager deferred to final phase | Define roles and permissions from the beginning; build their dashboards after the employee experience. |
| Company transition underspecified | One active company membership; preserve personal identity and archive employment history. |
| Dual copilots | Keep separate data sources, context permissions and conversation records. |

## 4. Navigation and application layout

The supplied screenshots are **colour references only**. Do not copy their layout, card arrangement, social-feed structure or navigation.

Build a modern, responsive EMPRO application shell. Use a desktop sidebar or collapsible navigation if it best supports the feature hierarchy, with an appropriate mobile navigation pattern.

**Professional navigation**
- Overview
- Digital ID
- Attendance
- Leave
- Salary Vault
- Meetings
- Documents
- Professional Copilot

HR and Manager roles receive additional authorized sections such as employee directory, approvals and reports.

**Personal navigation**
- Personal Overview
- My Profile
- Diary & Notes
- Achievements
- Goals & Tasks
- Life Timeline
- Community
- Personal Copilot
- Privacy & Sharing

Make the two domains visibly distinct. Entry into Personal should trigger the configured unlock gate.

## 5. Authentication, roles and demo reliability

Roles:
- **Company Admin / CEO:** creates and configures company workspace and assigns roles.
- **HR:** manages authorized employee records and HR workflows.
- **Manager:** manages employees and workflows within assigned scope.
- **Employee:** accesses own Professional records and Personal domain.

Role selection never grants authorization. Backend validates signed-in user, active company membership and assigned permissions.

For the hackathon, use controlled pre-created demo accounts and seeded data. Avoid email OTP delivery or external verification dependencies during the live pitch.

Suggested identifiers (create as development accounts; these are not existing accounts):
- `employee@demo.empro.app`
- `manager@demo.empro.app`
- `hr@demo.empro.app`

A demo persona switcher may be included only behind a visible **Demo Mode** label. Never put passwords, API keys or secrets in this file or GitHub.

A demo PIN may demonstrate the Personal entry gate, but label it **Demo Lock Simulation**. Do not describe it as biometric security. Real passkey/WebAuthn support is a later milestone. Do not store device biometric data.

## 6. Professional domain

### Employee overview dashboard
Prioritize:
- Greeting and date/time.
- Employee identity summary.
- Attendance status and check-in/check-out action.
- Today's working-hours summary.
- Monthly salary/net pay summary.
- Leave balance.
- Upcoming meeting.
- Notifications/pending actions.
- Professional Copilot shortcut.

Use fictional sample data and label it as demo data.

### Digital ID
Show photo, full name, employee ID, company, department, designation, joining date and employment status. A QR-style element may be demonstrative. Do not claim secure verification unless backend validation, expiry and anti-replay protections exist.

### Attendance
Include check-in/check-out, current status, today's duration, attendance history, monthly calendar/summary and present/late/half-day/holiday/leave states. Include correction requests if feasible. Any simulated location must be labelled fictional; do not request device location for a demo-only feature.

### Leave
Include casual, sick, earned and unpaid leave; balances; history; application form; dates; reason; status; and Manager/HR review flow. Keep paid and unpaid leave distinct. Sick leave is not automatically unpaid.

### Salary Tracker and Salary Vault
Show gross/net pay, basic, HRA, allowances, overtime, bonus, PF, tax, other deductions, leave adjustments, payslip history, salary revisions and payment status.

Illustrative formulas only:
`Gross Pay = Basic + HRA + Allowances + Overtime + Bonus`
`Net Pay = Gross Pay - PF - Tax - Unpaid Leave - Other Deductions`

Do not hardcode universal Indian payroll rates or claim legal payroll compliance. Clearly label figures fictional. Salary Vault is a records repository, not a bank account or wallet. Preserve finalized payroll history; salary revisions must be effective-dated and must not silently overwrite past payroll.

### Meetings and documents
Meetings: upcoming/past list, date, time, duration, participants, link/location, notes and follow-up tasks. Documents: appointment letters, agreements, payslips, experience letters and company-issued certificates. If upload/storage is not implemented, show an honest placeholder rather than a fake working upload.

### Professional Copilot
A concise, work-focused assistant for salary explanations, attendance/leave, company policies, meeting summaries, action items, schedule organization and professional drafts. It must not access Personal diary entries, Personal Copilot conversations or personal-only context.

## 7. Personal domain

### Personal profile
Name, photo, bio, education, skills, interests, goals, achievements and LinkedIn/GitHub/portfolio links. Personal profile ownership is separate from employer-managed employee profile.

### Diary and Quick Capture
Create, view, edit and delete entries; quick notes; date organization; tags; search; favorites. Private by default. Do not claim encryption unless actually implemented and tested.

### Achievements and credentials
Support academic achievements, certifications, courses, competitions, hackathons, projects, awards, milestones, skills and certificate attachments where implemented.

Every achievement has four visibility levels:
1. **Private:** only the individual.
2. **Selected connections:** connections specifically chosen by the individual.
3. **Company:** authorized viewers in the current company.
4. **Public:** anyone allowed to access the public profile/shared item.

Private is default. Enforce visibility in backend/database authorization, not just frontend. Company visibility must not silently transfer to a new employer.

### Goals, tasks and Life Timeline
Daily/weekly/long-term goals, to-do tasks, priorities, deadlines, progress and milestones. Life Timeline can include education, achievements, projects and career milestones without exposing private company records.

### EMPRO Community
Cross-company community with profile discovery by skills/interests, posts, questions, comments, reactions, groups (Engineering, AI/ML, Design, Leadership, Entrepreneurship, Career), connection requests and mentorship discovery. Use fictional seeded profiles. Never expose private employment records. Personal connections should not disappear automatically when company membership changes.

### Personal Copilot
Friendly assistant for personal growth, learning, goals, productivity, work-life organization, brainstorming and reflection. It may use only personal context the individual has approved. Never automatically pass private diary entries or professional company records into it. Keep its conversations and context separate from Professional Copilot.

## 8. Visual direction

The screenshots supplied by the user are **colour references, not layout references**.

Use a modern purple/violet identity with blue-violet gradient accents:
- Primary: confident violet/purple.
- Accent: blue-to-violet gradient, used selectively.
- Main surfaces: white or soft off-white.
- Secondary surfaces: very light lavender/neutral.
- Main text: deep charcoal/navy.
- Muted text: neutral grey.
- Borders: subtle cool grey/lavender.
- Status colours: restrained and consistent.

Do not put gradients on every component. Build a distinct EMPRO layout with strong hierarchy, consistent typography, spacing, radii and icons. Ensure accessibility, readable contrast, responsive desktop/mobile layouts and useful empty/loading/error states. Salary and employment information must look especially trustworthy.

Establish design tokens and a small reusable component set before designing all screens. Do not copy the reference screenshots' page layout.

## 9. Technical direction

Preferred starting stack:
- React + Vite
- TypeScript
- Tailwind CSS
- Lucide React
- React Context or Zustand only if state complexity justifies it
- Recharts where charts add value
- Supabase-compatible data models and later backend integration
- Secure server-side functions for AI/API calls

Check current package compatibility before installing dependencies. Avoid unnecessary libraries.

The first prototype may use deterministic local mock data for pitch reliability. Keep:
- TypeScript models separate from UI.
- Mock data separate from components.
- Data access behind small service/helper modules so Supabase can be integrated later.
- User IDs, company IDs, ownership and visibility in data structures.
- Secrets out of frontend code and GitHub.

When Supabase is integrated, use authenticated server-side operations and PostgreSQL Row Level Security. Local mock state is not production security.

Keep Professional and Personal Copilot context sources and conversations separate. Retrieve only the minimum authorized data needed. Provide deterministic fallback responses if the AI provider is unavailable.

## 10. Revised implementation roadmap

### Phase 0 — Repository and environment foundation
- Inspect the cloned repository and its current files.
- Verify Node.js and npm versions.
- Confirm terminal is at the EMPRO repository root.
- Initialize Vite + React + TypeScript in the repository root.
- Install/configure Tailwind with a compatible setup.
- Verify the starter app runs locally.
- Add `.gitignore`; ensure `.env` and secrets are excluded.
- Make a stable initial Git commit.
- Do not begin feature generation until the environment is verified.

### Phase 1 — Design system, app shell and access foundation
- EMPRO design tokens and colour system.
- Typography, spacing, buttons, cards, inputs and status components.
- Responsive application shell.
- Professional and Personal navigation.
- Login/entry experience and reliable demo-account strategy.
- Employee, Manager, HR and Company Admin role model.
- Clearly labelled demo-mode controls, if used.
- Personal demo unlock screen with honest labelling.
- Route protection and placeholder screens.

Acceptance: app runs; navigation works; role selection does not grant permissions; demo access is predictable; Personal is distinct; no false biometric/encryption claims.

### Phase 2 — Employee Professional experience
- Employee dashboard and Digital ID.
- Attendance check-in/out and history/calendar.
- Leave balances and application flow.
- Salary Tracker and Salary Vault with fictional sample data and chart.
- Meetings.
- Professional documents or honest placeholder.
- Professional Copilot with isolated demo context and fallback.

Acceptance: all visible actions work; sample data is labelled; salary figures are internally consistent; no personal data enters Professional Copilot.

### Phase 3 — Personal domain and privacy
- Personal overview and profile.
- Personal unlock gate.
- Diary CRUD and Quick Capture.
- Achievements and certificate cards.
- Four-level achievement visibility.
- Goals/tasks and Life Timeline.
- Personal Copilot with separate context and fallback.

Acceptance: diary private by default; visibility shown accurately; no personal data leaks into Professional screens; demo lock is not misrepresented.

### Phase 4 — Cross-company Community
- Community feed and fictional profiles from multiple companies.
- Search by interests/skills.
- Groups, posts, comments, reactions and connection requests.
- Mentorship-style discovery.

Acceptance: community is cross-company; seeded content is fictional; private employment data is not exposed; interactions update visibly.

### Phase 5 — Manager, HR and Company Admin
- Manager dashboard and team attendance.
- Leave approval/rejection.
- HR dashboard and employee directory.
- Authorized payroll/status overview.
- Company Admin workspace/role-management demonstration where practical.

Acceptance: each role sees only authorized navigation/data; Manager scope is limited; HR access is professional-only; company roles cannot open Personal diary or Personal Copilot.

### Phase 6 — Integration and pitch readiness
- End-to-end Employee, Manager and HR walkthrough.
- Responsive checks.
- Empty/loading/error states.
- Demo data reset strategy.
- AI outage fallback test.
- Permission-boundary checklist.
- Fix broken navigation.
- Visual consistency/performance pass.
- Stable Git commit and deployment readiness.

## 11. Fictional seed personas

**Employee — Alex Rivera**  
Lead Frontend Engineer, Nexus Technologies  
Employee ID `NX-4092`, joined March 2023  
Illustrative gross salary ₹1,85,000; net ₹1,46,200  
Previous employment: Apex Labs, 2020–2023  
Sample achievements: AWS Certified Solutions Architect; Hackathon 1st Place 2024.

**Manager — Sarah Jenkins**  
Engineering Director; demo team attendance and pending leave approvals.

**HR — Marcus Vance**  
Head of People Operations; demo employee directory, headcount and payroll status.

All identities and records are fictional. Keep dates, salary components, leave balances and charts internally consistent.

## 12. Pitch-readiness checklist

- [ ] Demo login does not depend on OTP delivery.
- [ ] Demo accounts have distinct roles.
- [ ] Role selection does not bypass authorization.
- [ ] Diary is private by default.
- [ ] Company roles cannot access Personal diary or Personal Copilot.
- [ ] All four achievement visibility options work in the prototype.
- [ ] Private achievements are not exposed publicly.
- [ ] Company visibility does not transfer automatically to another employer.
- [ ] Copilot contexts are separate.
- [ ] AI outage produces a useful fallback.
- [ ] Sample salary figures are clearly fictional.
- [ ] No false biometric or encryption claims.
- [ ] No unnecessary device-location request.
- [ ] No secrets or `.env` files are committed.
- [ ] Every visible control works or is clearly marked planned/unavailable.

## 13. Antigravity execution protocol

1. Read this entire file before proposing implementation.
2. Treat it as the authoritative product and execution brief.
3. Do not start feature coding until repository/environment checks are complete.
4. Work on one phase and one small task at a time.
5. Before editing, list files expected to change and explain why.
6. Never overwrite/delete existing work without explaining and obtaining approval.
7. Explain the purpose of any additional dependency before installing it.
8. Never put secrets in source code.
9. Do not claim a feature is complete until it has been run and tested.
10. After each task, report changed files, commands, test results and remaining issues.
11. Stop and wait for approval before moving to the next task.
12. Preserve the approved purple/violet colour direction; do not copy reference layouts.
13. Ask before making major decisions not specified here.

## 14. Immediate next action — Phase 0 only

**Do not build dashboards or features yet.**

First:
1. Inspect the cloned repository and current files.
2. Check Node.js and npm versions.
3. Confirm terminal is in the EMPRO repository root.
4. Report findings and any setup issue.
5. Only after confirmation, initialize Vite + React + TypeScript in the repository root.

Do not overwrite the existing Git repository or create a nested `EMPRO/EMPRO` folder. Preserve `.git` and repository history.

## 15. Definition of success

EMPRO succeeds when one person can manage company-related work and personal development through one persistent identity while retaining control over what belongs to them and what belongs to the employer.

The prototype must make this distinction immediately understandable, look polished and work reliably during a live demonstration.

**Your Professional Identity. Your Personal World.**
