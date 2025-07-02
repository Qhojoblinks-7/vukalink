// src/services/applicationService.js
import { supabase } from '../services/supabaseClient';

export const applicationService = {
  /**
   * Student applies to an opportunity.
   * RLS ensures student_id is set to auth.uid().
   */
  async applyToOpportunity(applicationData) {
    // applicationData should include opportunity_id, cover_letter_text, resume_url etc.
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select();

    if (error) {
      if (error.code === '23505') { // PostgreSQL unique violation error code
        throw new Error("You have already applied to this opportunity.");
      }
      throw new Error(`Error applying to opportunity: ${error.message}`);
    }
    return data[0];
  },

  /**
   * Student views their own applications.
   * RLS ensures only the student's applications are returned.
   */
  async getMyApplications() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to get applications.");
    if (!user) return [];

    const { data, error } = await supabase
      .from('applications')
      .select('*, opportunities(id, title, company_id, application_deadline, type, profiles(full_name, company_data))')
      .eq('student_id', user.id) // This is for extra safety, RLS should handle it.
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching my applications: ${error.message}`);
    }
    return data;
  },

  /**
   * Company views applications for their specific opportunity.
   * RLS ensures companies only see applications for their own opportunities.
   */
  async getApplicationsForOpportunity(opportunityId) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, profiles(id, full_name, avatar_url, student_data)') // Fetch student profile details
      .eq('opportunity_id', opportunityId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching applications for opportunity ${opportunityId}: ${error.message}`);
    }
    return data;
  },

  /**
   * Company updates the status of an application.
   * RLS ensures only the owning company can update.
   */
  async updateApplicationStatus(applicationId, newStatus) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId)
      .select();

    if (error) {
      throw new Error(`Error updating application status for ${applicationId}: ${error.message}`);
    }
    return data[0];
  },

  /**
   * Student withdraws an application.
   * RLS ensures only the student can delete their own application.
   */
  async withdrawApplication(applicationId) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId);

    if (error) {
      throw new Error(`Error withdrawing application ${applicationId}: ${error.message}`);
    }
    return true;
  },
};