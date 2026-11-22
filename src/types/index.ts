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

// ============================================================================
// EVENTS TYPES (Company Domain)
// ============================================================================
export type EventCategory = 
  | 'Technical Meetup'
  | 'Workshop'
  | 'Hackathon'
  | 'Seminar'
  | 'Training Session'
  | 'Innovation Challenge'
  | 'Company Celebration'
  | 'Town Hall';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface CompanyEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  venueOrLink: string;
  isOnline: boolean;
  organizerName: string;
  organizerId: string;
  organizerAvatar: string;
  registrationDeadline: string;
  status: EventStatus;
  maxAttendees?: number;
  registeredCount: number;
  availableOpportunities: string[];
  scheduleAgenda: { time: string; activity: string; speaker?: string }[];
  participationRequirements?: string[];
  bannerImage?: string;
  isRegistered?: boolean;
  userContributionStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  userAttended?: boolean;
}

export type ContributionCategory = 
  | 'Technical Session Coordination'
  | 'Workshop Assistance'
  | 'Content Preparation'
  | 'Design & Creative Work'
  | 'Event Hosting & Emcee'
  | 'Technical Support & AV'
  | 'Logistics & Management';

export interface EventContributionRequest {
  id: string;
  eventId: string;
  eventTitle: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeAvatar: string;
  department: string;
  contributionCategory: ContributionCategory;
  relevantSkills: string[];
  description: string;
  availability: string;
  status: 'pending' | 'approved' | 'rejected';
  assignedRole?: string;
  reviewerNotes?: string;
  submittedAt: string;
}

// ============================================================================
// PROJECTS & CONTRIBUTION INTELLIGENCE TYPES (Company Domain)
// ============================================================================
export type ProjectStatus = 'upcoming' | 'active' | 'completed' | 'on_hold';

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface ProjectTeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  allocationPercentage: number;
  isTemporaryContributor?: boolean;
}

export interface CompanyProject {
  id: string;
  name: string;
  description: string;
  department: string;
  projectManager: string;
  projectManagerId: string;
  projectManagerAvatar: string;
  startDate: string;
  expectedCompletionDate: string;
  status: ProjectStatus;
  progressPercentage: number;
  teamMembers: ProjectTeamMember[];
  requiredSkills: string[];
  objectives: string[];
  milestones: ProjectMilestone[];
  isRequiringContributors: boolean;
  openRolesNeeded: {
    roleTitle: string;
    skillsNeeded: string[];
    urgency: 'high' | 'medium' | 'low';
    duration: string;
    reason: string;
  }[];
}

export interface RecommendedContributor {
  id: string;
  name: string;
  avatar: string;
  currentRole: string;
  department: string;
  skillMatchPercentage: number;
  matchedSkills: string[];
  availability: string; // e.g. "Available (10h/week)", "Limited (5h/week)"
  currentWorkload: 'Low (45%)' | 'Moderate (70%)' | 'Heavy (90%)' | 'Overloaded';
  recommendationReason: string;
}

export type ContributionAllocationMode = 'open_contribution' | 'ai_recommended' | 'manager_assigned';

export interface ProjectContributionRecord {
  id: string;
  projectId: string;
  projectName: string;
  employeeId: string;
  employeeName: string;
  assignedResponsibility: string;
  mode: ContributionAllocationMode;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
  workDelivered?: string;
  managerFeedback?: string;
  performanceEvidenceScore?: number; // 1-5 rating supporting appraisals
}

// ============================================================================
// DECISION SIMULATOR TYPES (Life Domain)
// ============================================================================
export type DecisionScope = 'company_based' | 'personal_project';

export interface DecisionSimulationInput {
  title: string;
  scope: DecisionScope;
  problemStatement: string;
  objective: string;
  expectedOutcome: string;
  constraints: string[];
  availableResources: string[];
  deadline: string;
  proposedSolution: string;
  executionStrategy: string;
  teamComposition: string[]; // Selected coworkers or collaborator roles
  expectedChallenges: string[];
}

export interface ScenarioComparisonItem {
  id: string;
  scenarioName: string;
  approachSummary: string;
  feasibilityScore: number; // 0 - 100
  expectedBenefits: string[];
  potentialRisks: string[];
  resourceRequirements: string;
  estimatedTimeline: string;
  requiredSkills: string[];
  majorDependencies: string[];
  overallAssessment: 'Highly Recommended' | 'Viable with Contingencies' | 'High Risk';
}

export interface DecisionSimulationReport {
  id: string;
  createdAt: string;
  input: DecisionSimulationInput;
  scenarios: ScenarioComparisonItem[];
  riskAssessment: { category: string; level: 'Low' | 'Medium' | 'High'; detail: string }[];
  resourceAnalysis: string;
  skillGapAnalysis: { skill: string; gapLevel: 'None' | 'Moderate' | 'Critical'; mitigation: string }[];
  recommendedApproach: string;
  recommendationRationale: string;
  executionRoadmap: { phase: string; duration: string; keyDeliverable: string }[];
  importantConsiderations: string[];
  groundingSources?: { title: string; category: string; excerpt: string }[];
  savedAt?: string;
}

