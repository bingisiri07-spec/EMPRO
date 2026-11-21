# EMPRO Prototype Implementation Plan

> **Product Tagline:** Your Professional Identity. Your Personal World.  
> **Status:** Architecture & Prototype Blueprint  
> **Target:** High-fidelity, demo-ready prototype demonstrating complete domain separation.

---

## 1. Executive Summary & Vision

EMPRO bridges the gap between enterprise workforce tools (HRMS) and personal life management. Unlike traditional HR platforms where employee data vanishes or remains locked inside company silos upon exit, EMPRO introduces a **dual-domain architecture**:
- **Professional Domain:** Managed by the employer (Attendance, Leave, Salary Vault, Meetings, Company Docs, Professional Copilot).
- **Personal Domain:** Solely owned by the individual (Private Diary, Achievements, Life Timeline, Cross-Company Community, Personal Copilot).

The prototype must provide a pitch-ready, interactive experience showcasing how these two lives coexist within one unified interface while maintaining strict security boundaries and privacy by design.

---

## 2. Technical Stack & Architecture

### Recommended Stack
- **Framework:** React 18+ with Vite (blazing fast HMR, minimal overhead).
- **Styling & UI:** Tailwind CSS + Lucide React (clean, enterprise-grade aesthetic).
- **State Management & Mock Store:** Reactive state store (Zustand or Context API) initialized with rich, deterministic demo datasets (Employee, HR Admin, Manager).
- **Charts & Visualizations:** Recharts (for Salary breakdown, attendance analytics, timeline).
- **Backend Readiness:** Supabase-compatible data schema (TypeScript interfaces matching Postgres tables with Row Level Security awareness).
- **AI Integration:** Dual Copilot interfaces with distinct prompt contexts and fallback demo responses for zero-latency, zero-downtime pitching.

### System Architecture Diagram
```
+--------------------------------------------------------------------------+
|                       EMPRO Unified Application Shell                    |
|  [Persistent Persona / Switcher: Employee | Manager | HR Admin]           |
+--------------------------------------------------------------------------+
              |                                              |
              v                                              v
+-------------------------------+             +------------------------------+
|      PROFESSIONAL DOMAIN      |             |       PERSONAL DOMAIN        |
| (Company-Controlled Context)   |             | (Individual-Controlled Space)|
|                               |             |                              |
| - Digital ID Card & QR        |             | - Demo PIN / Biometric Lock  |
| - Daily Attendance (Check-in) |             | - Encrypted Private Diary    |
| - Leave Balances & Requests   |             | - Achievement Showcase       |
| - Salary Vault & Breakdown    |             |   (4-tier visibility matrix) |
| - Meetings & Agendas          |             | - Life Goals & Timeline      |
| - Professional AI Copilot     |             | - Cross-Company Community    |
|   (Company policies & tasks)  |             | - Personal AI Copilot        |
+-------------------------------+             +------------------------------+
              |                                              |
              +-----------------------+----------------------+
                                      |
                                      v
                        +----------------------------+
                        |   Deterministic Seed Data  |
                        |   & Dual-Isolated Storage  |
                        +----------------------------+
```

---

## 3. Screen Breakdown & Key Workflows

### 3.1 Global Shell & Entry Experience
1. **Persona Quick-Switch Bar:** Floating header pill allowing the presenter to switch between **Employee (Alex Rivera)**, **Manager (Sarah Jenkins)**, and **HR Director (Marcus Vance)** in 1 click.
2. **Domain Switcher:** A prominent toggle in the navigation bar switching between **Work (Professional)** and **Life (Personal)**.
3. **Personal Domain Lock Screen:** When toggling to Personal mode, a sleek security gate prompts for authentication ("Demo Passkey / Quick PIN: `1234`" with honest labelling).

### 3.2 Professional Domain Screens
1. **Digital ID & Overview Dashboard:**
   - Real-time time & greeting, check-in button with simulated geolocation tag.
   - Interactive Digital ID card with QR code and employee credentials.
   - Quick attendance status (8h 12m today, On Time streak: 14 days).
   - Upcoming meeting alert with 1-click meeting note summarizer.
2. **Salary Vault & Compensation Breakdown:**
   - Net take-home summary, interactive pay slip breakdown (Basic, HRA, Allowances, PF, Tax, Leaves).
   - Month-over-month salary revision comparison chart.
   - Download sample payslip (simulated PDF export).
