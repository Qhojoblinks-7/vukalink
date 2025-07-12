// src/services/opportunityService.js

import { supabase } from './supabaseClient'; // Ensure this path is correct

export const opportunityService = {
    /**
     * Fetches all opportunities.
     * Currently fetches all and returns an array directly.
     * Consider implementing server-side pagination for large datasets.
     * @returns {Promise<Array>} An array of formatted opportunity objects.
     */
    async getOpportunities() {
        try {
            const { data, error } = await supabase
                .from('opportunities')
                .select(`
                    *,
                    company:profiles!opportunities_company_id_fkey(
                        id,
                        full_name,
                        avatar_url,
                        company_data
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase error fetching opportunities:", error);
                throw new Error(error.message || 'Could not fetch opportunities.');
            }

            const formattedData = data.map(opportunity => ({
                ...opportunity,
                company: {
                    id: opportunity.company?.id,
                    fullName: opportunity.company?.full_name,
                    avatarUrl: opportunity.company?.avatar_url,
                    industry: opportunity.company?.company_data?.industry,
                    // Add other company_data fields as needed
                },
                profiles: undefined // Remove the original nested profiles object if aliased
            }));

            // This is the array that will become `action.payload` in the Redux slice
            return formattedData;
        } catch (error) {
            console.error("Error in getOpportunities:", error);
            throw error;
        }
    },

    /**
     * Fetches a single opportunity by its ID.
     * @param {string} opportunityId The ID of the opportunity.
     * @returns {Promise<Object>} The formatted opportunity data.
     * @throws {Error} If the opportunity is not found or an error occurs.
     */
    async getOpportunityById(opportunityId) {
        try {
            const { data, error } = await supabase
                .from('opportunities')
                .select(`
                    *,
                    company:profiles!opportunities_company_id_fkey(
                        id,
                        full_name,
                        email,
                        website,
                        avatar_url,
                        company_data
                    )
                `)
                .eq('id', opportunityId)
                .single(); // Use .single() for fetching a single record

            if (error) {
                console.error("Supabase error fetching opportunity by ID:", error);
                throw new Error(error.message || 'Could not fetch opportunity.');
            }
            if (!data) {
                throw new Error('Opportunity not found.');
            }

            // Flatten the company data for easier access
            const formattedData = {
                ...data,
                company: {
                    id: data.company?.id,
                    fullName: data.company?.full_name,
                    email: data.company?.email,
                    website: data.company?.website,
                    avatarUrl: data.company?.avatar_url,
                    description: data.company?.company_data?.description, // Assuming description is in company_data
                    industry: data.company?.company_data?.industry,
                    size: data.company?.company_data?.size, // Assuming size is in company_data
                },
                profiles: undefined // Clean up if `profiles` is also returned
            };

            return formattedData;
        } catch (error) {
            console.error("Error in getOpportunityById:", error);
            throw error;
        }
    },

    // Placeholder for createOpportunity (implement as needed)
    async createOpportunity(opportunityData) {
        console.log('Creating opportunity with data:', opportunityData);
        // Implement actual Supabase insert here
        // Example: const { data, error } = await supabase.from('opportunities').insert(opportunityData).select().single();
        return { id: 'new-opportunity-id-123', ...opportunityData }; // Mock response
    },

    // Placeholder for updateOpportunity (implement as needed)
    async updateOpportunity(opportunityId, updateData) {
        console.log(`Updating opportunity ${opportunityId} with data:`, updateData);
        // Implement actual Supabase update here
        // Example: const { data, error } = await supabase.from('opportunities').update(updateData).eq('id', opportunityId).select().single();
        return { id: opportunityId, ...updateData }; // Mock response
    },

    // Placeholder for deleteOpportunity (implement as needed)
    async deleteOpportunity(opportunityId) {
        console.log(`Deleting opportunity: ${opportunityId}`);
        // Implement actual Supabase delete here
        // Example: const { error } = await supabase.from('opportunities').delete().eq('id', opportunityId);
        return true; // Mock success
    },

    /**
     * Applies a student to an opportunity.
     * @param {string} studentId The ID of the student applying.
     * @param {string} opportunityId The ID of the opportunity to apply for.
     * @returns {Promise<Object>} The newly created application record.
     * @throws {Error} If the application fails (e.g., already applied).
     */
    async applyForOpportunity(studentId, opportunityId) {
        try {
            // Check if already applied to prevent duplicates
            const { data: existingApplication, error: existingError } = await supabase
                .from('applications')
                .select('id')
                .eq('student_id', studentId)
                .eq('opportunity_id', opportunityId)
                .single();

            // PGRST116 means "no rows found" - which is desired here
            if (existingError && existingError.code !== 'PGRST116') {
                throw new Error(`Error checking existing application: ${existingError.message}`);
            }

            if (existingApplication) {
                throw new Error("You have already applied for this opportunity.");
            }

            const { data, error } = await supabase
                .from('applications')
                .insert({
                    student_id: studentId,
                    opportunity_id: opportunityId,
                    status: 'pending', // Default status for new applications
                    applied_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error("Supabase error applying for opportunity:", error);
                throw new Error(error.message || 'Failed to apply for opportunity.');
            }
            return data;
        } catch (error) {
            console.error("Error in applyForOpportunity:", error);
            throw error;
        }
    },

    /**
     * Fetches all applications submitted by a specific student.
     * Joins with opportunities and company profiles to get full details.
     * RLS should ensure a student only sees their own applications.
     * @param {string} studentId - The ID of the student.
     * @returns {Promise<Array>} - An array of application objects with nested opportunity and company data.
     */
    async getStudentApplications(studentId) {
        try {
            const { data, error } = await supabase
                .from('applications')
                .select(`
                    id,
                    student_id,
                    applied_at,
                    status,
                    updated_at,
                    opportunity:opportunities (
                        id,
                        title,
                        type,
                        location,
                        company:profiles!opportunities_company_id_fkey (
                            id,
                            full_name,
                            avatar_url,
                            company_data
                        )
                    )
                `) // Removed 'location_type' completely
                .eq('student_id', studentId)
                .order('applied_at', { ascending: false });

            if (error) {
                throw new Error(`Error fetching student applications: ${error.message}`);
            }

            // Format applications to flatten opportunity and company data for easier access in UI
            const formattedApplications = data.map(app => ({
                id: app.id,
                student_id: app.student_id,
                applied_at: app.applied_at,
                status: app.status,
                updated_at: app.updated_at,
                opportunity: {
                    id: app.opportunity?.id,
                    title: app.opportunity?.title,
                    type: app.opportunity?.type,
                    // locationType: app.opportunity?.location_type, // This field won't be available from the DB
                    location: app.opportunity?.location,
                    company: { // Flatten company data here
                        id: app.opportunity?.company?.id,
                        fullName: app.opportunity?.company?.full_name || 'N/A',
                        avatarUrl: app.opportunity?.company?.avatar_url || '/images/default-company-avatar.png',
                        industry: app.opportunity?.company?.company_data?.industry, // Extract from company_data
                    },
                },
            }));

            return formattedApplications;
        } catch (err) {
            console.error('Opportunity service error (getStudentApplications):', err);
            throw err;
        }
    },

    /**
     * Fetches a single application by its ID, including related opportunity, company, and student details.
     * @param {string} applicationId The ID of the application.
     * @returns {Promise<Object>} The application data.
     * @throws {Error} If the application is not found or an error occurs.
     */
    async getApplicationById(applicationId) {
        if (!applicationId) {
            throw new Error('Application ID is required.');
        }
        try {
            const { data, error } = await supabase
                .from('applications')
                .select(
                    `
                    id,
                    student_id,
                    applied_at,
                    status,
                    updated_at,
                    opportunity:opportunities (
                        id,
                        title,
                        description,
                        requirements,
                        responsibilities,
                        benefits,
                        application_deadline,
                        type,
                        location, -- Removed 'location_type'
                        stipend_type,
                        salary_range_start,
                        salary_range_end,
                        created_at,
                        company:profiles!opportunities_company_id_fkey (
                            id,
                            full_name,
                            email,
                            website,
                            avatar_url,
                            company_data
                        )
                    ),
                    student:profiles!applications_student_id_fkey (
                        id,
                        full_name,
                        email,
                        avatar_url,
                        bio,
                        education,
                        experience,
                        skills,
                        resume_url,
                        portfolio_url,
                        linkedin_url,
                        role
                    )
                    `
                )
                .eq('id', applicationId)
                .single();

            if (error) {
                console.error("Supabase error fetching application by ID:", error);
                throw new Error(error.message || 'Could not fetch application.');
            }
            if (!data) {
                throw new Error('Application not found.');
            }

            // Flatten and format the fetched data
            const formattedApplication = {
                ...data,
                opportunity: {
                    ...data.opportunity,
                    // locationType: data.opportunity?.location_type, // This field won't be available from the DB
                    // Flatten company nested within opportunity
                    company: {
                        id: data.opportunity?.company?.id,
                        fullName: data.opportunity?.company?.full_name,
                        email: data.opportunity?.company?.email,
                        website: data.opportunity?.company?.website,
                        avatarUrl: data.opportunity?.company?.avatar_url,
                        description: data.opportunity?.company?.company_data?.description,
                        industry: data.opportunity?.company?.company_data?.industry,
                        size: data.opportunity?.company?.company_data?.size,
                    }
                },
                // Flatten student data
                student: {
                    id: data.student?.id,
                    fullName: data.student?.full_name,
                    email: data.student?.email,
                    avatarUrl: data.student?.avatar_url,
                    bio: data.student?.bio,
                    education: data.student?.education,
                    experience: data.student?.experience,
                    skills: data.student?.skills,
                    resume_url: data.student?.resume_url,
                    portfolio_url: data.student?.portfolio_url,
                    linkedin_url: data.student?.linkedin_url,
                    role: data.student?.role
                }
            };

            return formattedApplication;
        } catch (error) {
            console.error("Error in getApplicationById:", error);
            throw error;
        }
    },

    /**
     * Updates the status of an application.
     * @param {string} applicationId The ID of the application.
     * @param {string} newStatus The new status for the application.
     * @returns {Promise<Object>} The updated application data.
     * @throws {Error} If the update fails.
     */
    async updateApplicationStatus(applicationId, newStatus) {
        try {
            const { data, error } = await supabase
                .from('applications')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', applicationId)
                .select()
                .single();

            if (error) {
                console.error("Supabase error updating application status:", error);
                throw new Error(error.message || 'Failed to update application status.');
            }
            if (!data) {
                throw new Error('Application not found or no changes made.');
            }
            return data;
        } catch (error) {
            console.error("Error in updateApplicationStatus:", error);
            throw error;
        }
    },

    /**
     * Bulk updates the status of multiple applications.
     * @param {string[]} applicationIds - An array of application IDs to update.
     * @param {string} newStatus - The new status to set for all selected applications.
     * @returns {Promise<Array>} - An array of the updated application records.
     * @throws {Error} If the update fails.
     */
    async bulkUpdateApplicationStatus(applicationIds, newStatus) {
        if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
            throw new Error('No application IDs provided for bulk update.');
        }

        try {
            const { data, error } = await supabase
                .from('applications')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .in('id', applicationIds) // Use .in() for bulk update
                .select(); // Select all updated rows

            if (error) {
                console.error("Supabase error bulk updating application status:", error);
                throw new Error(error.message || 'Failed to bulk update application statuses.');
            }

            return data;
        } catch (error) {
            console.error("Error in bulkUpdateApplicationStatus:", error);
            throw error;
        }
    },

    // Placeholder for getOpportunityApplications (company specific, will implement in Company Dashboard phase)
    async getOpportunityApplications(opportunityId) {
        console.log(`Fetching applications for opportunity: ${opportunityId}`);
        // Implement actual Supabase fetch
        return []; // Mock
    },

    // Placeholder for updateCompanyProfile (company specific, will implement later)
    async updateCompanyProfile(companyId, profileData) {
        console.log(`Updating company profile ${companyId} with:`, profileData);
        // Implement actual Supabase update for profiles table where role is 'company_admin'
        return true; // Mock success
    }
};

// Export the service directly for consistency if you're importing it without curly braces
export default opportunityService;