// src/features/auth/components/AuthForm.jsx
import React, { useState } from 'react';
import InputField from '../../../components/forms/InputField';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword, validateRequired } from '../../../utils/validation';

const AuthForm = ({ formType, onLogin, onRegisterStudent, onRegisterCompany, loading, setFormType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // For student registration
  const [companyName, setCompanyName] = useState(''); // For company registration
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!validateEmail(email)) newErrors.email = 'Invalid email address.';
    if (!validateRequired(password)) newErrors.password = 'Password is required.';

    if (formType !== 'login') {
      if (!validatePassword(password)) newErrors.password = 'Password must be at least 8 chars, with uppercase, lowercase, number, and special char.';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
      if (formType === 'register-student' && !validateRequired(name)) newErrors.name = 'Name is required.';
      if (formType === 'register-company' && !validateRequired(companyName)) newErrors.companyName = 'Company name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formType === 'login') {
      onLogin({ email, password });
    } else if (formType === 'register-student') {
      onRegisterStudent({ name, email, password, role: 'student' });
    } else if (formType === 'register-company') {
      onRegisterCompany({ companyName, email, password, role: 'company' });
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {formType !== 'login' && formType === 'register-student' && (
        <InputField
          id="name"
          name="name"
          type="text"
          placeholder="Your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          label="Full Name"
        />
      )}
      {formType !== 'login' && formType === 'register-company' && (
        <InputField
          id="companyName"
          name="companyName"
          type="text"
          placeholder="Your Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          error={errors.companyName}
          label="Company Name"
        />
      )}
      <InputField
        id="email-address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        label="Email Address"
      />
      <InputField
        id="password"
        name="password"
        type="password"
        autoComplete={formType === 'login' ? 'current-password' : 'new-password'}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        label="Password"
      />
      {formType !== 'login' && (
        <InputField
          id="confirm-password"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          label="Confirm Password"
        />
      )}

      <div>
        <Button
          type="submit"
          className="w-full justify-center"
          disabled={loading}
        >
          {loading ? 'Loading...' : (
            formType === 'login' ? 'Sign In' : 'Register'
          )}
        </Button>
      </div>

      <div className="text-center">
        {formType === 'login' ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register-student" onClick={() => setFormType('register-student')} className="font-medium text-blue-600 hover:text-blue-500">
              Register as Student
            </Link>{' '}
            or{' '}
            <Link to="/register-company" onClick={() => setFormType('register-company')} className="font-medium text-blue-600 hover:text-blue-500">
              Register as Company
            </Link>
          </p>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" onClick={() => setFormType('login')} className="font-medium text-blue-600 hover:text-blue-500">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default AuthForm;