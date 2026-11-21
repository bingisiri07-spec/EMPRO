import { 
  Persona, 
  AttendanceRecord, 
  SalaryBreakdown, 
  LeaveBalance, 
  LeaveRequest, 
  MeetingItem, 
  AchievementItem, 
  DiaryEntry, 
  PersonalGoal, 
  CommunityPost,
  CompanyEvent,
  EventContributionRequest,
  CompanyProject,
  RecommendedContributor,
  ProjectContributionRecord,
  DecisionSimulationReport
} from '../types';

export const DEMO_PERSONAS: Record<string, Persona> = {
  employee: {
    id: 'usr_alex_rivera',
    name: 'Alex Rivera',
    email: 'employee@demo.empro.app',
    role: 'employee',
    roleLabel: 'Senior Employee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    designation: 'Lead Frontend Engineer',
    department: 'Engineering & Platform',
    employeeId: 'NX-4092',
    company: 'Nexus Technologies Ltd',
    companyId: 'org_nexus_tech',
    joinedDate: '15 Mar 2023',
    employmentStatus: 'Active',
    workEmail: 'alex.rivera@nexustech.io',
    personalEmail: 'alex.rivera.dev@gmail.com',
    location: 'Bangalore, India (Hybrid)',
    previousCompany: 'Apex Labs Inc (2020 - 2023)',
    previousTenure: '3 years 2 months',
  },
  manager: {
    id: 'usr_sarah_jenkins',
    name: 'Sarah Jenkins',
    email: 'manager@demo.empro.app',
    role: 'manager',
    roleLabel: 'Engineering Director',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    designation: 'Director of Engineering',
    department: 'Engineering & Platform',
    employeeId: 'NX-1048',
    company: 'Nexus Technologies Ltd',
    companyId: 'org_nexus_tech',
    joinedDate: '10 Jan 2021',
    employmentStatus: 'Active',
    workEmail: 'sarah.jenkins@nexustech.io',
    personalEmail: 'sarah.j.tech@gmail.com',
    location: 'Bangalore, India',
  },
  hr: {
    id: 'usr_marcus_vance',
    name: 'Marcus Vance',
    email: 'hr@demo.empro.app',
    role: 'hr',
    roleLabel: 'Head of People Ops',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    designation: 'VP of People Operations',
    department: 'Human Resources',
    employeeId: 'NX-0082',
    company: 'Nexus Technologies Ltd',
    companyId: 'org_nexus_tech',
    joinedDate: '01 Jun 2019',
    employmentStatus: 'Active',
    workEmail: 'marcus.vance@nexustech.io',
    personalEmail: 'marcus.vance@outlook.com',
    location: 'Mumbai, India',
  }
};

export const MOCK_ATTENDANCE_WEEK: AttendanceRecord[] = [
  { date: '17 Nov', day: 'Mon', checkIn: '09:05 AM', checkOut: '06:15 PM', hoursWorked: 8.2, expectedHours: 8.0, status: 'Present', locationTag: 'Nexus Tech HQ - 4th Floor' },
  { date: '18 Nov', day: 'Tue', checkIn: '09:12 AM', checkOut: '06:30 PM', hoursWorked: 8.3, expectedHours: 8.0, status: 'Present', locationTag: 'Nexus Tech HQ - 4th Floor' },
  { date: '19 Nov', day: 'Wed', checkIn: '09:42 AM', checkOut: '06:12 PM', hoursWorked: 7.5, expectedHours: 8.0, status: 'Late', locationTag: 'Remote / Home' },
  { date: '20 Nov', day: 'Thu', checkIn: '08:55 AM', checkOut: '05:58 PM', hoursWorked: 8.1, expectedHours: 8.0, status: 'Present', locationTag: 'Nexus Tech HQ - 4th Floor' },
  { date: '21 Nov', day: 'Fri', checkIn: '09:10 AM', checkOut: '--:--', hoursWorked: 6.8, expectedHours: 8.0, status: 'Present', locationTag: 'Nexus Tech HQ - 4th Floor' },
];

export const MOCK_SALARY_DATA: SalaryBreakdown = {
  month: 'November',
  year: 2026,
  grossSalary: 185000,
  netSalary: 146200,
  basicPay: 92500,
  hra: 46250,
  specialAllowance: 36250,
  performanceBonus: 10000,
  providentFund: 11100,
  professionalTax: 200,
  incomeTaxTds: 25200,
  otherDeductions: 2300,
  payoutDate: '30 Nov 2026',
  status: 'Processing',
  pdfFilename: 'Payslip_NX_4092_Nov2026.pdf',
};

