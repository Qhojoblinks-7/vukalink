// src/utils/validation.js

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return re.test(password);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim() !== '';
};

// Add more specific validation functions for forms etc.
export const validateOpportunityForm = (formData) => {
  const errors = {};
  if (!validateRequired(formData.jobTitle)) errors.jobTitle = 'Job title is required.';
  if (!validateRequired(formData.company)) errors.company = 'Company name is required.';
  if (!validateRequired(formData.location)) errors.location = 'Location is required.';
  if (!validateRequired(formData.description)) errors.description = 'Description is required.';
  if (!validateRequired(formData.applicationDeadline)) errors.applicationDeadline = 'Application deadline is required.';
  if (new Date(formData.applicationDeadline) < new Date()) errors.applicationDeadline = 'Deadline cannot be in the past.';
  if (!validateRequired(formData.type)) errors.type = 'Opportunity type is required.';
  if (!validateRequired(formData.duration)) errors.duration = 'Duration is required.';
  if (!validateRequired(formData.stipend)) errors.stipend = 'Stipend type is required.';
  if (!formData.skills || formData.skills.length === 0) errors.skills = 'At least one skill is required.';
  return errors;
};