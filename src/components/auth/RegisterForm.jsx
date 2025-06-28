// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { signUp } from '../../services/auth';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Clear messages on new submission

    // Client-side Validation: Basic password matching before API call.
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return; // Early return if validation fails
    }

    setLoading(true);
    // Destructuring Response: Get specific values from the signup service.
    const { error: authError, needsConfirmation } = await signUp(email, password);

    if (authError) {
      setError(authError.message);
    } else if (needsConfirmation) {
      // User Feedback: Clear success message for email verification.
      setSuccessMessage("Registration successful! Please check your email for a verification link.");
      // Clear form fields on successful submission.
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      // Fallback for cases where no confirmation is needed (less common with default Supabase settings).
      setSuccessMessage("Registration successful! You are now logged in.");
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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