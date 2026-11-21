
# EMPRO — UI REDESIGN MASTER INSTRUCTIONS

## 1. Objective

Completely redesign the EMPRO user interface.

Use the visual design language of my existing VISION application as the primary reference. I want a premium, modern, dark dashboard experience.

IMPORTANT:
- Take inspiration from VISION's visual style, not its layout.
- EMPRO must have its own product-specific layouts.
- The reference images I provide are for colours and visual mood only.
- Do not copy their layouts.
- Do not make minor cosmetic changes. Redesign the interface properly.

## 2. Visual Identity

Use a deep-space navy and blue theme.

Suggested colours:
- Background: #080D1B
- Main surface: #10182A
- Elevated surface: #151F35
- Primary accent: electric blue
- Secondary accent: cyan
- Main text: near-white
- Secondary text: cool grey-blue

Use:
- Inter typography
- Clean spacing
- Subtle borders
- Consistent rounded cards
- Professional icons
- Restrained gradients
- Clear visual hierarchy

Avoid:
- Excessive neon effects
- Random gradients
- Unnecessary glowing cards
- Generic template dashboards
- Oversized empty sections
- Too many decorative elements

## 3. Application Layout

Create a cohesive application shell.

Desktop:
- Left sidebar navigation
- EMPRO logo and branding
- Main dashboard content
- Compact top navigation bar
- Notifications
- Profile menu
- Collapsible sidebar

Navigation sections:

PROFESSIONAL
- Overview
- Digital ID
- Attendance
- Salary & Salary Vault
- Leave
- Meetings
- Documents
- Professional Copilot

PERSONAL
- Personal Overview
- My Profile
- Diary & Notes
- Achievements
- Goals & Tasks
- Life Timeline
- Community
- Personal Copilot
- Privacy & Sharing

Only show modules that exist or are clearly marked as coming soon.

## 4. Employee Professional Dashboard

Design a dashboard containing:

- Welcome message
- Employee identity and company information
- Attendance status
- Leave balance
- Monthly salary summary
- Upcoming meetings
- Notifications
- Professional Copilot

Use visual cards and meaningful information hierarchy.

Include:
- Weekly attendance chart
- Salary gross-to-net breakdown
- Leave balance visualization
- Upcoming meetings timeline

Use real application data or clearly labelled demo data.

## 5. Employee Personal Dashboard

This must feel like a separate private workspace.

Include:
- Personal profile summary
- Goals and progress
- Upcoming tasks
- Diary and notes shortcut
- Achievement timeline
- Personal calendar
- Community updates
- Personal Copilot

Use:
- Goal progress bars
- Achievement cards
- Timeline visualizations
- Calendar views
- Task completion indicators

Never expose private diary content on Professional dashboards.

## 6. HR Dashboard

Create a separate HR-focused dashboard.

Include:
- Total employees
- Active workforce
- Attendance overview
- Pending leave approvals
- Payroll processing status
- Department distribution
- Attendance trends
- Recent HR activity

Use appropriate charts and aggregated information.

## 7. Manager Dashboard

Create a team-focused dashboard.

Include:
- Team size
- Team availability
- Team attendance
- Pending leave requests
- Upcoming meetings
- Team activity
- Attendance trends

Managers must only see information allowed by their permissions.

## 8. Visual Analytics

Use graphs and pictorial representations wherever they improve understanding.

Examples:

Attendance:
- Weekly and monthly bar charts
- Attendance calendar
- Punctuality trends

Salary:
- Gross versus deductions
- Net salary breakdown
- Monthly salary history

Leave:
- Leave balance by category
- Leave calendar

HR:
- Department distribution
- Workforce status
- Attendance trends

Personal:
- Goal progress
- Achievement timeline
- Task completion trends

Community:
- Profile cards
- Interest categories
- Activity feed

Use Recharts if the project does not already have a suitable chart library.

Charts must:
- Be responsive
- Have readable labels
- Include tooltips where useful
- Use correct units
- Use actual or labelled demo data
- Show empty states when data is unavailable

Never invent analytics and present them as real.

## 9. Important Module Designs

Digital ID:
- Employee photograph or avatar
- Employee ID
- Name
- Designation
- Department
- Company
- Joining date
- Employment status
- QR verification area

Attendance:
- Check-in/check-out
- Today's timeline
- Attendance history
- Weekly/monthly charts
- Correction requests

Salary:
- Gross salary
- Deductions
- Net salary
- Salary history
- Payslips
- Salary revisions

Leave:
- Leave balances
- Apply for leave
- Request history
- Approval status
- Calendar

Diary:
- Minimal private writing interface
- Quick notes
- Search
- Tags
- Date navigation

Achievements:
- Certificate cards
- Project cards
- Awards
- Courses
- Timeline
- Visibility controls

Visibility options:
- Private
- Selected connections
- Current company
- Public

Community:
- Cross-company employee discovery
- Profile cards
- Posts
- Interest groups
- Connections
- Messaging where implemented

Copilots:
- Separate Professional and Personal interfaces
- Separate conversation histories
- Clear privacy boundaries
- Loading and error states

## 10. Security and Functional Requirements

- Do not weaken authentication or backend permissions.
- Do not expose personal data to company administrators.
- Do not expose diary entries in professional views.
- Respect achievement visibility permissions.
- Do not claim biometric authentication unless implemented.
- Do not claim encryption unless implemented.
- Do not replace working backend functionality with static UI.
- Every visible button must work or be clearly marked unavailable.

## 11. Responsive Design

Desktop:
- Sidebar
- Multi-column dashboards
- Spacious layouts

Tablet:
- Collapsible sidebar
- Adapted card grids

Mobile:
- Single-column layouts
- Mobile navigation
- Responsive charts
- Comfortable touch targets

## 12. Development Sequence

PHASE 1:
Audit existing project, routes, components, and working features.

PHASE 2:
Create design tokens, typography, navigation, sidebar, topbar, and reusable components.

PHASE 3:
Redesign Employee Professional Dashboard.

PHASE 4:
Redesign Employee Personal Dashboard.

PHASE 5:
Redesign HR and Manager dashboards.

PHASE 6:
Redesign individual module pages.

PHASE 7:
Add graphs, visualizations, responsive behaviour, and polish.

PHASE 8:
Test all routes, actions, authentication, and existing backend functionality.

Do not skip phases.

## 13. Strict Instructions

- Inspect before editing.
- Preserve existing working functionality.
- Do not delete files without justification.
- Do not redesign the database as part of this UI task.
- Do not install unnecessary dependencies.
- Do not generate the entire application in one uncontrolled operation.
- Do not proceed to the next phase without approval.

START WITH PHASE 1 ONLY.

First inspect the repository and present:
1. Current project structure
2. Existing routes
3. Existing working features
4. UI problems
5. Proposed new layout
6. Files that need modification

Do not modify code until I approve the audit and proposal.

