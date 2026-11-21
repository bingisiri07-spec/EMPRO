export type Role = 'employee' | 'manager' | 'hr';

export type Domain = 'professional' | 'personal';

export interface Persona {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleLabel: string;
  avatar: string;
  designation: string;
  department: string;
  employeeId: string;
  company: string;
  companyId: string;
  joinedDate: string;
  employmentStatus: 'Active' | 'On Leave' | 'Probation';
  workEmail: string;
  personalEmail: string;
  location: string;
  previousCompany?: string;
  previousTenure?: string;
}

export interface AttendanceRecord {
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  expectedHours: number;
  status: 'Present' | 'Late' | 'Half-Day' | 'Holiday' | 'Leave';
  locationTag: string;
}

export interface SalaryBreakdown {
  month: string;
  year: number;
  grossSalary: number;
  netSalary: number;
  basicPay: number;
  hra: number;
  specialAllowance: number;
  performanceBonus: number;
  providentFund: number;
  professionalTax: number;
  incomeTaxTds: number;
  otherDeductions: number;
  payoutDate: string;
  status: 'Paid' | 'Processing';
  pdfFilename: string;
}

export interface LeaveBalance {
  casual: { available: number; total: number };
  sick: { available: number; total: number };
  earned: { available: number; total: number };
  unpaid: { taken: number };
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  type: 'Casual' | 'Sick' | 'Earned' | 'Unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approver?: string;
}

export interface MeetingItem {
  id: string;
  title: string;
  time: string;
  date: string;
  duration: string;
  type: 'Engineering' | 'Company All-Hands' | '1-on-1' | 'Product Sync';
  location: string;
  isOnline: boolean;
  meetingLink?: string;
  participants: string[];
  summary?: string;
  actionItems?: string[];
}

export type AchievementVisibility = 'private' | 'connections' | 'company' | 'public';

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'Certification' | 'Award' | 'Hackathon' | 'Publication' | 'Project';
  visibility: AchievementVisibility;
  credentialId?: string;
  description: string;
  badgeColor?: string;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'Energized' | 'Focused' | 'Reflective' | 'Tired' | 'Accomplished';
  tags: string[];
  isFavorite: boolean;
  isPrivate: boolean; // strictly true by default
}

export interface PersonalGoal {
  id: string;
  title: string;
  category: 'Learning' | 'Health' | 'Career' | 'Personal';
  progress: number; // 0 - 100
  targetDate: string;
  status: 'In Progress' | 'Completed' | 'Upcoming';
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorCompany: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  timestamp: string;
  userLiked?: boolean;
}