export const MOCK_LEAVE_BALANCES: LeaveBalance = {
  casual: { available: 6, total: 12 },
  sick: { available: 8, total: 10 },
  earned: { available: 14, total: 18 },
  unpaid: { taken: 0 },
};

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lv_001',
    employeeName: 'Alex Rivera',
    employeeId: 'NX-4092',
    type: 'Casual',
    startDate: '28 Nov 2026',
    endDate: '29 Nov 2026',
    days: 2,
    reason: 'Family event and personal travel',
    status: 'Pending',
    appliedDate: '20 Nov 2026',
  },
  {
    id: 'lv_002',
    employeeName: 'Alex Rivera',
    employeeId: 'NX-4092',
    type: 'Sick',
    startDate: '04 Oct 2026',
    endDate: '05 Oct 2026',
    days: 2,
    reason: 'Viral fever and recovery',
    status: 'Approved',
    appliedDate: '03 Oct 2026',
    approver: 'Sarah Jenkins',
  }
];

export const MOCK_MEETINGS: MeetingItem[] = [
  {
    id: 'mt_01',
    title: 'Core Platform Architecture Sync',
    time: '02:30 PM - 03:30 PM',
    date: 'Today, 21 Nov',
    duration: '60 min',
    type: 'Engineering',
    location: 'Meeting Room 4B / Google Meet',
    isOnline: true,
    meetingLink: 'https://meet.google.com/empro-eng-sync',
    participants: ['Sarah Jenkins', 'Alex Rivera', 'David Kim', 'Elena Rostova'],
    summary: 'Evaluating frontend state migration and latency improvements.',
    actionItems: ['Alex: Finalize cache invalidation benchmark', 'Elena: Prepare mock schema'],
  },
  {
    id: 'mt_02',
    title: 'Bi-Weekly 1-on-1 with Sarah Jenkins',
    time: '04:00 PM - 04:30 PM',
    date: 'Today, 21 Nov',
    duration: '30 min',
    type: '1-on-1',
    location: 'Director Cabin / Google Meet',
    isOnline: true,
    participants: ['Sarah Jenkins', 'Alex Rivera'],
  },
  {
    id: 'mt_03',
    title: 'All-Hands Product Roadmap Q1 2027',
    time: '11:00 AM - 12:30 PM',
    date: 'Tomorrow, 22 Nov',
    duration: '90 min',
    type: 'Company All-Hands',
    location: 'Nexus Townhall Auditorium',
    isOnline: false,
    participants: ['Company-wide (142 members)'],
  }
];

export const MOCK_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach_01',
    title: 'AWS Certified Solutions Architect — Associate',
    issuer: 'Amazon Web Services',
    date: 'Aug 2024',
    category: 'Certification',
    visibility: 'public',
    credentialId: 'AWS-PSA-894102',
    description: 'Cloud architectural design, resilient distributed systems, and cost optimization.',
    badgeColor: '#06B6D4',
  },
  {
    id: 'ach_02',
    title: 'National AI/Dev Hackathon — 1st Place',
    issuer: 'Global Tech Council',
    date: 'Mar 2024',
    category: 'Hackathon',
    visibility: 'company',
    description: 'Built an open-source real-time privacy filter for autonomous agents.',
    badgeColor: '#3B82F6',
  },
  {
    id: 'ach_03',
    title: 'Published Paper: Zero-Leakage Agentic Context Boundaries',
    issuer: 'IEEE Computer Society Preprint',
    date: 'Oct 2023',
    category: 'Publication',
    visibility: 'connections',
    description: 'Exploring deterministic isolation models for hybrid personal/enterprise AI copilots.',
    badgeColor: '#10B981',
  },
  {
    id: 'ach_04',
    title: 'Private Angel Investment & Advisory Portfolio',
    issuer: 'Self-Directed',
    date: '2023 - Present',
    category: 'Project',
    visibility: 'private',
    description: 'Personal reflections, angel fundings, and private startup mentorship notes.',
    badgeColor: '#8B5CF6',
  }
];

