// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { signIn } from '../../services/auth';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = () => {
  // State Management: Using useState for form inputs and loading/error states.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Event Handler: `handleSubmit` for form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setError('');       // Clear previous errors
    setLoading(true);   // Show loading state

    // API Call: Calling the service function to handle authentication logic.
    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message); // Set error message if API call fails
    } else {
      // Success: Clear form fields.
      // Best Practice: AuthContext listener handles global state and navigation.
      setEmail('');
      setPassword('');
      console.log("Login successful! AuthContext will handle redirect.");
    }
    setLoading(false); // Hide loading state
  };

  return (
    // Semantic HTML: Using <form> element.
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input Components: Reusing the `Input` component for consistent styling and accessibility. */}
      {/* Props: Passing necessary props like `id`, `label`, `type`, `value`, `onChange`, `required`, `error`. */}
      <Input
        id="login-email" // Unique ID for accessibility
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required // HTML5 validation
        error={error && error.includes('email') ? error : ''} // Conditional error display
      />
      <Input
        id="login-password" // Unique ID
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={error && error.includes('password') ? error : ''} // Conditional error display
      />

      {/* General Error Message: Display if error doesn't pertain to specific input fields. */}
      {error && !error.includes('email') && !error.includes('password') && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}

      {/* Button Component: Reusing `Button`, handling loading and disabled states. */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging In...' : 'Log In'}
      </Button>
    </form>
  );
};

export default LoginForm;