// src/services/savedOpportunityService.js
import { supabase } from '../services/supabaseClient';

export const savedOpportunityService = {
  /**
   * Student saves an opportunity.
   * RLS ensures student_id is set to auth.uid().
   */
  async saveOpportunity(opportunityId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to save opportunity.");
    if (!user) throw new Error("No user logged in.");

    const { data, error } = await supabase
      .from('saved_opportunities')
      .insert({ student_id: user.id, opportunity_id: opportunityId })
      .select();

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error("You have already saved this opportunity.");
      }
      throw new Error(`Error saving opportunity: ${error.message}`);
    }
    return data[0];
  },

  /**
   * Student unsaves an opportunity.
   * RLS ensures only the student can unsave their own.
   */
  async unsaveOpportunity(opportunityId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to unsave opportunity.");
    if (!user) throw new Error("No user logged in.");

    const { error } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('student_id', user.id)
      .eq('opportunity_id', opportunityId);

    if (error) {
      throw new Error(`Error unsaving opportunity: ${error.message}`);
    }
    return true;
  },

  /**
   * Student fetches their list of saved opportunities.
   * RLS ensures only the student's saved opportunities are returned.
   */
  async getMySavedOpportunities() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to get saved opportunities.");
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_opportunities')
      .select('*, opportunities(*, profiles(full_name, company_data, avatar_url))') // Fetch full opportunity and company details
      .eq('student_id', user.id) // For safety, RLS handles this
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching saved opportunities: ${error.message}`);
    }
    return data;
  },
};