export const MOCK_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: 'dr_01',
    title: 'Designing with boundaries: Lessons from EMPRO architecture',
    content: 'Building software that respects human autonomy requires separating who you work for from who you are. The personal domain must never be an afterthought in enterprise software.',
    date: '20 Nov 2026',
    mood: 'Energized',
    tags: ['Architecture', 'Philosophy', 'Product'],
    isFavorite: true,
    isPrivate: true,
  },
  {
    id: 'dr_02',
    title: 'Morning reflection: Pushing beyond comfort in systems design',
    content: 'Spent 2 hours reviewing Rust async runtime internals. It is challenging, but building deep competence in concurrent systems is my top personal goal for Q4.',
    date: '17 Nov 2026',
    mood: 'Focused',
    tags: ['Rust', 'Learning', 'Discipline'],
    isFavorite: false,
    isPrivate: true,
  }
];

export const MOCK_PERSONAL_GOALS: PersonalGoal[] = [
  {
    id: 'gl_01',
    title: 'Complete Advanced Rust Systems Architecture',
    category: 'Learning',
    progress: 75,
    targetDate: '15 Dec 2026',
    status: 'In Progress',
  },
  {
    id: 'gl_02',
    title: 'Bangalore 10K Marathon Training (Target: Sub 48m)',
    category: 'Health',
    progress: 60,
    targetDate: '10 Jan 2027',
    status: 'In Progress',
  },
  {
    id: 'gl_03',
    title: 'Open Source Security Auditor Tool Release',
    category: 'Career',
    progress: 90,
    targetDate: '30 Nov 2026',
    status: 'In Progress',
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'cp_01',
    authorName: 'Vikram Sethi',
    authorCompany: 'Aura Fintech',
    authorRole: 'Head of Infrastructure',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    content: 'How are teams handling real-time data sync between multi-tenant PostgreSQL clusters and edge workers without introducing cold-start spikes? Sharing our benchmarks below 🚀',
    tags: ['Databases', 'EdgeComputing', 'PostgreSQL'],
    likes: 42,
    commentsCount: 16,
    timestamp: '2 hours ago',
    userLiked: true,
  },
  {
    id: 'cp_02',
    authorName: 'Nadia Chen',
    authorCompany: 'Hyperion AI Labs',
    authorRole: 'Staff Research Engineer',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    content: 'Excited to announce our open benchmark for contextual boundary safety in enterprise agents. Individuals should own their reflections; companies should own company assets. Both can coexist cleanly.',
    tags: ['AIResearch', 'Privacy', 'Ethics'],
    likes: 89,
    commentsCount: 31,
    timestamp: '5 hours ago',
    userLiked: false,
  }
];

