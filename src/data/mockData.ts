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
  CommunityPost 
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
