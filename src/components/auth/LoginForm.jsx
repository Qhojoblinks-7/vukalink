// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { signIn } from '../../services/auth'; // Import sign-in function
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext'; // To potentially update context or just for info

const LoginForm = () => {
  const { user } = useAuth(); // Use auth context for current user status (optional)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
    } else {
      // Success is handled by onAuthStateChange in AuthContext,
      // which will redirect the user via AuthPage logic.
      setEmail('');
      setPassword('');
      console.log("Login successful! AuthContext will handle redirect.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={error && error.includes('email') ? error : ''}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={error && error.includes('password') ? error : ''}
      />

      {error && !error.includes('email') && !error.includes('password') && (
        <p className="text-vuka-danger text-sm text-center">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging In...' : 'Log In'}
      </Button>
      {/* Optional: Add Forgot Password link */}
      {/* <p className="text-center text-sm mt-4">
        <a href="#" className="text-vuka-blue hover:underline">Forgot Password?</a>
      </p> */}
    </form>
  );
};

export default LoginForm;