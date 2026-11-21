import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  UserPlus, 
  Send, 
  X, 
  Search, 
  Target, 
  FileCheck 
} from 'lucide-react';
import { 
  CompanyProject, 
  RecommendedContributor, 
  ProjectContributionRecord 
} from '../../types';
import { projectsService } from '../../services/projectsService';

interface ProjectsModuleProps {
  currentUserId?: string;
  userRole?: string;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  currentUserId = 'usr_alex_rivera',
  userRole = 'employee'
}) => {
  const [projects, setProjects] = useState<CompanyProject[]>([]);
  const [contributions, setContributions] = useState<ProjectContributionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'requiring_contributors' | 'my_projects' | 'completed' | 'tracking'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<CompanyProject | null>(null);
  
  // AI Recommendations State
  const [recommendedContributors, setRecommendedContributors] = useState<RecommendedContributor[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  
  // Modals & Action States
  const [showOpenContribModal, setShowOpenContribModal] = useState(false);
  const [showManagerAssignModal, setShowManagerAssignModal] = useState(false);
  const [volunteerResponsibility, setVolunteerResponsibility] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [assigneeRole, setAssigneeRole] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prjs = await projectsService.getProjects();
    const records = await projectsService.getContributionRecords();
    setProjects(prjs);
    setContributions(records);
    if (prjs.length > 0 && !selectedProject) {
      setSelectedProject(prjs[0]);
      loadRecommendations(prjs[0].id);
    }
  };

  const loadRecommendations = async (projectId: string) => {
    setIsLoadingRecommendations(true);
    const recs = await projectsService.discoverRecommendedContributors(projectId);
    setRecommendedContributors(recs);
    setIsLoadingRecommendations(false);
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleSelectProject = (project: CompanyProject) => {
    setSelectedProject(project);
    loadRecommendations(project.id);
  };

  // Mode 1: Open Contribution submission
  const handleOpenContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const res = await projectsService.applyOpenContribution(
      selectedProject.id,
      selectedProject.name,
      currentUserId,
      'Alex Rivera',
      volunteerResponsibility
    );

    if (res.success) {
      setShowOpenContribModal(false);
      setVolunteerResponsibility('');
      await loadData();
      showNotification(`Voluntary contribution request submitted for ${selectedProject.name}. Awaiting manager review.`);
    }
  };

  // Mode 2: AI Recommended Invitation
  const handleSendAIInvitation = async (contributor: RecommendedContributor) => {
    if (!selectedProject) return;
    const res = await projectsService.sendContributionInvitation(
      selectedProject.id,
      selectedProject.name,
      contributor.id,
      contributor.name,
      selectedProject.openRolesNeeded[0]?.roleTitle || 'Key Technical Contributor'
    );

    if (res.success) {
      await loadData();
      showNotification(`Contribution invitation sent to ${contributor.name} (${contributor.skillMatchPercentage}% skill match).`);
    }
  };

  // Mode 3: Manager Assignment
  const handleManagerAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const res = await projectsService.assignManagerContribution(
      selectedProject.id,
      selectedProject.name,
      'usr_custom',
      assigneeName,
      assigneeRole,
      'manager_assigned'
    );

    if (res.success) {
      setShowManagerAssignModal(false);
      setAssigneeName('');
      setAssigneeRole('');
      await loadData();
      showNotification(`Mandatory contribution responsibility assigned to ${assigneeName}.`);
    }
  };

  // Filtered list
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.department.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'active') return p.status === 'active';
    if (activeTab === 'requiring_contributors') return p.isRequiringContributors;
    if (activeTab === 'completed') return p.status === 'completed';
    if (activeTab === 'my_projects') {
      return p.teamMembers.some(m => m.id === currentUserId) || p.projectManagerId === currentUserId;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between transition-all animate-fade-in ${
          notification.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-blue-950/40 border-blue-500/40 text-cyan-300'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <p className="text-xs font-medium">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-cyan-400 border border-blue-500/20">
              Company Domain
            </span>
            <span className="text-xs text-[#94A3B8]">• Organizational Intelligence</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] mt-1.5 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" />
            Projects & Contribution Intelligence
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Discover active corporate initiatives, volunteer your skills, and leverage AI to uncover the ideal contributors across departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#080D1B] border border-[#1E293B] text-center">
            <span className="block text-[10px] uppercase font-bold text-[#64748B]">Active Projects</span>
            <span className="text-lg font-extrabold text-cyan-400">
              {projects.filter(p => p.status === 'active').length}
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#080D1B] border border-[#1E293B] text-center">
            <span className="block text-[10px] uppercase font-bold text-[#64748B]">Seeking Help</span>
            <span className="text-lg font-extrabold text-amber-400">
              {projects.filter(p => p.isRequiringContributors).length}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#10182A] border border-[#1E293B]">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'active' ? 'bg-blue-600 text-white shadow-blue-glow' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Active Projects ({projects.filter(p => p.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('requiring_contributors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'requiring_contributors' ? 'bg-blue-600 text-white shadow-blue-glow' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Requires Contributors ({projects.filter(p => p.isRequiringContributors).length})
          </button>
          <button
            onClick={() => setActiveTab('my_projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'my_projects' ? 'bg-blue-600 text-white shadow-blue-glow' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'completed' ? 'bg-blue-600 text-white shadow-blue-glow' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tracking' ? 'bg-blue-600 text-white shadow-blue-glow' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Contribution Evidence ({contributions.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, skill..."
            className="w-full bg-[#10182A] text-xs text-[#F8FAFC] placeholder-[#64748B] pl-9 pr-3 py-2 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
          />
        </div>
      </div>

      {/* TAB: CONTRIBUTION TRACKING & PERFORMANCE REVIEW EVIDENCE */}
      {activeTab === 'tracking' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#F8FAFC]">Verified Contribution Ledger & Appraisal Evidence</span>
              <p className="text-[#94A3B8]">
                Every project contribution is logged with verified manager feedback. Managers and HR can use these records as supporting evidence during quarterly performance reviews and skill endorsements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {contributions.map((rec) => (
              <div key={rec.id} className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E293B]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#F8FAFC]">{rec.projectName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rec.mode === 'ai_recommended' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' :
                        rec.mode === 'manager_assigned' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                      }`}>
                        {rec.mode.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-[#94A3B8]">Contributor: {rec.employeeName} ({rec.startDate} to {rec.endDate})</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto ${
                    rec.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    rec.status === 'active' ? 'bg-blue-500/10 text-cyan-400 border border-blue-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {rec.status}
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-[#64748B] block font-medium">Assigned Responsibility:</span>
                    <span className="text-[#F8FAFC] font-semibold">{rec.assignedResponsibility}</span>
                  </div>

                  {rec.workDelivered && (
                    <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B]">
                      <span className="text-[#64748B] block font-semibold mb-1">Delivered Work & Outcomes:</span>
                      <p className="text-cyan-200">{rec.workDelivered}</p>
                    </div>
                  )}

                  {rec.managerFeedback && (
                    <div className="p-3 rounded-xl bg-[#080D1B] border border-[#1E293B]">
                      <span className="text-[#64748B] block font-semibold mb-1">Manager Appraisal Feedback:</span>
                      <p className="text-emerald-300 italic">"{rec.managerFeedback}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 2-COLUMN VIEW: PROJECTS LIST (LEFT) & DETAILED VIEW (RIGHT) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Project Cards List (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#10182A] border border-[#1E293B]">
                <Briefcase className="w-8 h-8 mx-auto text-[#64748B] mb-2" />
                <p className="text-xs font-semibold text-[#F8FAFC]">No projects found</p>
              </div>
            ) : (
              filteredProjects.map((prj) => {
                const isSelected = selectedProject?.id === prj.id;
                return (
                  <div
                    key={prj.id}
                    onClick={() => handleSelectProject(prj)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-[#151F35] border-blue-500 shadow-blue-glow'
                        : 'bg-[#10182A] border-[#1E293B] hover:border-blue-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                          {prj.department}
                        </span>
                        <h3 className="text-sm font-bold text-[#F8FAFC] mt-0.5">{prj.name}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        prj.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        prj.status === 'completed' ? 'bg-slate-500/10 text-[#94A3B8]' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {prj.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {prj.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                        <span>Progress</span>
                        <span className="font-mono text-cyan-400 font-semibold">{prj.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#080D1B] overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${prj.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Requirements Alert Pill */}
                    {prj.isRequiringContributors && (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          Needs Temporary Contributors
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">
                          {prj.openRolesNeeded.length} open
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Detailed Project View with BLOCK 1 & BLOCK 2 (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedProject ? (
              <div className="space-y-6">
                {/* BLOCK 1: PROJECT OVERVIEW & TEAM */}
                <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                          {selectedProject.department}
                        </span>
                        <span className="text-xs text-[#94A3B8]">• Lead: {selectedProject.projectManager}</span>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-[#F8FAFC] mt-1">
                        {selectedProject.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowOpenContribModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-blue-glow transition-all"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Volunteer to Contribute
                      </button>
                      {userRole === 'manager' || userRole === 'hr' ? (
                        <button
                          onClick={() => setShowManagerAssignModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-[#151F35] hover:bg-[#19253F] border border-[#1E293B] text-cyan-300 text-xs font-semibold transition-colors"
                        >
                          Assign Contributor
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Description & Timeline */}
                  <div className="space-y-3 text-xs">
                    <p className="text-[#F8FAFC] text-sm leading-relaxed">
                      {selectedProject.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#080D1B] border border-[#1E293B]">
                      <div>
                        <span className="text-[#64748B] block font-medium">Timeline:</span>
                        <span className="text-[#F8FAFC] font-semibold">{selectedProject.startDate} → {selectedProject.expectedCompletionDate}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block font-medium">Progress Status:</span>
                        <span className="text-cyan-400 font-semibold">{selectedProject.progressPercentage}% Completed</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block font-medium">Core Skills:</span>
                        <span className="text-[#94A3B8] truncate block">{selectedProject.requiredSkills.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-400" />
                      Key Milestones & Deliverables
                    </h4>
                    <div className="space-y-2">
                      {selectedProject.milestones.map((ms) => (
                        <div key={ms.id} className="p-2.5 rounded-xl bg-[#080D1B] border border-[#1E293B] flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            {ms.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-blue-500/40 shrink-0" />
                            )}
                            <span className={ms.isCompleted ? 'line-through text-[#64748B]' : 'text-[#F8FAFC] font-medium'}>
                              {ms.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#94A3B8]">{ms.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Team Members */}
                  <div>
                    <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      Assigned Team ({selectedProject.teamMembers.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.teamMembers.map((m) => (
                        <div key={m.id} className="p-2.5 rounded-xl bg-[#080D1B] border border-[#1E293B] flex items-center gap-3">
                          <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div className="text-xs truncate">
                            <span className="text-[#F8FAFC] font-semibold block truncate">{m.name}</span>
                            <span className="text-[#64748B] block text-[10px] truncate">{m.role} • {m.allocationPercentage}% load</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BLOCK 2: CONTRIBUTION INTELLIGENCE (THE DIFFERENTIATING AI FEATURE) */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10182A] via-[#101F38] to-[#0A1428] border border-blue-500/40 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-400">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#F8FAFC]">AI Contribution Discovery</h3>
                        <span className="text-[10px] text-cyan-300">Intelligent Workload & Skill-Match Recommendation Engine</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-blue-900/60 border border-blue-500/30 text-[10px] font-mono text-cyan-300">
                      Active Analysis
                    </span>
                  </div>

                  {/* Scenario Explanation Card */}
                  {selectedProject.openRolesNeeded.length > 0 ? (
                    <div className="p-4 rounded-xl bg-[#080D1B]/80 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          Missing Responsibility: {selectedProject.openRolesNeeded[0].roleTitle}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                          Duration: {selectedProject.openRolesNeeded[0].duration}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        {selectedProject.openRolesNeeded[0].reason}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-semibold text-[#64748B]">Required Skills:</span>
                        {selectedProject.openRolesNeeded[0].skillsNeeded.map((sk, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#151F35] text-cyan-300 border border-blue-500/20">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#94A3B8]">
                      AI continuously evaluates cross-departmental team capacities for potential bottlenecks.
                    </p>
                  )}

                  {/* Ranked Recommendations List */}
                  <div className="space-y-3">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-cyan-300 block">
                      Top Ranked Candidate Contributors:
                    </span>

                    {isLoadingRecommendations ? (
                      <div className="p-6 text-center text-xs text-[#94A3B8]">
                        Analyzing verified skill profiles and workload availability...
                      </div>
                    ) : (
                      recommendedContributors.map((c) => (
                        <div key={c.id} className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-3 hover:border-cyan-500/40 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-xl object-cover border border-[#1E293B]" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-[#F8FAFC]">{c.name}</h4>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    {c.skillMatchPercentage}% Match
                                  </span>
                                </div>
                                <span className="text-xs text-[#94A3B8]">{c.currentRole} • {c.department}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleSendAIInvitation(c)}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-blue-glow transition-all self-start sm:self-auto"
                            >
                              <Send className="w-3 h-3" />
                              Invite Contributor
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-[#10182A]">
                            <div>
                              <span className="text-[#64748B] block text-[10px]">Declared Availability:</span>
                              <span className="text-cyan-300 font-semibold">{c.availability}</span>
                            </div>
                            <div>
                              <span className="text-[#64748B] block text-[10px]">Current Workload:</span>
                              <span className="text-emerald-400 font-semibold">{c.currentWorkload}</span>
                            </div>
                          </div>

                          <div className="text-xs">
                            <span className="text-[#64748B] block text-[10px] font-semibold mb-0.5">Why Recommended:</span>
                            <p className="text-[#94A3B8] leading-relaxed italic">
                              "{c.recommendationReason}"
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#10182A] border border-[#1E293B]">
                <Briefcase className="w-10 h-10 mx-auto text-[#64748B] mb-2" />
                <p className="text-sm font-semibold text-[#F8FAFC]">Select a project from the left to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 1: VOLUNTEER CONTRIBUTION MODAL */}
      {showOpenContribModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#080D1B] border border-[#1E293B] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-sm font-bold text-[#F8FAFC]">Volunteer to Contribute (Open Mode)</h3>
              <button onClick={() => setShowOpenContribModal(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleOpenContributionSubmit} className="space-y-4 text-xs">
              <div>
                <span className="text-[#64748B] block font-medium">Target Project:</span>
                <span className="text-[#F8FAFC] font-semibold text-sm">{selectedProject.name}</span>
              </div>
              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">
                  How would you like to contribute?
                </label>
                <textarea
                  required
                  rows={3}
                  value={volunteerResponsibility}
                  onChange={(e) => setVolunteerResponsibility(e.target.value)}
                  placeholder="e.g. Can cover UI/UX design components for 2 weeks or write test suites..."
                  className="w-full bg-[#10182A] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOpenContribModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#1E293B] text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODE 3: MANAGER ASSIGNMENT MODAL */}
      {showManagerAssignModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#080D1B] border border-[#1E293B] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-sm font-bold text-[#F8FAFC]">Direct Manager Assignment (Mode 3)</h3>
              <button onClick={() => setShowManagerAssignModal(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleManagerAssignmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">Employee Name</label>
                <input
                  type="text"
                  required
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-[#10182A] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B]"
                />
              </div>
              <div>
                <label className="block text-[#94A3B8] font-semibold mb-1">Direct Assignment Responsibility</label>
                <textarea
                  required
                  rows={3}
                  value={assigneeRole}
                  onChange={(e) => setAssigneeRole(e.target.value)}
                  placeholder="Specify mandatory deliverables, schedule, and expected outcomes..."
                  className="w-full bg-[#10182A] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManagerAssignModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#1E293B] text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                >
                  Confirm Direct Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
