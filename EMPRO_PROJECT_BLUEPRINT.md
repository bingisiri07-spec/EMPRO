# EMPRO --- Product Vision & Project Blueprint

**Working product name:** EMPRO  
**Product tagline:** Your Professional Identity. Your Personal World.  
**Document purpose:** Master project brief for the EMPRO build. Use this as the primary product-context document when working with Antigravity or other AI development tools.

---

## 1. Product overview

EMPRO is an employee-centric digital ecosystem that brings professional workforce management and personal life management into one application while keeping the two domains logically and securely separate.

Every person has one persistent EMPRO identity. Their **Professional** space contains company-managed employment information and workplace tools. Their **Personal** space belongs to the individual and remains theirs even when they change employers.

The product is designed around a simple principle:

> Your professional life may change when you change companies. Your personal identity, achievements, goals, notes and connections should remain yours.

EMPRO is not just an HR dashboard. It combines employee self-service, workforce administration, personal productivity, professional identity, community and two carefully separated AI copilots.

## 2. Core product principles

1. **One permanent individual identity:** a person's EMPRO identity persists across employment changes.
2. **Two separate domains:** Professional and Personal data have separate access rules and context boundaries.
3. **Employee ownership:** personal notes, diary, goals, achievements and personal connections belong to the individual.
4. **Company-controlled professional records:** access to employment records is based on company membership and assigned permissions.
5. **Privacy by design:** company administrators must not be able to browse an employee's Personal domain or personal Copilot conversations.
6. **Explicit sharing:** achievements and profile information are private by default and shared only at the employee's chosen visibility level.
7. **Reliable experience:** the application must remain usable when an external AI service or network dependency is unavailable.
8. **Truthful security:** never label a visual demo unlock as real biometric authentication. Never claim encryption or verification that has not actually been implemented.

## 3. The two domains

### 3.1 Professional domain
The Professional domain is the employee's company workspace. It contains company-related identity, records, workflows and tools. Access depends on the user's active company membership and role.

- **Employee professional profile & digital ID:** Photo, Employee ID, Company, Department, Designation, Joining date, QR-based identity verification, LinkedIn/GitHub links.
- **Attendance:** Daily check-in/out, working hours, late arrivals, weekly/monthly summaries, correction requests.
- **Leave management:** Casual, sick, earned, unpaid leave balances, calendar, requests and approvals.
- **Salary tracker and Salary Vault:** Gross/Net salary breakdown, Basic pay, HRA, allowances, PF, tax, revisions, month-over-month comparisons, payslip download simulation.
- **Meetings and schedules:** Upcoming/past meetings, notes, action items.
- **Professional documents:** Offer letters, payslips, relieving letters, certificates.
- **Professional Copilot:** Policy explainer, salary breakdown helper, meeting summarizer (strictly isolated from Personal data).
- **Company, HR and manager workspace:** Organization codes, employee directory, leave approvals, payroll oversight.

### 3.2 Personal domain
The Personal domain is owned by the individual, not the employer.

- **Personal profile & identity:** Bio, education, interests, personal goals.
- **Private diary and notes:** Quick Capture, date-based entries, tags, search, attachments. Private by default.
- **Achievements and certificates:** Academic, hackathons, certifications with 4-tier visibility (Private, Selected Connections, Company, Public).
- **Personal productivity:** Goals, to-do lists, Life Timeline.
- **EMPRO Community:** Cross-company professional networking, interest groups (AI/ML, FinTech, Design), posts, mentorship.
- **Personal Copilot:** Friendly coach for personal growth, career, reflections (strictly isolated from company records).
- **Personal domain security:** Session lock, Passkey / Demo PIN unlock with explicit truthfulness in labelling.

## 4. Identity & Membership Model
- One persistent EMPRO identity per person.
- One active company workspace at any time; multiple historical records.
- When leaving a company: company workspace access is revoked, but personal domain and achievements remain intact.

## 5. Non-goals and Truthful Engineering
- Never fake biometric authentication — clearly label demo locks.
- Never pass personal context to the professional copilot or vice-versa.
- Never hardcode irreversible payroll formulas without clear labelling as configurable sample estimates.
