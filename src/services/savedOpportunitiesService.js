// src/services/savedOpportunitiesService.js
import { supabase } from './supabaseClient'; // Ensure this path is correct

/**
 * Fetches all saved opportunities for a given user from Supabase,
 * including nested opportunity and company details.
 *
 * @param {string} userId The ID of the authenticated user.
 * @returns {Array<Object>} An array of formatted saved opportunity objects.
 * @throws {Error} If there's an error fetching the data.
 */
export const getSavedOpportunities = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required to fetch saved opportunities.');
    }

    try {
        const { data, error } = await supabase
            .from('saved_opportunities')
            .select(
                `
                id,
                opportunity_id,
                saved_at,
                opportunities (
                    id,
                    title,
                    location,
                    application_deadline,
                    duration,
                    stipend_type,
                    type,
                    companies (
                        id,
                        name,      
                        logo_url,  
                        industry,  
                        description, 
                        website_url 
                    )
                )
                `
            )
            .eq('user_id', userId);

        if (error) {
            console.error("Supabase error fetching saved opportunities:", error);
            throw new Error(error.message || 'Could not fetch saved opportunities.');
        }

        // Format the data to match the structure expected by the UI components
        const formattedSavedOpportunities = data.map(savedOpp => ({
            id: savedOpp.id,
            dateSaved: savedOpp.saved_at, // Directly use saved_at from saved_opportunities table
            opportunity: {
                id: savedOpp.opportunities.id,
                title: savedOpp.opportunities.title,
                location: savedOpp.opportunities.location,
                applicationDeadline: savedOpp.opportunities.application_deadline,
                duration: savedOpp.opportunities.duration,
                stipend: savedOpp.opportunities.stipend,
                type: savedOpp.opportunities.type,
                company: {
                    id: savedOpp.opportunities.companies.id,
                    fullName: savedOpp.opportunities.companies.name, // MAPPED 'name' from DB to 'fullName' for UI
                    avatarUrl: savedOpp.opportunities.companies.logo_url || '/images/default-company-avatar.png', // MAPPED 'logo_url' from DB to 'avatarUrl'
                    industry: savedOpp.opportunities.companies.industry || null, // MAPPED 'industry'
                    description: savedOpp.opportunities.companies.description || null, // MAPPED 'description'
                    websiteUrl: savedOpp.opportunities.companies.website_url || null, // MAPPED 'website_url'
                },
            },
        }));

        return formattedSavedOpportunities;

    } catch (err) {
        console.error("Service error in getSavedOpportunities:", err);
        throw err; // Re-throw to be handled by the calling component (SavedOpportunitiesPage)
    }
};

/**
 * Saves an opportunity for a user.
 * @param {string} userId The ID of the user.
 * @param {string} opportunityId The ID of the opportunity to save.
 * @returns {Object} The newly saved opportunity record.
 * @throws {Error} If the opportunity cannot be saved.
 */
export const saveOpportunity = async (userId, opportunityId) => {
    if (!userId || !opportunityId) {
        throw new Error('User ID and Opportunity ID are required to save an opportunity.');
    }

    try {
        const { data, error } = await supabase
            .from('saved_opportunities')
            .insert([
                { user_id: userId, opportunity_id: opportunityId }
            ])
            .select() // Return the inserted row
            .single();

        if (error) {
            // Handle unique constraint violation (opportunity already saved)
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new Error('This opportunity is already saved.');
            }
            console.error("Supabase error saving opportunity:", error);
            throw new Error(error.message || 'Could not save opportunity.');
        }

        return data;
    } catch (err) {
        console.error("Service error in saveOpportunity:", err);
        throw err;
    }
};

/**
 * Removes a saved opportunity for a user.
 * @param {string} savedOpportunityId The ID of the saved opportunity record (from saved_opportunities table).
 * @param {string} userId The ID of the user (for RLS check).
 * @returns {void}
 * @throws {Error} If the saved opportunity cannot be removed.
 */
export const removeSavedOpportunity = async (savedOpportunityId, userId) => {
    if (!savedOpportunityId || !userId) {
        throw new Error('Saved opportunity ID and User ID are required to remove a saved opportunity.');
    }

    try {
        const { error } = await supabase
            .from('saved_opportunities')
            .delete()
            .eq('id', savedOpportunityId)
            .eq('user_id', userId); // Important for RLS and security

        if (error) {
            console.error("Supabase error removing saved opportunity:", error);
            throw new Error(error.message || 'Could not remove saved opportunity.');
        }
        // No data is returned on successful delete, just check for error
    } catch (err) {
        console.error("Service error in removeSavedOpportunity:", err);
        throw err;
    }
};