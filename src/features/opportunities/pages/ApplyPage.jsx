// src/features/opportunities/pages/ApplyPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { opportunityService, applicationService } from '../../../services';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  DocumentIcon, 
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ApplyPage = () => {
  const { id: opportunityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeFile: null,
    portfolioUrl: '',
    availableStartDate: '',
    expectedSalary: '',
    additionalNotes: ''
  });
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchOpportunityAndCheckApplication();
  }, [opportunityId, user]);

  const fetchOpportunityAndCheckApplication = async () => {
    try {
      const [opportunityData, applicationCheck] = await Promise.all([
        opportunityService.getOpportunityById(opportunityId),
        applicationService.checkExistingApplication(opportunityId, user.id)
      ]);
      
      setOpportunity(opportunityData);
      setHasApplied(applicationCheck.exists);
      
      if (applicationCheck.exists) {
        toast.info('You have already applied to this opportunity');
        navigate(`/student/applications`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load opportunity details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          resumeFile: 'Please upload a PDF or Word document'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          resumeFile: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resumeFile: file
      }));
      
      setErrors(prev => ({
        ...prev,
        resumeFile: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.length < 100) {
      newErrors.coverLetter = 'Cover letter must be at least 100 characters';
    }

    if (!formData.resumeFile) {
      newErrors.resumeFile = 'Resume is required';
    }

    if (!formData.availableStartDate) {
      newErrors.availableStartDate = 'Available start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      // Upload resume file
      let resumeUrl = '';
      if (formData.resumeFile) {
        toast.info('Uploading resume...');
        setUploadProgress(25);
        resumeUrl = await applicationService.uploadResume(formData.resumeFile, user.id);
        setUploadProgress(50);
      }

      // Submit application
      toast.info('Submitting application...');
      setUploadProgress(75);
      
      const applicationData = {
        internship_id: opportunityId,
        student_id: user.id,
        cover_letter_text: formData.coverLetter,
        resume_url: resumeUrl,
        portfolio_url: formData.portfolioUrl || null,
        available_start_date: formData.availableStartDate,
        expected_salary: formData.expectedSalary || null,
        additional_notes: formData.additionalNotes || null,
      };

      await applicationService.submitApplication(applicationData);
      setUploadProgress(100);
      
      toast.success('Application submitted successfully!');
      navigate(`/student/applications`);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-4">The opportunity you're looking for doesn't exist.</p>
          <Link to="/opportunities" className="text-blue-600 hover:text-blue-800">
            Browse Other Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/opportunities/details/${opportunityId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Opportunity
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Apply for: {opportunity.title}
            </h1>
            <p className="text-gray-600">
              {opportunity.company?.name || 'Company Name'}
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              Please fill out all required fields to submit your application.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={6}
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Explain why you're interested in this position and what makes you a great fit..."
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.coverLetter && (
                <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Minimum 100 characters ({formData.coverLetter.length}/100)
              </p>
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Resume *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                  {formData.resumeFile && (
                    <div className="flex items-center justify-center mt-2">
                      <DocumentIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-green-600">{formData.resumeFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
              {errors.resumeFile && (
                <p className="mt-1 text-sm text-red-600">{errors.resumeFile}</p>
              )}
            </div>

            {/* Portfolio URL */}
            <div>
              <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio URL (Optional)
              </label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                placeholder="https://your-portfolio.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Available Start Date */}
            <div>
              <label htmlFor="availableStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                Available Start Date *
              </label>
              <input
                type="date"
                id="availableStartDate"
                name="availableStartDate"
                value={formData.availableStartDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.availableStartDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.availableStartDate && (
                <p className="mt-1 text-sm text-red-600">{errors.availableStartDate}</p>
              )}
            </div>

            {/* Expected Salary */}
            <div>
              <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Salary (Optional)
              </label>
              <input
                type="text"
                id="expectedSalary"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleInputChange}
                placeholder="e.g., $3000/month, Negotiable"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={3}
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any additional information you'd like to share..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Submitting application...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;