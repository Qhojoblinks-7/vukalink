// src/pages/CompanyPostOpportunityPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import CompanyDashboardSidebar from '../components/company/CompanyDashboardSidebar';
import MobileHeader from '../components/dashboard/MobileHeader'; // For mobile view header
import InputField from '../components/forms/InputField'; // Reusing your InputField
import TextareaField from '../components/forms/TextareaField'; // Reusing your TextareaField
import SelectField from '../components/forms/SelectField'; // Reusing your SelectField
import Button from '../components/ui/Button'; // Reusing your Button component
import DatePicker from 'react-datepicker'; // For date input
import 'react-datepicker/dist/react-datepicker.css'; // Styles for react-datepicker
import { toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css';

const CompanyPostOpportunityPage = () => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: '', // e.g., Internship, Full-time, Volunteer
    locationType: '', // e.g., On-site, Remote, Hybrid
    location: '', // Physical location if On-site/Hybrid
    description: '',
    responsibilities: '',
    requirements: '',
    applicationDeadline: null, // Date object for DatePicker
    stipendOrSalary: '',
    benefits: '',
    duration: '', // e.g., 3 months, 6 weeks, Permanent
    // Add more fields as needed, e.g., application instructions, contact email
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== 'company') {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-danger text-xl font-body p-4">
        Access Denied: This page is for companies only.
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      applicationDeadline: date,
    }));
    if (errors.applicationDeadline) {
      setErrors((prevErrors) => ({ ...prevErrors, applicationDeadline: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Opportunity title is required.';
    if (!formData.type) newErrors.type = 'Opportunity type is required.';
    if (!formData.locationType) newErrors.locationType = 'Location type is required.';
    if (formData.locationType !== 'Remote' && !formData.location.trim()) {
      newErrors.location = 'Location is required for On-site/Hybrid opportunities.';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required.';
    if (!formData.applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log('Posting Opportunity:', formData);
      // Replace with your actual API call to save the opportunity
      // const response = await fetch('/api/opportunities', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user.token}`, // Assuming token is available
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to post opportunity.');
      // }

      // const result = await response.json();
      // console.log('Opportunity Posted Successfully:', result);

      toast.success('Opportunity posted successfully!');
      // Optionally reset form or redirect
      setFormData({
        title: '',
        type: '',
        locationType: '',
        location: '',
        description: '',
        responsibilities: '',
        requirements: '',
        applicationDeadline: null,
        stipendOrSalary: '',
        benefits: '',
        duration: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error posting opportunity:', error);
      toast.error(error.message || 'Error posting opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const opportunityTypes = [
    { value: '', label: 'Select Type' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Volunteer', label: 'Volunteer' },
    { value: 'Contract', label: 'Contract' },
  ];

  const locationTypes = [
    { value: '', label: 'Select Location Type' },
    { value: 'On-site', label: 'On-site' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' },
  ];

  return (
    <div className="bg-vuka-grey-light min-h-screen flex flex-col md:flex-row">
      <div className="md:hidden">
        <MobileHeader
          title="Post New Opportunity"
          showBack={true}
          showBell={true}
          showProfile={true}
          onMenuClick={toggleSidebar}
        />
      </div>

      <CompanyDashboardSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="flex-grow p-4 md:p-8 md:ml-64 transition-all duration-300">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full">
          <h1 className="text-2xl md:text-3xl font-heading text-vuka-strong mb-6 border-b pb-4">
            Post a New Opportunity
          </h1>

          <p className="text-vuka-text mb-8">
            Fill in the details below to create a new opportunity listing for students.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Opportunity Details */}
            <h2 className="text-xl font-heading text-vuka-blue border-b pb-2">Opportunity Details</h2>
            <InputField
              label="Opportunity Title"
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Software Engineering Intern, Marketing Manager"
              error={errors.title}
              required
            />
            <SelectField
              label="Opportunity Type"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={opportunityTypes}
              error={errors.type}
              required
            />
            <SelectField
              label="Location Type"
              id="locationType"
              name="locationType"
              value={formData.locationType}
              onChange={handleChange}
              options={locationTypes}
              error={errors.locationType}
              required
            />
            {formData.locationType !== 'Remote' && (
              <InputField
                label="Specific Location (City, State/Region, Country)"
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Accra, Greater Accra, Ghana"
                error={errors.location}
                required={formData.locationType !== 'Remote'}
              />
            )}
            <TextareaField
              label="Opportunity Description"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a general overview of the opportunity..."
              error={errors.description}
              required
              rows={5}
            />
            <TextareaField
              label="Key Responsibilities"
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="List the main duties and responsibilities (e.g., '- Develop new features...', '- Collaborate with team...')"
              error={errors.responsibilities}
              rows={5}
            />
            <TextareaField
              label="Requirements and Qualifications"
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Outline the necessary skills, experience, and education (e.g., '- Currently enrolled in...', '- Strong communication skills...')"
              error={errors.requirements}
              required
              rows={5}
            />

            {/* Application Details */}
            <h2 className="text-xl font-heading text-vuka-blue border-b pb-2 pt-6">Application Details</h2>
            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-vuka-text mb-1">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="applicationDeadline"
                selected={formData.applicationDeadline}
                onChange={handleDateChange}
                dateFormat="yyyy/MM/dd"
                minDate={new Date()} // Can only select dates from today onwards
                className={`w-full p-3 border ${errors.applicationDeadline ? 'border-red-500' : 'border-vuka-grey-light'} rounded-md focus:ring-vuka-blue focus:border-vuka-blue`}
                placeholderText="Select a date"
                required
              />
              {errors.applicationDeadline && (
                <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</p>
              )}
            </div>
            <InputField
              label="Stipend / Salary (Optional)"
              id="stipendOrSalary"
              name="stipendOrSalary"
              type="text"
              value={formData.stipendOrSalary}
              onChange={handleChange}
              placeholder="e.g., GHS 1,500/month, $50,000/year, Unpaid"
            />
            <TextareaField
              label="Benefits (Optional)"
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              placeholder="List any benefits offered (e.g., Health insurance, Mentorship, Travel allowance)"
              rows={3}
            />
            <InputField
              label="Duration (Optional)"
              id="duration"
              name="duration"
              type="text"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 3 months, 6 weeks, Permanent"
            />

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-vuka-blue text-white py-3 px-6 rounded-md hover:bg-vuka-dark-blue transition duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Opportunity'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyPostOpportunityPage;