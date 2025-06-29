import { supabase } from './supabaseClient';
import { getUserOrganizationId } from './organization';

// Fetch opportunities from Supabase with filters and search
export const fetchOpportunities = async (filters = {}, page = 1, pageSize = 10, sortOrder = 'Newest') => {
  let query = supabase
    .from('internships')
    .select('*', { count: 'exact' });

  // Keyword search (title, company, description)
  if (filters.keyword) {
    query = query.or(`title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`);
  }
  // Location filter
  if (filters.location && filters.location.length > 0) {
    const locs = filters.location.map(l => `location.ilike.%${l}%`).join(',');
    query = query.or(locs);
  }
  // Industry filter
  if (filters.industry && filters.industry.length > 0) {
    const inds = filters.industry.map(i => `industry.ilike.%${i}%`).join(',');
    query = query.or(inds);
  }
  // Skills filter (JSONB array contains)
  if (filters.skills && filters.skills.length > 0) {
    filters.skills.forEach(skill => {
      query = query.contains('skills_required', [skill]);
    });
  }
  // Duration filter
  if (filters.duration) {
    query = query.eq('duration_weeks', filters.duration);
  }
  // Paid filter
  if (filters.stipend === 'paid') {
    query = query.eq('is_paid', true);
  } else if (filters.stipend === 'unpaid') {
    query = query.eq('is_paid', false);
  }
  // Academic program filter
  if (filters.academicProgram) {
    query = query.ilike('academic_program', `%${filters.academicProgram}%`);
  }
  // Attachment type filter
  if (filters.attachmentType) {
    query = query.ilike('attachment_type', `%${filters.attachmentType}%`);
  }

  // Sorting
  if (sortOrder === 'Newest') {
    query = query.order('posted_at', { ascending: false });
  } else if (sortOrder === 'Oldest') {
    query = query.order('posted_at', { ascending: true });
  } else if (sortOrder === 'A-Z') {
    query = query.order('title', { ascending: true });
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;
  return { data, count };
};

// Create a new opportunity (internship) with org awareness
export const createOpportunity = async (userId, opportunityData) => {
  const organization_id = await getUserOrganizationId(userId);
  const { data, error } = await supabase
    .from('internships')
    .insert([{ ...opportunityData, organization_id }]);
  if (error) throw error;
  return data;
};
