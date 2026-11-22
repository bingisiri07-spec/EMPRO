import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DecisionSimulationInput, DecisionSimulationReport } from '../types';
import { aiIntelligenceService } from './aiIntelligenceService';
import { MOCK_DECISION_SIMULATIONS } from '../data/mockData';

export const decisionSimulatorService = {
  /**
   * Retrieves saved decision simulations
   */
  async getSimulations(): Promise<DecisionSimulationReport[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_DECISION_SIMULATIONS;
    }

    const { data, error } = await supabase
      .from('decision_simulations' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_DECISION_SIMULATIONS;
    }

    return data.map((item: any) => ({
      id: item.id,
      createdAt: item.created_at,
      input: item.input,
      scenarios: item.scenarios || [],
      riskAssessment: item.risk_assessment || [],
      resourceAnalysis: item.resource_analysis || '',
      skillGapAnalysis: item.skill_gap_analysis || [],
      recommendedApproach: item.recommended_approach || '',
      recommendationRationale: item.recommendation_rationale || '',
      executionRoadmap: item.execution_roadmap || [],
      importantConsiderations: item.important_considerations || [],
      groundingSources: item.grounding_sources || [],
      savedAt: item.saved_at,
    }));
  },

  /**
   * AI Decision Simulator Engine
   * Generates deep multi-scenario feasibility analysis, skill gap assessment,
   * risk evaluation, and a 10-point structured report based on user inputs.
   */
  async runSimulation(
    input: DecisionSimulationInput, 
    profileId?: string, 
    userOrgId?: string
  ): Promise<DecisionSimulationReport> {
    const generatedReport = await aiIntelligenceService.runDecisionAnalysis(input, userOrgId);

    if (!isSupabaseConfigured()) {
      MOCK_DECISION_SIMULATIONS.unshift(generatedReport);
      return generatedReport;
    }

    // Live Supabase persistence
    let activeProfileId = profileId;
    if (!activeProfileId) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        activeProfileId = authData.user?.id;
      } catch {
        // ignore
      }
    }

    if (!activeProfileId) {
      // In demo mode or offline without auth user, store in local memory
      MOCK_DECISION_SIMULATIONS.unshift(generatedReport);
      return generatedReport;
    }

    const { data, error } = await supabase
      .from('decision_simulations' as any)
      .insert({
        profile_id: activeProfileId,
        title: input.title,
        scope: input.scope,
        input: input,
        scenarios: generatedReport.scenarios,
        risk_assessment: generatedReport.riskAssessment,
        resource_analysis: generatedReport.resourceAnalysis,
        skill_gap_analysis: generatedReport.skillGapAnalysis,
        recommended_approach: generatedReport.recommendedApproach,
        recommendation_rationale: generatedReport.recommendationRationale,
        execution_roadmap: generatedReport.executionRoadmap,
        important_considerations: generatedReport.importantConsiderations,
      })
      .select()
      .single();

    if (error) {
      console.warn('Simulation save error in Supabase, using local:', error.message);
      MOCK_DECISION_SIMULATIONS.unshift(generatedReport);
      return generatedReport;
    }

    return {
      ...generatedReport,
      id: (data as any)?.id || generatedReport.id,
      createdAt: (data as any)?.created_at || generatedReport.createdAt,
    };
  },

  /**
   * Deletes a decision simulation
   */
  async deleteSimulation(id: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      const idx = MOCK_DECISION_SIMULATIONS.findIndex(s => s.id === id);
      if (idx !== -1) {
        MOCK_DECISION_SIMULATIONS.splice(idx, 1);
      }
      return { success: true };
    }

    const { error } = await supabase
      .from('decision_simulations' as any)
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  },
};
