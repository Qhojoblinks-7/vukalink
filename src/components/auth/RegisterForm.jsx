// src/components/auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import { signUp } from '../../services/auth';
import { fetchOrganizations, mapUserToOrganization } from '../../services/organization';
import { supabase } from '../../services/supabaseClient';
import Input from '../ui/Input';
import Button from '../ui/Button';


const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); // Default to student
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgOptions, setOrgOptions] = useState([]);

  useEffect(() => {
    // Fetch organizations for dropdown
    fetchOrganizations().then(setOrgOptions).catch(() => setOrgOptions([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error: authError, needsConfirmation, user } = await signUp(email, password, role);
    if (authError) {
      setError(authError.message);
    } else if (needsConfirmation) {
      setSuccessMessage("Registration successful! Please check your email for a verification link.");
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setSuccessMessage("Registration successful! You are now logged in.");
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Map user to organization after registration
      if (user && orgId) {
        try {
          await mapUserToOrganization(user.id, orgId);
        } catch {
          setError('Could not map user to organization.');
        }
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="register-email" // Unique ID
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={error && error.includes('email') ? error : ''}
      />
      <div>
        <label htmlFor="register-role" className="block text-sm font-medium text-vuka-medium-grey mb-1">Register as</label>
        <select
          id="register-role"
          value={role}
          onChange={e => setRole(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="student">Student</option>
          <option value="company">Company</option>
        </select>
      </div>
      <div>
        <label htmlFor="register-org" className="block text-sm font-medium text-vuka-medium-grey mb-1">Organization</label>
        <select
          id="register-org"
          value={orgId}
          onChange={e => setOrgId(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          <option value="">Select Organization</option>
          {orgOptions.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>
      <Input
        id="register-password" // Unique ID
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={error && error.includes('password') ? error : ''}
      />
      <Input
        id="confirm-password" // Unique ID
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        error={error && error.includes('match') ? error : ''} // Specific error for password mismatch
      />

      {/* General Error/Success Messages */}
      {error && !error.includes('email') && !error.includes('password') && !error.includes('match') && (
        <p className="text-vuka-danger text-sm text-center">{error}</p>
      )}
      {successMessage && (
        <p className="text-vuka-success text-sm text-center font-medium">{successMessage}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm;