// src/services/savedOpportunities.js
import { supabase } from './supabaseClient';
import { getUserOrganizationId } from './organization';

// Fetch all saved opportunities for a student
export async function fetchSavedOpportunities(student_id) {
  const { data, error } = await supabase
    .from('saved_opportunities')
    .select('internship_id, saved_at')
    .eq('student_id', student_id);
  if (error) throw error;
  return data;
}

// Save an opportunity with org awareness (if needed)
export async function saveOpportunity(student_id, internship_id, userId) {
  const organization_id = await getUserOrganizationId(userId);
  const { data, error } = await supabase
    .from('saved_opportunities')
    .insert([{ student_id, internship_id, organization_id }]);
  if (error) throw error;
  return data;
}

// Remove a saved opportunity
export async function removeSavedOpportunity(student_id, internship_id) {
  const { error } = await supabase
    .from('saved_opportunities')
    .delete()
    .eq('student_id', student_id)
    .eq('internship_id', internship_id);
  if (error) throw error;
}
