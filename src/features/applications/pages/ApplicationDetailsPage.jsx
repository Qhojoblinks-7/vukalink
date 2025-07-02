import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { opportunityService } from '../../../services'; // Adjust path as needed
import { useAuth } from '../../../hooks/useAuth';
import Loader from '../../../components/ui/Loader';
import ErrorMessage from '../../../components/ui/ErrorMessage';
import Button from '../../../components/ui/Button';
import { toast } from 'react-toastify';
import {
    ArrowLeftIcon,
    CalendarDaysIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    BriefcaseIcon, // For opportunity type
    BuildingOffice2Icon, // For company profile
    DocumentIcon, // For resume/cover letter
} from '@heroicons/react/24/outline';


// Helper component for application status display (copied from MyApplicationsPage for consistency)
const ApplicationStatusBadge = ({ status }) => {
    let bgColor = 'bg-gray-200';
    let textColor = 'text-gray-800';
    let text = status;

    switch (status) {
        case 'pending':
            bgColor = 'bg-yellow-100 dark:bg-yellow-800';
            textColor = 'text-yellow-800 dark:text-yellow-100';
            text = 'Pending Review';
            break;
        case 'reviewed':
            bgColor = 'bg-blue-100 dark:bg-blue-800';
            textColor = 'text-blue-800 dark:text-blue-100';
            text = 'Reviewed';
            break;
        case 'accepted':
            bgColor = 'bg-green-100 dark:bg-green-800';
            textColor = 'text-green-800 dark:text-green-100';
            text = 'Accepted';
            break;
        case 'rejected':
            bgColor = 'bg-red-100 dark:bg-red-800';
            textColor = 'text-red-800 dark:text-red-100';
            text = 'Rejected';
            break;
        case 'withdrawn':
            bgColor = 'bg-gray-300 dark:bg-gray-700';
            textColor = 'text-gray-600 dark:text-gray-300';
            text = 'Withdrawn';
            break;
        default:
            break;
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} capitalize`}>
            {text}
        </span>
    );
};


const ApplicationDetailsPage = () => {
    const { id: applicationId } = useParams(); // Get application ID from URL
    const { user, loading: authLoading } = useAuth(); // Auth state for user role and ID
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            if (!user || authLoading) return; // Wait for auth state to resolve

            setLoading(true);
            setError(null);
            try {
                const fetchedApplication = await opportunityService.getApplicationById(applicationId);

                if (!fetchedApplication) {
                    setError(new Error("Application not found."));
                    setLoading(false);
                    return;
                }

                // Security check: Ensure the logged-in user is either the student who submitted the application
                // OR a company admin whose company owns the opportunity.
                const isStudentOwner = user.role === 'student' && fetchedApplication.student?.id === user.id;
                const isCompanyOwner = user.role === 'company_admin' && fetchedApplication.opportunity?.company?.id === user.id;

                if (!isStudentOwner && !isCompanyOwner) {
                    setError(new Error("You do not have permission to view this application."));
                    setLoading(false);
                    return;
                }

                setApplication(fetchedApplication);

            } catch (err) {
                console.error("Error fetching application details:", err);
                setError(err.message || "Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) { // Only fetch if auth state is resolved and user is available
            fetchApplicationDetails();
        } else if (!authLoading && !user) {
            // If auth is done and no user, redirect to login or show access denied
            setError(new Error("You must be logged in to view application details."));
            setLoading(false);
        }

    }, [applicationId, user, authLoading, navigate]); // Add navigate to dependencies if used in useEffect

    const handleWithdrawApplication = async () => {
        if (!application || application.status === 'withdrawn' || application.status === 'accepted' || application.status === 'rejected') {
            toast.info("This application cannot be withdrawn.");
            return;
        }

        if (!window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
            return;
        }

        setIsWithdrawing(true);
        try {
            await opportunityService.updateApplicationStatus(applicationId, 'withdrawn');
            toast.success("Application withdrawn successfully!");
            // Update the local state to reflect the change
            setApplication(prevApp => ({ ...prevApp, status: 'withdrawn' }));
        } catch (err) {
            console.error("Error withdrawing application:", err);
            toast.error(err.message || "Failed to withdraw application. Please try again.");
        } finally {
            setIsWithdrawing(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader message="Loading application details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-4">
                <ErrorMessage message={error.message} />
                <Link to="/my-applications" className="mt-4 text-vuka-blue hover:underline flex items-center">
                    <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to My Applications
                </Link>
            </div>
        );
    }

    if (!application) {
        return null; // Should be handled by error state if not found
    }

    const {
        status,
        applied_at,
        updated_at,
        opportunity,
        student,
    } = application;

    // Destructure opportunity details for easier access
    const {
        title: opportunityTitle,
        type: opportunityType,
        location_type: locationType,
        location,
        salary_range_start,
        salary_range_end,
        deadline: applicationDeadline,
        description,
        requirements,
        responsibilities,
        benefits,
        company, // Flattened company object from opportunityService
    } = opportunity || {}; // Default to empty object if opportunity is null/undefined

    // Format salary range
    const stipendOrSalary = (salary_range_start && salary_range_end)
        ? `GH₵${salary_range_start} - GH₵${salary_range_end}`
        : null;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/my-applications" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center space-x-2">
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back to My Applications</span>
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-heading text-vuka-dark-blue dark:text-gray-100 mb-6 border-b pb-4 dark:border-gray-700">
                        Application Details
                    </h1>

                    {/* Application Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Application Status:</p>
                            <ApplicationStatusBadge status={status} />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Applied On:</p>
                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                                {new Date(applied_at).toLocaleDateString('en-GH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        {applied_at !== updated_at && (
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Last Updated:</p>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">
                                    {new Date(updated_at).toLocaleDateString('en-GH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Button (Withdraw) */}
                    {user?.role === 'student' && status !== 'withdrawn' && status !== 'accepted' && status !== 'rejected' && (
                        <div className="mb-8">
                            <Button
                                onClick={handleWithdrawApplication}
                                disabled={isWithdrawing}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isWithdrawing ? 'Withdrawing...' : 'Withdraw Application'}
                            </Button>
                        </div>
                    )}


                    {/* Documents Section */}
                    <div className="mb-8 border-t pt-6 border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-semibold text-vuka-blue dark:text-gray-100 mb-4">Submitted Documents</h2>
                        <div className="space-y-4">
                            {application.resume_url ? (
                                <div className="flex items-center space-x-2">
                                    <DocumentIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <a
                                        href={application.resume_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-vuka-blue hover:underline font-medium dark:text-blue-400"
                                    >
                                        View Resume
                                    </a>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No resume submitted with this application.</p>
                            )}

                            {application.cover_letter_url ? (
                                <div className="flex items-center space-x-2">
                                    <DocumentIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <a
                                        href={application.cover_letter_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-vuka-blue hover:underline font-medium dark:text-blue-400"
                                    >
                                        View Cover Letter
                                    </a>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No cover letter submitted with this application.</p>
                            )}
                        </div>
                    </div>

                    {/* Student Profile (Visible to company_admin, or student for self-review) */}
                    {student && (user?.role === 'company_admin' || user?.role === 'student') && (
                        <div className="mb-8 border-t pt-6 border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-semibold text-vuka-blue dark:text-gray-100 mb-4">Applicant Information</h2>
                            <div className="flex items-center mb-4">
                                <img
                                    src={student.avatarUrl || '/images/default-avatar.png'}
                                    alt={student.fullName}
                                    className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-600"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{student.fullName}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{student.email}</p>
                                    <Link to={`/profiles/student/${student.id}`} className="text-vuka-blue hover:underline text-sm mt-1 inline-block dark:text-blue-400">
                                        View Student Profile
                                    </Link>
                                </div>
                            </div>
                            {/* You can add more student details here if needed, like bio, skills etc. */}
                            {student.bio && (
                                <div className="mt-4">
                                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">Bio</h4>
                                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{student.bio}</p>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Opportunity Details Section */}
                    {opportunity && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
                            <h2 className="text-2xl font-semibold text-vuka-blue dark:text-gray-100 mb-4">Opportunity Details</h2>

                            {/* Company Info (nested within opportunity) */}
                            {company && (
                                <div className="flex items-center mb-6 border-b pb-4 dark:border-gray-700">
                                    <img
                                        src={company.avatarUrl || '/images/default-company-avatar.png'}
                                        alt={company.fullName}
                                        className="h-14 w-14 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-600"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{company.fullName}</h3>
                                        {company.industry && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">{company.industry}</p>
                                        )}
                                        <Link to={`/profiles/company/${company.id}`} className="text-vuka-blue hover:underline text-sm mt-1 inline-block dark:text-blue-400">
                                            View Company Profile
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Opportunity Title */}
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 leading-tight">
                                {opportunityTitle}
                            </h3>

                            {/* Key Info Badges */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                    <BriefcaseIcon className="h-4 w-4 mr-1.5" /> {opportunityType}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                    <MapPinIcon className="h-4 w-4 mr-1.5" /> {locationType} {location && `(${location})`}
                                </span>
                                {stipendOrSalary && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                                        <CurrencyDollarIcon className="h-4 w-4 mr-1.5" /> {stipendOrSalary}
                                    </span>
                                )}
                                {applicationDeadline && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                                        <CalendarDaysIcon className="h-4 w-4 mr-1.5" /> Closes: {new Date(applicationDeadline).toLocaleDateString('en-GH')}
                                    </span>
                                )}
                            </div>

                            {/* Opportunity Description */}
                            <div className="mb-8">
                                <h4 className="text-xl font-semibold text-vuka-blue dark:text-gray-100 mb-3">Description</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{description}</p>
                            </div>

                            {/* Responsibilities */}
                            {responsibilities && (
                                <div className="mb-8">
                                    <h4 className="text-xl font-semibold text-vuka-blue dark:text-gray-100 mb-3">Key Responsibilities</h4>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{responsibilities}</div>
                                </div>
                            )}

                            {/* Requirements */}
                            {requirements && (
                                <div className="mb-8">
                                    <h4 className="text-xl font-semibold text-vuka-blue dark:text-gray-100 mb-3">Requirements & Qualifications</h4>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{requirements}</div>
                                </div>
                            )}

                            {/* Benefits */}
                            {benefits && (
                                <div className="mb-8">
                                    <h4 className="text-xl font-semibold text-vuka-blue dark:text-gray-100 mb-3">Benefits</h4>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{benefits}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsPage;