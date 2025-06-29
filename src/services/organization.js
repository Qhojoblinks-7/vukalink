// src/services/organization.js
import { supabase } from './supabaseClient';

/**
 * Get the organization_id for the current user
 */
export async function getUserOrganizationId(userId) {
  const { data, error } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data.organization_id;
}

/**
 * Map a user to an organization (call after signup or invite)
 */
export async function mapUserToOrganization(userId, organization_id) {
  const { error } = await supabase
    .from('user_organizations')
    .insert([{ user_id: userId, organization_id }], { upsert: true });
  if (error) throw error;
}

/**
 * Get all organizations for dropdown selection
 */
export async function fetchOrganizations() {
  const { data, error } = await supabase
    .from('organizations')
    .select('id, name')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}