// ============================================================================
// MOCK COMPANY EVENTS
// ============================================================================
export const MOCK_EVENTS: CompanyEvent[] = [
  {
    id: 'evt_01',
    title: 'AI Agents in Production: High-Concurrency Architecture Summit',
    description: 'Deep-dive symposium on deploying autonomous multi-agent pipelines with deterministic guardrails and sub-second latency.',
    category: 'Technical Meetup',
    startDate: '2026-11-28T09:30:00Z',
    endDate: '2026-11-28T16:00:00Z',
    venueOrLink: 'Auditorium Alpha, Tech Horizon Park & Virtual Stream',
    isOnline: false,
    organizerName: 'Sarah Jenkins',
    organizerId: 'usr_sarah_jenkins',
    organizerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    registrationDeadline: '2026-11-27T18:00:00Z',
    status: 'upcoming',
    registeredCount: 84,
    maxAttendees: 120,
    availableOpportunities: [
      'Technical Session Coordination',
      'Workshop Assistance',
      'Technical Support & AV'
    ],
    scheduleAgenda: [
      { time: '09:30 AM', activity: 'Registration, Badging & Morning Coffee' },
      { time: '10:00 AM', activity: 'Keynote: Scalable LLM Agent Orchestration', speaker: 'Sarah Jenkins' },
      { time: '11:30 AM', activity: 'Panel: Enterprise Privacy & Guardrail Boundaries' },
      { time: '02:00 PM', activity: 'Hands-on Workshop: Edge-Native Tool Invocations' },
      { time: '04:00 PM', activity: 'Q&A, Peer Networking & Closing' }
    ],
    participationRequirements: [
      'Basic knowledge of distributed systems and TypeScript/Python',
      'Laptop with Node 20+ and Docker installed for hands-on sessions'
    ],
    isRegistered: true,
    userContributionStatus: 'approved',
    userAttended: false
  },
  {
    id: 'evt_02',
    title: 'Q4 Nexus Innovation Hackathon: Organizational Intelligence',
    description: 'Annual 48-hour internal hackathon to build intelligent workforce prototypes, automated workflows, and data visualizations.',
    category: 'Hackathon',
    startDate: '2026-12-05T08:00:00Z',
    endDate: '2026-12-07T18:00:00Z',
    venueOrLink: 'Nexus Innovation Hub (Floors 3 & 4)',
    isOnline: false,
    organizerName: 'Marcus Vance',
    organizerId: 'usr_marcus_vance',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    registrationDeadline: '2026-12-02T23:59:00Z',
    status: 'upcoming',
    registeredCount: 142,
    maxAttendees: 200,
    availableOpportunities: [
      'Event Hosting & Emcee',
      'Design & Creative Work',
      'Logistics & Management',
      'Content Preparation'
    ],
    scheduleAgenda: [
      { time: 'Day 1 - 08:00 AM', activity: 'Team Formation & Problem Statement Reveal' },
      { time: 'Day 1 - 10:00 AM', activity: 'Hacking Commences' },
      { time: 'Day 2 - 04:00 PM', activity: 'Code Freeze & Architecture Submissions' },
      { time: 'Day 3 - 02:00 PM', activity: 'Live Demos & Executive Jury Evaluation' }
    ],
    participationRequirements: [
      'Open to all engineering, design, product, and HR team members',
      'Teams of 3 to 5 contributors'
    ],
    isRegistered: false,
    userContributionStatus: 'none',
    userAttended: false
  },
  {
    id: 'evt_03',
    title: 'Cloud Cost Optimization & Multi-Region Resiliency Workshop',
    description: 'Practical training on right-sizing compute clusters, caching strategies, and reducing serverless egress bills.',
    category: 'Workshop',
    startDate: '2026-11-22T14:00:00Z',
    endDate: '2026-11-22T17:00:00Z',
    venueOrLink: 'Google Meet (meet.google.com/nex-arch-sync)',
    isOnline: true,
    organizerName: 'Sarah Jenkins',
    organizerId: 'usr_sarah_jenkins',
    organizerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    registrationDeadline: '2026-11-22T12:00:00Z',
    status: 'ongoing',
    registeredCount: 65,
    maxAttendees: 80,
    availableOpportunities: ['Workshop Assistance', 'Technical Support & AV'],
    scheduleAgenda: [
      { time: '02:00 PM', activity: 'Cloud Billing Analysis & Heatmaps' },
      { time: '03:15 PM', activity: 'Live Remediation Demo: Ghost Clusters & Storage Tiers' },
      { time: '04:30 PM', activity: 'Interactive Q&A' }
    ],
    isRegistered: true,
    userContributionStatus: 'none',
    userAttended: true
  },
  {
    id: 'evt_04',
    title: 'Nexus Annual Foundation Day & Awards Gala 2026',
    description: 'Celebrating 5 years of Nexus Technologies. Recognizing top quarterly achievements, innovation honors, and long-standing team members.',
    category: 'Company Celebration',
    startDate: '2026-10-15T18:00:00Z',
    endDate: '2026-10-15T22:30:00Z',
    venueOrLink: 'Grand Ballroom, The Leela Palace, Bangalore',
    isOnline: false,
    organizerName: 'Marcus Vance',
    organizerId: 'usr_marcus_vance',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    registrationDeadline: '2026-10-10T23:59:00Z',
    status: 'completed',
    registeredCount: 380,
    maxAttendees: 400,
    availableOpportunities: ['Event Hosting & Emcee', 'Design & Creative Work'],
    scheduleAgenda: [
      { time: '06:00 PM', activity: 'Red Carpet & Welcome Reception' },
      { time: '07:30 PM', activity: 'Annual Keynote & Awards Ceremony' },
      { time: '09:00 PM', activity: 'Dinner & Live Musical Performance' }
    ],
    isRegistered: true,
    userContributionStatus: 'approved',
    userAttended: true
  }
];

