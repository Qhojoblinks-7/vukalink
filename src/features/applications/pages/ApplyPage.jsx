import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { supabase } from '../../../services/supabaseClient';
import { ChevronLeftIcon, PaperClipIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ApplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select(`
          *,
          companies (
            name,
            industry,
            description,
            logo_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setOpportunity(data);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Failed to load opportunity details');
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    coverLetter: Yup.string()
      .required('Cover letter is required')
      .min(100, 'Cover letter must be at least 100 characters')
      .max(2000, 'Cover letter must not exceed 2000 characters'),
    whyInterested: Yup.string()
      .required('Please explain why you are interested')
      .min(50, 'Please provide a more detailed explanation')
      .max(500, 'Response must not exceed 500 characters'),
    relevantExperience: Yup.string()
      .required('Please describe your relevant experience')
      .min(50, 'Please provide more details about your experience')
      .max(500, 'Response must not exceed 500 characters'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      // Check if user has already applied
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('student_id', user.id)
        .eq('internship_id', id)
        .single();

      if (existingApplication) {
        toast.error('You have already applied to this opportunity');
        return;
      }

      // Upload resume if provided
      let resumeUrl = null;
      if (resumeFile) {
        const fileName = `resumes/${user.id}/${Date.now()}_${resumeFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;
        resumeUrl = uploadData.path;
      }

      // Create application
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            student_id: user.id,
            internship_id: id,
            cover_letter_text: values.coverLetter,
            status: 'Submitted',
            resume_url: resumeUrl,
          }
        ]);

      if (error) throw error;

      toast.success('Application submitted successfully!');
      navigate('/student/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.includes('pdf') && !file.type.includes('doc')) {
        toast.error('Please upload a PDF or DOC file');
        return;
      }
      setResumeFile(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Opportunity not found
          </h1>
          <button
            onClick={() => navigate('/student/opportunities')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-4">
              {opportunity.companies?.logo_url && (
                <img
                  src={opportunity.companies.logo_url}
                  alt={opportunity.companies.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {opportunity.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  {opportunity.companies?.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {opportunity.location && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      📍 {opportunity.location}
                    </span>
                  )}
                  {opportunity.is_paid && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      💰 Paid
                    </span>
                  )}
                  {opportunity.academic_credit_eligible && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      🎓 Academic Credit
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Application Form
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Please complete all required fields to submit your application.
            </p>
          </div>

          <Formik
            initialValues={{
              coverLetter: '',
              whyInterested: '',
              relevantExperience: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="p-6 space-y-6">
                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter *
                  </label>
                  <Field
                    as="textarea"
                    name="coverLetter"
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Write a compelling cover letter explaining why you're the perfect candidate for this position..."
                  />
                  <ErrorMessage
                    name="coverLetter"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Why Interested */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Why are you interested in this opportunity? *
                  </label>
                  <Field
                    as="textarea"
                    name="whyInterested"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Explain what excites you about this role and company..."
                  />
                  <ErrorMessage
                    name="whyInterested"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Relevant Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe your relevant experience *
                  </label>
                  <Field
                    as="textarea"
                    name="relevantExperience"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Share your relevant skills, projects, or work experience..."
                  />
                  <ErrorMessage
                    name="relevantExperience"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume/CV (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="resume-upload"
                          className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="resume-upload"
                            name="resume-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, DOC up to 5MB
                      </p>
                    </div>
                  </div>
                  {resumeFile && (
                    <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      {resumeFile.name}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;