3. **Attendance & Leave Hub:**
   - Monthly calendar heat-map showing Present, Late, Half-Day, Holidays.
   - Leave balances: Casual (6 left), Sick (8 left), Earned (14 left).
   - Instant "Apply Leave" modal with auto-balance deduction.
4. **Professional Copilot Drawer:**
   - Context-aware sidebar: answers questions strictly regarding company leave policies, salary slips, meeting follow-ups.
   - Cannot read personal diary or notes.

### 3.3 Personal Domain Screens
1. **Private Diary & Quick Capture:**
   - Rich-text / markdown thoughts, mood selector, tag filters (`#ideas`, `#reflections`, `#learning`).
   - Visual lock icon confirming: *"Company administrators have 0 access to this vault."*
2. **Achievements & Credentials Vault:**
   - Cards showcasing certifications (AWS, PMP), hackathon wins, published articles.
   - **4-Tier Visibility Selector:**
     - 🔒 *Private* (Only Me)
     - 👥 *Selected Connections*
     - 🏢 *Current Company* (Nexus Technologies)
     - 🌐 *Public / Portfolio*
3. **Life Timeline & Personal Goals:**
   - Career milestones dating back past previous employers (demonstrating portable identity).
   - Personal quarterly goals (e.g., "Complete Rust Course", "Run 10k Marathon").
4. **Cross-Company Community Feed:**
   - Global discussion board categorized by communities (Engineering, Leadership, Design, AI).
   - Mentorship connection requests and peer badges.
5. **Personal Copilot:**
   - Reflective, warm assistant helping with personal growth, learning plans, and work-life balance.

---

## 4. Step-by-Step Implementation Roadmap

| Phase | Milestone | Deliverables | Est. Effort |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Foundation & Setup** | Vite + React + Tailwind scaffold, design system tokens, layout shell, navigation switcher. | Step 1 |
| **Phase 2** | **Professional Domain** | Digital ID card, Attendance clock-in widget, Salary Vault with breakdown charts, Leave modal. | Step 2 |
| **Phase 3** | **Personal Domain & Security** | Demo lock modal, Private Diary (CRUD), Achievements vault with visibility tags, Life Timeline. | Step 3 |
| **Phase 4** | **Cross-Company Community & Copilots** | Community feed & connection cards, Dual AI Copilot drawer with isolated contexts. | Step 4 |
| **Phase 5** | **Manager / HR Views & Demo Polish** | Role switcher support (Manager approval view, HR directory), polish animations, responsive tweaks. | Step 5 |

---

## 5. Seed Data & Persona Profiles

To ensure an impressive, zero-glitch live pitch, the prototype includes pre-baked deterministic data:

- **Employee Persona:** `Alex Rivera` — Lead Frontend Engineer at `Nexus Technologies` (Joined: March 2023, Emp ID: `NX-4092`).
  - *Salary:* Gross ₹1,85,000 / Net ₹1,46,200.
  - *Previous Company in History:* `Apex Labs` (2020-2023) — showing portable identity.
  - *Personal Achievements:* AWS Certified Solutions Architect, Hackathon 1st Place 2024.
- **Manager Persona:** `Sarah Jenkins` — Engineering Director (Pending leave approvals, team attendance overview).
- **HR Persona:** `Marcus Vance` — Head of People Ops (Company-wide headcount, payroll disbursement status).

---

## 6. Truthful Engineering & Safety Rules

1. **Explicit Security Labelling:** The personal unlock screen clearly states: *"Demo Lock Simulation (PIN: 1234) — Production uses WebAuthn/Passkey device biometrics"*.
2. **Strict Context Boundaries:** Personal Copilot and Professional Copilot do not cross-talk or leak data across boundaries.
3. **Data Portability Demonstration:** Clearly highlight that when Alex switches companies in the demo, his Personal Diary, Achievements, and Community connections remain 100% untouched.

---

## 7. Next Actions to Execute

1. Initialize the Vite + React + Tailwind project in `C:\Users\ADMIN\Desktop\EMPRO`.
2. Install necessary UI libraries (`lucide-react`, `clsx`, `tailwind-merge`, `canvas-confetti`).
3. Build the core components iteratively in testable stages.