export const MOCK_EVENT_CONTRIBUTIONS: EventContributionRequest[] = [
  {
    id: 'cr_01',
    eventId: 'evt_01',
    eventTitle: 'AI Agents in Production: High-Concurrency Architecture Summit',
    employeeId: 'usr_alex_rivera',
    employeeName: 'Alex Rivera',
    employeeEmail: 'alex.rivera@nexustech.io',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    department: 'Engineering & Platform',
    contributionCategory: 'Technical Session Coordination',
    relevantSkills: ['Agent Orchestration', 'TypeScript', 'Live Demos', 'Technical Speaking'],
    description: 'Can manage the interactive live demo station and assist speakers with hands-on cluster setups during the edge invocation breakout.',
    availability: 'Full event duration (09:00 AM - 05:00 PM)',
    status: 'approved',
    assignedRole: 'Live Demo Lead & Technical Coordinator',
    reviewerNotes: 'Approved by Sarah Jenkins. Assigned to oversee the Hands-on breakout session.',
    submittedAt: '2026-11-20T11:30:00Z'
  },
  {
    id: 'cr_02',
    eventId: 'evt_02',
    eventTitle: 'Q4 Nexus Innovation Hackathon: Organizational Intelligence',
    employeeId: 'usr_priya_sharma',
    employeeName: 'Priya Sharma',
    employeeEmail: 'priya.s@nexustech.io',
    employeeAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
    department: 'Product & Design',
    contributionCategory: 'Design & Creative Work',
    relevantSkills: ['Figma', 'Brand Guidelines', 'Slide Decks', 'Badge Design'],
    description: 'I would love to design the official event badges, digital pitch templates, and certificate graphics for the winners.',
    availability: '3-4 hours prep before hackathon + Day 3 presentation support',
    status: 'pending',
    submittedAt: '2026-11-21T14:15:00Z'
  }
];

