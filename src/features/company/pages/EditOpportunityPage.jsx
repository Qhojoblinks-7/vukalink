import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { supabase } from '../../../services/supabaseClient';
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

const EditOpportunityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('id', id)
        .eq('company_id', user.id)
        .single();

      if (error) throw error;
      setOpportunity(data);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Failed to load opportunity details');
      navigate('/company/manage-opportunities');
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(50, 'Description must be at least 50 characters')
      .max(2000, 'Description must not exceed 2000 characters'),
    skills_required: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one skill is required'),
    location: Yup.string()
      .required('Location is required')
      .max(100, 'Location must not exceed 100 characters'),
    duration_weeks: Yup.number()
      .positive('Duration must be positive')
      .integer('Duration must be a whole number')
      .max(52, 'Duration cannot exceed 52 weeks'),
    start_date: Yup.date()
      .min(new Date(), 'Start date cannot be in the past'),
    end_date: Yup.date()
      .min(Yup.ref('start_date'), 'End date must be after start date'),
    application_deadline: Yup.date()
      .min(new Date(), 'Application deadline cannot be in the past')
      .max(Yup.ref('start_date'), 'Application deadline must be before start date'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('internships')
        .update({
          title: values.title,
          description: values.description,
          skills_required: values.skills_required,
          location: values.location,
          duration_weeks: values.duration_weeks,
          start_date: values.start_date,
          end_date: values.end_date,
          is_paid: values.is_paid,
          academic_credit_eligible: values.academic_credit_eligible,
          application_deadline: values.application_deadline,
          status: values.status,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq('id', id)
        .eq('company_id', user.id);

      if (error) throw error;

      toast.success('Opportunity updated successfully!');
      navigate('/company/manage-opportunities');
    } catch (error) {
      console.error('Error updating opportunity:', error);
      toast.error('Failed to update opportunity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);

      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', id)
        .eq('company_id', user.id);

      if (error) throw error;

      toast.success('Opportunity deleted successfully!');
      navigate('/company/manage-opportunities');
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast.error('Failed to delete opportunity. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSkillChange = (skills, setFieldValue) => {
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFieldValue('skills_required', skillsArray);
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
            onClick={() => navigate('/company/manage-opportunities')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Manage Opportunities
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
            onClick={() => navigate('/company/manage-opportunities')}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Back to Manage Opportunities
          </button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Opportunity
            </h1>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Opportunity Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Update the details of your internship opportunity.
            </p>
          </div>

          <Formik
            initialValues={{
              title: opportunity.title || '',
              description: opportunity.description || '',
              skills_required: opportunity.skills_required || [],
              location: opportunity.location || '',
              duration_weeks: opportunity.duration_weeks || '',
              start_date: opportunity.start_date || '',
              end_date: opportunity.end_date || '',
              is_paid: opportunity.is_paid || false,
              academic_credit_eligible: opportunity.academic_credit_eligible || false,
              application_deadline: opportunity.application_deadline || '',
              status: opportunity.status || 'Open',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, setFieldValue, values }) => (
              <Form className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position Title *
                  </label>
                  <Field
                    name="title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Frontend Development Intern"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe the role, responsibilities, and what the intern will learn..."
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Skills Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Required Skills *
                  </label>
                  <Field
                    name="skills_required"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., JavaScript, React, Communication (comma-separated)"
                    value={values.skills_required.join(', ')}
                    onChange={(e) => handleSkillChange(e.target.value, setFieldValue)}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter skills separated by commas
                  </p>
                  <ErrorMessage
                    name="skills_required"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <Field
                    name="location"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Accra, Ghana or Remote"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (weeks) *
                  </label>
                  <Field
                    name="duration_weeks"
                    type="number"
                    min="1"
                    max="52"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 12"
                  />
                  <ErrorMessage
                    name="duration_weeks"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <Field
                      name="start_date"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <ErrorMessage
                      name="start_date"
                      component="div"
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <Field
                      name="end_date"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <ErrorMessage
                      name="end_date"
                      component="div"
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Application Deadline
                    </label>
                    <Field
                      name="application_deadline"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <ErrorMessage
                      name="application_deadline"
                      component="div"
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Field
                      name="is_paid"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      This is a paid internship
                    </label>
                  </div>

                  <div className="flex items-center">
                    <Field
                      name="academic_credit_eligible"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      Eligible for academic credit
                    </label>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Filled">Filled</option>
                  </Field>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => navigate('/company/manage-opportunities')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Opportunity'}
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

export default EditOpportunityPage;