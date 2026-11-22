import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Building2, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  BarChart3, 
  Clock, 
  ListPlus, 
  ShieldAlert, 
  TrendingUp, 
  Bookmark,
  Database,
  Lock
} from 'lucide-react';
import { 
  DecisionScope, 
  DecisionSimulationInput, 
  DecisionSimulationReport 
} from '../../types';
import { decisionSimulatorService } from '../../services/decisionSimulatorService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export const DecisionSimulatorModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<'workspace' | 'history'>('workspace');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [simulations, setSimulations] = useState<DecisionSimulationReport[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeReport, setActiveReport] = useState<DecisionSimulationReport | null>(null);

  // Step 1: Define Problem Form State
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState<DecisionScope>('company_based');
  const [problemStatement, setProblemStatement] = useState('');
  const [objective, setObjective] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [constraintsInput, setConstraintsInput] = useState('');
  const [resourcesInput, setResourcesInput] = useState('');
  const [deadline, setDeadline] = useState('');

  // Step 2: Define Approach Form State
  const [proposedSolution, setProposedSolution] = useState('');
  const [executionStrategy, setExecutionStrategy] = useState('');
  const [teamMembersInput, setTeamMembersInput] = useState('');
  const [expectedChallengesInput, setExpectedChallengesInput] = useState('');

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    const list = await decisionSimulatorService.getSimulations();
    setSimulations(list);
    if (list.length > 0 && !activeReport) {
      setActiveReport(list[0]);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setTitle('');
    setProblemStatement('');
    setObjective('');
    setExpectedOutcome('');
    setConstraintsInput('');
    setResourcesInput('');
    setDeadline('');
    setProposedSolution('');
    setExecutionStrategy('');
    setTeamMembersInput('');
    setExpectedChallengesInput('');
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setCurrentStep(3); // Analyzing step

    const inputData: DecisionSimulationInput = {
      title: title || 'Strategic Initiative Simulation',
      scope,
      problemStatement,
      objective,
      expectedOutcome,
      constraints: constraintsInput.split(',').map(s => s.trim()).filter(Boolean),
      availableResources: resourcesInput.split(',').map(s => s.trim()).filter(Boolean),
      deadline,
      proposedSolution,
      executionStrategy,
      teamComposition: teamMembersInput.split(',').map(s => s.trim()).filter(Boolean),
      expectedChallenges: expectedChallengesInput.split(',').map(s => s.trim()).filter(Boolean),
    };

    setTimeout(async () => {
      const report = await decisionSimulatorService.runSimulation(inputData);
      setActiveReport(report);
      setIsSimulating(false);
      setCurrentStep(4); // Move to scenario comparison
      await loadSimulations();
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#10182A] border border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Life Domain
            </span>
            <span className="text-xs text-[#94A3B8]">• Strategic Intelligence</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] mt-1.5 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            AI Decision Simulator
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Evaluate company-related and personal project decisions before executing. Stress-test approaches against skill constraints, timelines, and risks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setViewMode('workspace');
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              viewMode === 'workspace' && currentStep === 1
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'bg-[#151F35] text-cyan-300 border border-[#1E293B] hover:bg-[#19253F]'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            New Simulation
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              viewMode === 'history'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'bg-[#151F35] text-[#94A3B8] border border-[#1E293B] hover:text-[#F8FAFC]'
            }`}
          >
            <Clock className="w-4 h-4" />
            Saved History ({simulations.length})
          </button>
        </div>
      </div>

      {viewMode === 'history' ? (
        /* SAVED SIMULATIONS HISTORY VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulations.map((sim) => (
              <div 
                key={sim.id}
                onClick={() => {
                  setActiveReport(sim);
                  setCurrentStep(5);
                  setViewMode('workspace');
                }}
                className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-cyan-500/40 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    sim.input.scope === 'company_based' 
                      ? 'bg-blue-500/10 text-cyan-300 border border-blue-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {sim.input.scope === 'company_based' ? 'Company Decision' : 'Personal Project'}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-mono">
                    {new Date(sim.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#F8FAFC] line-clamp-1">{sim.input.title}</h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2">{sim.input.problemStatement}</p>

                <div className="p-2.5 rounded-xl bg-[#080D1B] border border-[#1E293B] text-xs">
                  <span className="text-[#64748B] block text-[10px] font-semibold">Recommended Path:</span>
                  <span className="text-cyan-300 font-medium line-clamp-1">{sim.recommendedApproach}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 5-STEP INTERACTIVE SIMULATION WORKSPACE */
        <div className="space-y-6">
          {/* Step Progress Indicator Bar */}
          <div className="p-4 rounded-xl bg-[#10182A] border border-[#1E293B]">
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className={`p-2 rounded-lg transition-colors ${currentStep >= 1 ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30' : 'text-[#64748B]'}`}>
                1. Define Problem
              </div>
              <div className={`p-2 rounded-lg transition-colors ${currentStep >= 2 ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30' : 'text-[#64748B]'}`}>
                2. Define Approach
              </div>
              <div className={`p-2 rounded-lg transition-colors ${currentStep >= 3 ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30' : 'text-[#64748B]'}`}>
                3. AI Analysis
              </div>
              <div className={`p-2 rounded-lg transition-colors ${currentStep >= 4 ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30' : 'text-[#64748B]'}`}>
                4. Compare Scenarios
              </div>
              <div className={`p-2 rounded-lg transition-colors ${currentStep >= 5 ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30' : 'text-[#64748B]'}`}>
                5. Final Report
              </div>
            </div>
          </div>

          {/* STEP 1: DEFINE THE PROBLEM */}
          {currentStep === 1 && (
            <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-5 animate-fade-in">
              <div className="pb-3 border-b border-[#1E293B]">
                <h2 className="text-base font-bold text-[#F8FAFC]">Step 1: Define the Problem & Scope</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Articulate the decision challenge, objective, hard constraints, and deadline.
                </p>
              </div>

              {/* Decision Scope Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">Decision Scope</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScope('company_based')}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                      scope === 'company_based'
                        ? 'bg-blue-600/20 border-blue-500 text-[#F8FAFC] shadow-blue-glow'
                        : 'bg-[#080D1B] border-[#1E293B] text-[#94A3B8] hover:border-blue-500/30'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm">Company-Based Decision</span>
                      <span className="text-[11px] text-[#94A3B8] block mt-0.5">
                        Authorizes simulation access to relevant company project & team skill profiles.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScope('personal_project')}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                      scope === 'personal_project'
                        ? 'bg-cyan-600/20 border-cyan-500 text-[#F8FAFC] shadow-cyan-glow'
                        : 'bg-[#080D1B] border-[#1E293B] text-[#94A3B8] hover:border-cyan-500/30'
                    }`}
                  >
                    <User className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm">Personal Project Decision</span>
                      <span className="text-[11px] text-[#94A3B8] block mt-0.5">
                        Strictly confidential and isolated; company administrators have zero access.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[#94A3B8] font-semibold mb-1">Decision Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Migration from Node.js monolith to Rust services vs optimization"
                    className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#94A3B8] font-semibold mb-1">Problem Statement</label>
                  <textarea
                    rows={2}
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Describe the exact bottleneck, inefficiency, or choice you are facing..."
                    className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#94A3B8] font-semibold mb-1">Primary Objective</label>
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g. Reduce p99 latency to sub-80ms under peak load"
                    className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#94A3B8] font-semibold mb-1">Target Deadline</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. 6 Weeks (before Q1 onboarding)"
                    className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#94A3B8] font-semibold mb-1">Constraints (comma-separated)</label>
                  <input
                    type="text"
                    value={constraintsInput}
                    onChange={(e) => setConstraintsInput(e.target.value)}
                    placeholder="e.g. Fixed budget, Only 2 engineers available, Zero downtime"
                    className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#94A3B8] font-semibold mb-1">Available Resources (comma-separated)</label>
                  <input
                    type="text"
                    value={resourcesInput}
                    onChange={(e) => setResourcesInput(e.target.value)}
                    placeholder="e.g. Staging cluster, $10k cloud budget, Senior Advisory"
                    className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-blue-glow transition-all"
                >
                  Proceed to Step 2: Define Approach
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DEFINE THE APPROACH */}
          {currentStep === 2 && (
            <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-5 animate-fade-in">
              <div className="pb-3 border-b border-[#1E293B]">
                <h2 className="text-base font-bold text-[#F8FAFC]">Step 2: Proposed Solution & Execution Strategy</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Outline your proposed approach, team composition, and foreseen risks.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#94A3B8] font-semibold mb-1">Proposed Solution / Approach</label>
                  <input
                    type="text"
                    value={proposedSolution}
                    onChange={(e) => setProposedSolution(e.target.value)}
                    placeholder="e.g. Complete rewrite in Rust with Tokio async runtime vs Fastify optimization"
                    className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#94A3B8] font-semibold mb-1">Execution Strategy</label>
                  <textarea
                    rows={2}
                    value={executionStrategy}
                    onChange={(e) => setExecutionStrategy(e.target.value)}
                    placeholder="Describe how you plan to roll it out (e.g. Phase 1 shadow traffic, Phase 2 canary rollout)..."
                    className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#94A3B8] font-semibold mb-1">
                      Team Composition / Coworkers (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={teamMembersInput}
                      onChange={(e) => setTeamMembersInput(e.target.value)}
                      placeholder="e.g. Alex Rivera, Rohan Verma, Sarah Jenkins"
                      className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] font-semibold mb-1">
                      Expected Challenges & Bottlenecks
                    </label>
                    <input
                      type="text"
                      value={expectedChallengesInput}
                      onChange={(e) => setExpectedChallengesInput(e.target.value)}
                      placeholder="e.g. Ramp-up learning curve, tight time buffer, dual repos"
                      className="w-full bg-[#080D1B] text-xs text-[#F8FAFC] p-2.5 rounded-xl border border-[#1E293B] focus:border-[#3B82F6] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl border border-[#1E293B] text-[#94A3B8] hover:text-white text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Problem
                </button>
                <button
                  type="button"
                  onClick={handleRunSimulation}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 shadow-blue-glow transition-all"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Run AI Decision Simulation
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ANALYZING LOADING STATE */}
          {currentStep === 3 && isSimulating && (
            <div className="p-16 rounded-2xl bg-[#10182A] border border-blue-500/40 text-center space-y-4 animate-pulse">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#151F35] border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <BrainCircuit className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">AI Decision Analysis in Progress...</h3>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                Analyzing objective feasibility, team skill matrix, resource allocation, and generating multiple comparative execution scenarios...
              </p>
            </div>
          )}

          {/* STEP 4: SCENARIO COMPARISON */}
          {currentStep === 4 && activeReport && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E293B]">
                  <div>
                    <h2 className="text-base font-bold text-[#F8FAFC]">Step 4: Comparative Execution Scenarios</h2>
                    <p className="text-xs text-[#94A3B8]">Review the trade-offs, feasibility scores, and estimated timelines across generated scenarios.</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-blue-glow"
                  >
                    Generate Final 10-Point Report <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Feasibility Comparison Visual Chart */}
                <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#64748B] flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                    Feasibility Index Comparison (0 - 100%)
                  </span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeReport.scenarios.map(s => ({ name: s.scenarioName.split(':')[0], score: s.feasibilityScore }))}>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#10182A', borderColor: '#1E293B', fontSize: 11, color: '#F8FAFC' }} />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {activeReport.scenarios.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.feasibilityScore > 90 ? '#10B981' : entry.feasibilityScore > 80 ? '#06B6D4' : '#3B82F6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Scenarios Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeReport.scenarios.map((sc) => (
                    <div 
                      key={sc.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                        sc.overallAssessment === 'Highly Recommended'
                          ? 'bg-gradient-to-b from-[#101F38] to-[#10182A] border-cyan-500/50 shadow-cyan-glow'
                          : 'bg-[#10182A] border-[#1E293B]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            sc.overallAssessment === 'Highly Recommended' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            'bg-blue-500/10 text-cyan-300 border border-blue-500/30'
                          }`}>
                            {sc.overallAssessment}
                          </span>
                          <span className="font-mono text-xs font-extrabold text-cyan-400">
                            {sc.feasibilityScore}% Feasible
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#F8FAFC] leading-snug">
                          {sc.scenarioName}
                        </h3>

                        <p className="text-xs text-[#94A3B8] leading-relaxed">
                          {sc.approachSummary}
                        </p>

                        <div className="space-y-1.5 text-xs">
                          <span className="text-[#64748B] block font-semibold text-[10px] uppercase">Timeline & Resources:</span>
                          <div className="p-2 rounded bg-[#080D1B] text-[#F8FAFC]">
                            <span className="text-cyan-300 font-semibold">{sc.estimatedTimeline}</span> • {sc.resourceRequirements}
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <span className="text-[#64748B] block font-semibold text-[10px] uppercase">Key Expected Benefits:</span>
                          <ul className="space-y-1 text-[#94A3B8]">
                            {sc.expectedBenefits.slice(0, 2).map((b, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL STRUCTURED 10-POINT DECISION REPORT */}
          {currentStep === 5 && activeReport && (
            <div className="p-6 md:p-8 rounded-2xl bg-[#10182A] border border-[#1E293B] space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Final Executive Simulation Report
                    </span>
                    <span className="text-xs text-[#94A3B8]">• Saved to Knowledge Store</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-[#F8FAFC] mt-1.5">
                    {activeReport.input.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-3 py-1.5 rounded-xl border border-[#1E293B] text-xs font-medium text-[#94A3B8] hover:text-white"
                  >
                    View Scenarios
                  </button>
                  <button
                    onClick={() => setViewMode('history')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-blue-glow"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Save & Finish
                  </button>
                </div>
              </div>

              {/* 10-Point Structured Breakdown Grid */}
              <div className="space-y-6 text-xs">
                {/* 1. Problem Summary & 2. Proposed Strategy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      1. Problem Summary & Objective
                    </span>
                    <p className="text-[#F8FAFC]">{activeReport.input.problemStatement}</p>
                    <div className="p-2 rounded bg-[#10182A] text-cyan-300">
                      <strong>Target:</strong> {activeReport.input.objective}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      2. Proposed Strategy & Hypotheses
                    </span>
                    <p className="text-[#F8FAFC]">{activeReport.input.proposedSolution}</p>
                    <div className="p-2 rounded bg-[#10182A] text-[#94A3B8]">
                      <strong>Execution Outline:</strong> {activeReport.input.executionStrategy || 'Iterative validation'}
                    </div>
                  </div>
                </div>

                {/* 3. Recommended Approach & 4. Rationale Highlight */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-teal-950/40 border border-cyan-500/40 space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    8. AI Recommended Approach
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {activeReport.recommendedApproach}
                  </h3>
                  <p className="text-xs text-cyan-100/90 leading-relaxed">
                    {activeReport.recommendationRationale}
                  </p>
                </div>

                {/* 5. Risk Assessment & 6. Resource Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      5. Risk Assessment Matrix
                    </span>
                    <div className="space-y-2">
                      {activeReport.riskAssessment.map((rk, idx) => (
                        <div key={idx} className="p-2 rounded bg-[#10182A] flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-[#F8FAFC] block">{rk.category}</span>
                            <span className="text-[10px] text-[#94A3B8]">{rk.detail}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                            rk.level === 'High' ? 'bg-rose-500/10 text-rose-400' :
                            rk.level === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {rk.level} Risk
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      7. Skill Gap & Capability Analysis
                    </span>
                    <div className="space-y-2">
                      {activeReport.skillGapAnalysis.map((sk, idx) => (
                        <div key={idx} className="p-2 rounded bg-[#10182A] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#F8FAFC]">{sk.skill}</span>
                            <span className="text-[10px] text-cyan-300 font-mono">Gap: {sk.gapLevel}</span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8]">Mitigation: {sk.mitigation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 9. Execution Roadmap */}
                <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    9. Recommended Execution Roadmap
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {activeReport.executionRoadmap.map((stg, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[#10182A] border border-[#1E293B] space-y-1">
                        <span className="text-[10px] text-cyan-400 font-mono font-bold block">{stg.phase}</span>
                        <span className="text-xs font-semibold text-[#F8FAFC] block">{stg.keyDeliverable}</span>
                        <span className="text-[10px] text-[#64748B]">Duration: {stg.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 10. Important Considerations */}
                <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    10. Important Considerations & Assumptions
                  </span>
                  <ul className="space-y-1 text-[#94A3B8]">
                    {activeReport.importantConsiderations.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Grounding & Context Isolation Summary */}
                {activeReport.input.scope === 'personal_project' ? (
                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">Personal Sandbox Isolation Verified</h4>
                      <p className="text-[11px] text-[#94A3B8]">
                        This decision was evaluated strictly using self-declared inputs with zero company database queries or organizational context retrieval.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#080D1B] border border-[#1E293B] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-cyan-400" />
                        Approved Organizational Context & Grounding Sources ({activeReport.groundingSources?.length || 0})
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">RBAC & Isolation Verified</span>
                    </div>
                    {activeReport.groundingSources && activeReport.groundingSources.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeReport.groundingSources.map((source, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-[#10182A] border border-[#1E293B] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#F8FAFC] truncate max-w-[200px]">{source.title}</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/10 text-cyan-300 border border-blue-500/20">
                                {source.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#94A3B8] line-clamp-2">{source.excerpt}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#94A3B8] italic">
                        No external organization records matched this simulation's domain criteria; evaluated using general organizational principles.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