// ============================================================================
// MOCK COMPANY PROJECTS
// ============================================================================
export const MOCK_PROJECTS: CompanyProject[] = [
  {
    id: 'prj_01',
    name: 'Apollo: Enterprise Knowledge Engine',
    description: 'Building an enterprise-wide contextual semantic search and organizational memory system indexing Slack, Jira, GitHub, and Google Drive.',
    department: 'Engineering & Platform',
    projectManager: 'Sarah Jenkins',
    projectManagerId: 'usr_sarah_jenkins',
    projectManagerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    startDate: '2026-09-01',
    expectedCompletionDate: '2026-12-20',
    status: 'active',
    progressPercentage: 74,
    requiredSkills: ['Vector Databases', 'TypeScript', 'Embeddings', 'React', 'UI/UX Design', 'Redis'],
    objectives: [
      'Sub-200ms vector semantic search across 200,000+ internal documents',
      'Granular department permission filters (HR, Engineering, Exec)',
      'Clean interactive chat sidebar embedded across internal web portals'
    ],
    milestones: [
      { id: 'm1', title: 'Data Ingestion & Embeddings Pipeline', dueDate: '2026-09-30', isCompleted: true },
      { id: 'm2', title: 'Vector DB Indexing & Hybrid Search POC', dueDate: '2026-10-31', isCompleted: true },
      { id: 'm3', title: 'UI Redesign & Front-end Integration', dueDate: '2026-11-30', isCompleted: false },
      { id: 'm4', title: 'Security Audit & General Availability', dueDate: '2026-12-20', isCompleted: false }
    ],
    teamMembers: [
      { id: 'usr_sarah_jenkins', name: 'Sarah Jenkins', role: 'Project Director', department: 'Engineering', allocationPercentage: 50, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250' },
      { id: 'usr_alex_rivera', name: 'Alex Rivera', role: 'Lead Frontend Engineer', department: 'Engineering', allocationPercentage: 80, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
      { id: 'usr_rohan_verma', name: 'Rohan Verma', role: 'Backend Data Architect', department: 'Data Eng', allocationPercentage: 100, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250' }
    ],
    isRequiringContributors: true,
    openRolesNeeded: [
      {
        roleTitle: 'Temporary UI/UX Product Designer',
        skillsNeeded: ['UI/UX Design', 'Figma', 'Design Systems', 'Data Visualization'],
        urgency: 'high',
        duration: '2 weeks (10-15 hrs/wk)',
        reason: 'Assigned designer is on unexpected leave. Needed to finalize Apollo query analytics dashboards and user query feedback components.'
      }
    ]
  },
  {
    id: 'prj_02',
    name: 'Sentient: Automated CI/CD Canary Pipeline',
    description: 'Intelligent canary release controller that analyzes error rates, p99 latency regressions, and automatically initiates rollbacks.',
    department: 'DevOps & Reliability',
    projectManager: 'Vikram Sethi',
    projectManagerId: 'usr_vikram_sethi',
    projectManagerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    startDate: '2026-10-15',
    expectedCompletionDate: '2027-01-30',
    status: 'active',
    progressPercentage: 42,
    requiredSkills: ['Kubernetes', 'Prometheus', 'Go', 'ArgoCD', 'Grafana'],
    objectives: [
      'Automated canary health scoring with 0 human intervention',
      'Zero false-positive automated rollbacks on staging and prod',
      'Unified deployment metrics dashboard'
    ],
    milestones: [
      { id: 'm1', title: 'Telemetry Metrics Ingestion', dueDate: '2026-11-15', isCompleted: true },
      { id: 'm2', title: 'Automated Rollback Webhooks', dueDate: '2026-12-15', isCompleted: false },
      { id: 'm3', title: 'Production Load Testing', dueDate: '2027-01-20', isCompleted: false }
    ],
    teamMembers: [
      { id: 'usr_vikram_sethi', name: 'Vikram Sethi', role: 'DevOps Architect', department: 'Platform', allocationPercentage: 70, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 'usr_karan_patel', name: 'Karan Patel', role: 'SRE Specialist', department: 'Platform', allocationPercentage: 100, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' }
    ],
    isRequiringContributors: false,
    openRolesNeeded: []
  },
  {
    id: 'prj_03',
    name: 'Helios: Real-time Workforce Pulse & Intelligence',
    description: 'Executive dashboard visualizing team velocity, cross-departmental collaboration, sprint health, and resource utilization.',
    department: 'Product & Design',
    projectManager: 'Marcus Vance',
    projectManagerId: 'usr_marcus_vance',
    projectManagerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    startDate: '2026-08-01',
    expectedCompletionDate: '2026-11-10',
    status: 'completed',
    progressPercentage: 100,
    requiredSkills: ['React', 'Recharts', 'Tailwind CSS', 'SQL Analytics', 'PostgreSQL'],
    objectives: [
      'Consolidate 4 fragmented reporting spreadsheets into 1 real-time UI',
      'Role-based data masking ensuring employee salary confidentiality',
      'Exportable executive quarterly reports'
    ],
    milestones: [
      { id: 'm1', title: 'Database Aggregation Views', dueDate: '2026-08-30', isCompleted: true },
      { id: 'm2', title: 'Analytics Dashboard Implementation', dueDate: '2026-09-30', isCompleted: true },
      { id: 'm3', title: 'Executive Beta & Sign-off', dueDate: '2026-10-31', isCompleted: true }
    ],
    teamMembers: [
      { id: 'usr_marcus_vance', name: 'Marcus Vance', role: 'Project Sponsor', department: 'People Ops', allocationPercentage: 30, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
      { id: 'usr_alex_rivera', name: 'Alex Rivera', role: 'Lead Frontend Contributor', department: 'Engineering', allocationPercentage: 60, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' }
    ],
    isRequiringContributors: false,
    openRolesNeeded: []
  }
];

export const MOCK_RECOMMENDED_CONTRIBUTORS: Record<string, RecommendedContributor[]> = {
  prj_01: [
    {
      id: 'usr_priya_sharma',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
      currentRole: 'Senior Product Designer',
      department: 'Product & Design',
      skillMatchPercentage: 96,
      matchedSkills: ['UI/UX Design', 'Figma', 'Design Systems', 'Data Visualization'],
      availability: 'Available (12h/week for 2 weeks)',
      currentWorkload: 'Low (45%)',
      recommendationReason: 'Priya authored the Nexus Core Design System and recently finished the Helios dashboards. Her current sprint workload is only 45%, leaving ample capacity to resolve the Apollo UI bottleneck.'
    },
    {
      id: 'usr_daniel_kim',
      name: 'Daniel Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      currentRole: 'Frontend & UI Specialist',
      department: 'Customer Experience Squad',
      skillMatchPercentage: 82,
      matchedSkills: ['Figma', 'React', 'Component Polish'],
      availability: 'Moderate (6h/week)',
      currentWorkload: 'Moderate (70%)',
      recommendationReason: 'Has strong UI implementation skills and extensive experience with Apollo design tokens. Can assist with component reviews and user testing.'
    }
  ]
};

export const MOCK_PROJECT_CONTRIBUTIONS: ProjectContributionRecord[] = [
  {
    id: 'pcr_01',
    projectId: 'prj_03',
    projectName: 'Helios: Real-time Workforce Pulse & Intelligence',
    employeeId: 'usr_alex_rivera',
    employeeName: 'Alex Rivera',
    assignedResponsibility: 'Architecture and styling of high-performance Recharts components and responsive dashboard grid',
    mode: 'ai_recommended',
    startDate: '2026-08-15',
    endDate: '2026-10-31',
    status: 'completed',
    workDelivered: 'Delivered 8 modular charting widgets with zero re-rendering overhead and seamless dark/light theme switching.',
    managerFeedback: 'Exceptional technical execution and speed. Alex unblocked the frontend sprint ahead of executive demo day.',
    performanceEvidenceScore: 5
  },
  {
    id: 'pcr_02',
    projectId: 'prj_01',
    projectName: 'Apollo: Enterprise Knowledge Engine',
    employeeId: 'usr_priya_sharma',
    employeeName: 'Priya Sharma',
    assignedResponsibility: 'Temporary UI/UX design coverage for vector query result cards and feedback modals',
    mode: 'open_contribution',
    startDate: '2026-11-22',
    endDate: '2026-12-05',
    status: 'pending',
    workDelivered: 'Contribution request submitted and pending manager sign-off.',
    performanceEvidenceScore: undefined
  }
];

// ============================================================================
// MOCK DECISION SIMULATIONS (Life Domain)
// ============================================================================
export const MOCK_DECISION_SIMULATIONS: DecisionSimulationReport[] = [
  {
    id: 'sim_01',
    createdAt: '2026-11-20T16:45:00Z',
    input: {
      title: 'Adopting Rust Microservices vs Optimizing Node.js for High-Throughput Ingestion',
      scope: 'company_based',
      problemStatement: 'The current ingestion worker experiences 1.4s p99 latency spikes during 40,000 req/sec batch bursts, causing queue backpressure.',
      objective: 'Achieve sub-80ms p99 response time and 60% lower memory consumption under maximum peak load.',
      expectedOutcome: 'Stable ingestion pipeline without memory leak crashes or expensive horizontal cluster over-provisioning.',
      constraints: ['Hard deadline of 6 weeks before Q1 enterprise onboarding', 'Only 2 engineers on team have deep Rust experience'],
      availableResources: ['Nexus Cloud Kubernetes cluster', '$10,000 cloud test budget', 'Sarah Jenkins (Architecture Advisory)'],
      deadline: '2027-01-15',
      proposedSolution: 'Rewrite the worker pipeline in Rust with Tokio async runtime.',
      executionStrategy: 'Phase 1 dual-write testing; Phase 2 canary routing of 10% traffic; Phase 3 full cutover.',
      teamComposition: ['Alex Rivera (Lead)', 'Rohan Verma (Data Arch)', 'Sarah Jenkins (Advisory)'],
      expectedChallenges: ['Steep learning curve for junior team members', 'Maintenance overhead of dual-language repos']
    },
    scenarios: [
      {
        id: 'sc_01',
        scenarioName: 'Scenario A: Full Rust Rewrite (Tokio Async)',
        approachSummary: 'Complete reimplementation of the ingestion service in Rust with native connection pooling and zero GC overhead.',
        feasibilityScore: 78,
        expectedBenefits: [
          'Guaranteed zero GC pauses and < 35ms p99 latency',
          '80% reduction in cluster memory utilization ($2.4k/mo savings)',
          'Strict type-safe memory safety avoiding concurrency races'
        ],
        potentialRisks: [
          'High ramp-up time for junior team members',
          'Higher delivery risk within tight 6-week window'
        ],
        resourceRequirements: '2 Senior Engineers full-time for 5 weeks',
        estimatedTimeline: '5-6 Weeks',
        requiredSkills: ['Rust', 'Tokio', 'Docker', 'Systems Programming'],
        majorDependencies: ['Kafka schema registry parity', 'CI compile time caching'],
        overallAssessment: 'Viable with Contingencies'
      },
      {
        id: 'sc_02',
        scenarioName: 'Scenario B: Pragmatic Node.js Worker Thread Optimization & Fastify Migration',
        approachSummary: 'Refactor Express to Fastify, implement UV threadpool tuning, migrate payload parsing to simdjson-node, and add Redis pipeline caching.',
        feasibilityScore: 92,
        expectedBenefits: [
          'Delivered in 2.5 weeks with low team risk',
          'Achieves 65ms p99 latency (well within sub-80ms target)',
          'Zero new programming language tooling or hiring dependencies'
        ],
        potentialRisks: [
          'Still susceptible to V8 garbage collection under 2x growth',
          'Memory footprint is 2.5x higher than Rust'
        ],
        resourceRequirements: '1 Senior Engineer + 1 Mid Engineer for 2.5 weeks',
        estimatedTimeline: '2.5 Weeks',
        requiredSkills: ['Node.js internals', 'V8 profiling', 'Fastify', 'simdjson'],
        majorDependencies: ['Redis cluster upgrade'],
        overallAssessment: 'Highly Recommended'
      },
      {
        id: 'sc_03',
        scenarioName: 'Scenario C: Go Microservice Transition',
        approachSummary: 'Implement the ingestion service in Go using Gin/Fiber with built-in goroutine concurrency.',
        feasibilityScore: 85,
        expectedBenefits: [
          'Fast compilation, lightweight goroutines, and strong ecosystem libraries',
          'Gentler learning curve than Rust'
        ],
        potentialRisks: [
          'Still requires maintaining a second runtime stack'
        ],
        resourceRequirements: '2 Engineers for 4 weeks',
        estimatedTimeline: '4 Weeks',
        requiredSkills: ['Go', 'Concurrency patterns'],
        majorDependencies: ['Go CI pipeline setup'],
        overallAssessment: 'Viable with Contingencies'
      }
    ],
    riskAssessment: [
      { category: 'Timeline & Deadline', level: 'High', detail: 'The 6-week deadline leaves only 1 week buffer if the Rust rewrite encounters unforeseen compiler or C-binding hurdles.' },
      { category: 'Team Cognitive Load', level: 'Medium', detail: 'Only 2 engineers possess Rust familiarity; troubleshooting production incidents at 2 AM would fall on a single point of failure.' },
      { category: 'Infrastructure Cost', level: 'Low', detail: 'All evaluated scenarios result in net compute savings compared to current over-provisioned cluster.' }
    ],
    resourceAnalysis: 'Team has sufficient capacity for a 2-3 week focused sprint. A 6-week full rewrite will delay other Q1 commitments.',
    skillGapAnalysis: [
      { skill: 'Rust Async Internals', gapLevel: 'Critical', mitigation: 'Pair programming or opt for Scenario B (Node.js/Fastify) to eliminate skill gap entirely.' },
      { skill: 'V8 Performance Profiling', gapLevel: 'None', mitigation: 'Alex Rivera is highly proficient in V8 flamegraphs.' }
    ],
    recommendedApproach: 'Scenario B: Pragmatic Node.js Fastify & simdjson Optimization, followed by a phased Go/Rust evaluation in Q2.',
    recommendationRationale: 'Scenario B achieves the sub-80ms target in 2.5 weeks with zero delivery risk, zero hiring dependencies, and preserves team velocity before the critical Q1 client onboarding.',
    executionRoadmap: [
      { phase: 'Phase 1 (Days 1-4)', duration: '4 days', keyDeliverable: 'Fastify migration and simdjson payload parser integration' },
      { phase: 'Phase 2 (Days 5-9)', duration: '5 days', keyDeliverable: 'Worker thread offloading for cryptographic validation and Redis pipelining' },
      { phase: 'Phase 3 (Days 10-14)', duration: '5 days', keyDeliverable: 'Canary load testing with simulated 50k req/sec burst traffic' },
      { phase: 'Phase 4 (Day 15)', duration: '1 day', keyDeliverable: 'Zero-downtime production cutover and telemetry verification' }
    ],
    importantConsiderations: [
      'Document memory allocation limits in Helm values to avoid container OOMKilled events.',
      'Schedule a revisit of Rust microservice benchmark in Q3 if traffic expands beyond 100k req/sec.'
    ]
  }
];

