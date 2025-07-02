// src/pages/OpportunityDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { opportunityService } from '../services'; // Adjust path as needed
import { useAuth } from '../hooks/useAuth'; // To check if student is logged in
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import Button from '../components/ui/Button'; // Reusing your Button component
import InputField from '../components/forms/InputField'; // Reusing your InputField
import { toast } from 'react-toastify';
import { ArrowLeftIcon, CalendarDaysIcon, MapPinIcon, CurrencyDollarIcon, BuildingOffice2Icon, MegaphoneIcon } from '@heroicons/react/24/outline'; // Icons

// For handling file uploads
import { supabase } from '../services/supabaseClient'; // Import supabase client directly for storage operations

const OpportunityDetailsPage = () => {
    const { id: opportunityId } = useParams(); // Get opportunity ID from URL
    const { user, loading: authLoading } = useAuth(); // User (student) auth state
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplying, setIsApplying] = useState(false); // State for application submission
    const [hasApplied, setHasApplied] = useState(false); // To check if student already applied
    const [resumeFile, setResumeFile] = useState(null);
    const [coverLetterFile, setCoverLetterFile] = useState(null);
    const [applicationError, setApplicationError] = useState(null); // Specific error for application

    const isStudent = user && user.role === 'student'; // Helper to check if current user is a student

    useEffect(() => {
        const fetchOpportunityAndApplicationStatus = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedOpportunity = await opportunityService.getOpportunityById(opportunityId);
                if (!fetchedOpportunity) {
                    setError(new Error("Opportunity not found."));
                    setLoading(false);
                    return;
                }
                setOpportunity(fetchedOpportunity);

                // If a student is logged in, check if they've already applied
                if (isStudent) {
                    const { data: existingApplications, error: appError } = await supabase
                        .from('applications')
                        .select('id')
                        .eq('opportunity_id', opportunityId)
                        .eq('student_id', user.id)
                        .limit(1);

                    if (appError) {
                        console.error("Error checking existing application:", appError);
                        // Don't block page render for this, but log it.
                    } else if (existingApplications && existingApplications.length > 0) {
                        setHasApplied(true);
                    }
                }

            } catch (err) {
                console.error("Error fetching opportunity details:", err);
                setError(err.message || "Failed to load opportunity details.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchOpportunityAndApplicationStatus();
        }
    }, [opportunityId, user, authLoading, isStudent]); // Re-run when these dependencies change

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            if (name === "resume") {
                setResumeFile(files[0]);
            } else if (name === "coverLetter") {
                setCoverLetterFile(files[0]);
            }
        }
    };

    const uploadFile = async (file, folder) => {
        if (!file) return null;

        const fileExtension = file.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('vuka_uploads') // Your Supabase Storage bucket name
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false // Set to true if you want to overwrite existing files with the same path
            });

        if (error) {
            throw new Error(`File upload failed for ${file.name}: ${error.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('vuka_uploads')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    };


    const handleApply = async () => {
        setIsApplying(true);
        setApplicationError(null);

        if (!isStudent) {
            setApplicationError("You must be logged in as a student to apply.");
            setIsApplying(false);
            return;
        }

        if (hasApplied) {
            setApplicationError("You have already applied for this opportunity.");
            setIsApplying(false);
            return;
        }

        if (!resumeFile) {
            setApplicationError("Please upload your resume to apply.");
            setIsApplying(false);
            return;
        }

        let resumeUrl = null;
        let coverLetterUrl = null;

        try {
            toast.info("Uploading your documents...");
            resumeUrl = await uploadFile(resumeFile, 'resumes');
            if (coverLetterFile) {
                coverLetterUrl = await uploadFile(coverLetterFile, 'cover_letters');
            }

            toast.info("Submitting your application...");
            const applicationData = {
                opportunity_id: opportunityId,
                student_id: user.id, // Assuming user.id is the student's profile ID
                resume_url: resumeUrl,
                cover_letter_url: coverLetterUrl,
            };

            await opportunityService.applyForOpportunity(applicationData);
            setHasApplied(true); // Mark as applied on successful submission
            toast.success("Application submitted successfully!");

        } catch (err) {
            console.error("Error during application process:", err);
            setApplicationError(err.message || "Failed to submit application. Please try again.");
            toast.error(err.message || "Failed to submit application. Please try again.");
            // Optionally, handle cleanup of uploaded files if application submission fails after upload
        } finally {
            setIsApplying(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader message="Loading Opportunity Details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-4">
                <ErrorMessage message={error.message} />
                <Link to="/opportunities" className="mt-4 text-vuka-blue hover:underline flex items-center">
                    <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Opportunities
                </Link>
            </div>
        );
    }

    if (!opportunity) {
        return null; // Should be handled by error state if not found
    }

    const {
        title,
        description,
        type,
        location_type: locationType,
        location,
        application_deadline: applicationDeadline,
        stipend_or_salary: stipendOrSalary,
        benefits,
        duration,
        requirements,
        responsibilities,
        profiles: companyProfile, // Assuming profile data is nested under 'profiles'
    } = opportunity;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/opportunities" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center space-x-2">
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back to All Opportunities</span>
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
                    {/* Company Info */}
                    {companyProfile && (
                        <div className="flex items-center mb-6 border-b pb-4 dark:border-gray-700">
                            <img
                                src={companyProfile.avatar_url || '/images/default-company-avatar.png'}
                                alt={companyProfile.full_name}
                                className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-600"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{companyProfile.full_name}</h2>
                                {companyProfile.company_data?.industry && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{companyProfile.company_data.industry}</p>
                                )}
                                <Link to={`/profiles/company/${companyProfile.id}`} className="text-vuka-blue hover:underline text-sm mt-1 inline-block dark:text-blue-400">
                                    View Company Profile
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Opportunity Title */}
                    <h1 className="text-3xl md:text-4xl font-heading text-vuka-dark-blue dark:text-gray-100 mb-4 leading-tight">
                        {title}
                    </h1>

                    {/* Key Info Badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                            <MegaphoneIcon className="h-4 w-4 mr-1.5" /> {type}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            <MapPinIcon className="h-4 w-4 mr-1.5" /> {locationType} {location && `(${location})`}
                        </span>
                        {stipendOrSalary && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                                <CurrencyDollarIcon className="h-4 w-4 mr-1.5" /> {stipendOrSalary}
                            </span>
                        )}
                        {duration && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">
                                <CalendarDaysIcon className="h-4 w-4 mr-1.5" /> {duration}
                            </span>
                        )}
                        {applicationDeadline && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                                <CalendarDaysIcon className="h-4 w-4 mr-1.5" /> Closes: {new Date(applicationDeadline).toLocaleDateString('en-GH')}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-vuka-blue dark:text-gray-100 mb-3">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{description}</p>
                    </div>

                    {/* Responsibilities */}
                    {responsibilities && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-vuka-blue dark:text-gray-100 mb-3">Key Responsibilities</h3>
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{responsibilities}</div>
                        </div>
                    )}

                    {/* Requirements */}
                    {requirements && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-vuka-blue dark:text-gray-100 mb-3">Requirements & Qualifications</h3>
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{requirements}</div>
                        </div>
                    )}

                    {/* Benefits */}
                    {benefits && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-vuka-blue dark:text-gray-100 mb-3">Benefits</h3>
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{benefits}</div>
                        </div>
                    )}

                    {/* Application Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
                        {isStudent ? (
                            hasApplied ? (
                                <div className="bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-200 p-4 rounded-md text-center">
                                    You have already applied for this opportunity!
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-semibold text-vuka-blue dark:text-gray-100 mb-4">Apply for this Opportunity</h3>
                                    {applicationError && <ErrorMessage message={applicationError} className="mb-4" />}
                                    <div className="space-y-4">
                                        <InputField
                                            label="Upload Resume (PDF only)"
                                            id="resume"
                                            name="resume"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            required
                                        />
                                        <InputField
                                            label="Upload Cover Letter (Optional, PDF only)"
                                            id="coverLetter"
                                            name="coverLetter"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                        <Button
                                            onClick={handleApply}
                                            disabled={isApplying || !resumeFile} // Disable if no resume or currently applying
                                            className="w-full bg-vuka-blue text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                                        >
                                            {isApplying ? 'Submitting Application...' : 'Submit Application'}
                                        </Button>
                                    </div>
                                </>
                            )
                        ) : (
                            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-200 p-4 rounded-md text-center">
                                Please <Link to="/login" className="font-semibold text-vuka-blue hover:underline dark:text-blue-400">log in</Link> as a **student** to apply for this opportunity.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetailsPage;