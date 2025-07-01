// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { signUp } from '../../services/auth'; // Ensure this path is correct
import Input from '../ui/Input'; // Ensure this path is correct
import Button from '../ui/Button'; // Ensure this path is correct
import logo from '../../assets/logo.svg'; // Ensure this path is correct
import { useAuth } from '../../hooks/useAuth'; // Ensure this path is correct

// RegisterForm now accepts a prop 'onToggleForm' from its parent (AuthPage)
const RegisterForm = ({ onToggleForm }) => {
  const { signInWithGoogle } = useAuth();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showManualRegisterFields, setShowManualRegisterFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setServerError('');
    try {
      if (signInWithGoogle) {
        await signInWithGoogle();
        // The useAuth hook or firebase listener should handle navigation on success
        console.log("Google sign-up initiated. AuthContext will handle redirect.");
      } else {
        setServerError("Google sign-up not configured.");
        console.error("signInWithGoogle function is not available.");
      }
    } catch (authError) {
      setServerError(authError.message || "Failed to sign up with Google.");
      console.error("Google sign-up error:", authError);
    } finally {
      setLoading(false);
    }
  };

  return (
    // This div now defines the white card with the side-by-side layout.
    // The outer min-h-screen bg-blue-950 container is removed, as AuthPage provides it.
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center">

      {/* Left Column: Branding and Google Sign-up */}
      <div className="flex flex-col items-center justify-center text-center p-4 md:p-8 md:w-1/2 space-y-4">
        <img src={logo} alt="VukaLink Logo" className="h-16 w-auto" />
        <h1 className="font-heading text-blue-900 text-4xl font-bold">VukaLink</h1>
        <h2 className="font-heading text-gray-800 text-2xl font-semibold mt-4">Join VukaLink Today!</h2>
        <p className="font-body text-gray-600 text-lg">Start your journey with us</p>

        {/* Sign up with Google Button */}
        <Button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-3 border border-gray-300 bg-white text-gray-700 py-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors mt-8"
          disabled={loading}
        >
          {/* Google Icon SVG */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.24 10.232v2.448h6.12c-.256 1.488-1.544 3.096-3.72 3.096-2.928 0-5.32-2.392-5.32-5.32s2.392-5.32 5.32-5.32c1.608 0 2.92 0.696 3.72 1.488l2.096-2.08c-1.28-1.192-2.936-2.128-5.816-2.128-4.712 0-8.528 3.816-8.528 8.528s3.816 8.528 8.528 8.528c5.448 0 8.016-3.736 8.016-8.224 0-.544-.04-1.088-.12-1.616h-7.896z" fill="#4285F4"/>
            <path d="M11.999 21.008c2.616 0 4.888-1.12 6.512-2.96l-2.096-2.08c-1.024 1.152-2.392 1.984-4.416 1.984-2.88 0-5.28-2.392-5.32-5.32s2.4-5.32 5.28-5.32c1.728 0 3.104 0.64 4.096 1.584l2.04-2.08c-1.352-1.296-3.216-2.128-6.136-2.128-4.72 0-8.536 3.808-8.536 8.528s3.816 8.528 8.536 8.528z" fill="#34A853"/>
            <path d="M22.016 10.232v2.448h-6.12c-.256 1.488-1.544 3.096-3.72 3.096-2.928 0-5.32-2.392-5.32-5.32s2.392-5.32 5.32-5.32c1.608 0 2.92 0.696 3.72 1.488l2.096-2.08c-1.28-1.192-2.936-2.128-5.816-2.128-4.712 0-8.528 3.816-8.528 8.528s3.816 8.528 8.528 8.528c5.448 0 8.016-3.736 8.016-8.224 0-.544-.04-1.088-.12-1.616h-7.896z" fill="#FBBC05"/>
            <path d="M11.999 21.008c2.616 0 4.888-1.12 6.512-2.96l-2.096-2.08c-1.024 1.152-2.392 1.984-4.416 1.984-2.88 0-5.28-2.392-5.32-5.32s2.4-5.32 5.28-5.32c1.728 0 3.104 0.64 4.096 1.584l2.04-2.08c-1.352-1.296-3.216-2.128-6.136-2.128-4.72 0-8.536 3.808-8.536 8.528s3.816 8.528 8.536 8.528z" fill="#EA4335"/>
          </svg>
          <span>Sign up with Google</span>
        </Button>
      </div>

      {/* Right Column: Manual Registration Form */}
      <div className="flex flex-col p-4 md:p-8 md:w-1/2">
        {/* "or sign up manually" Separator - acts as a trigger on mobile */}
        <div
          className="flex items-center my-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowManualRegisterFields(!showManualRegisterFields)}
        >
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-3 text-gray-500 text-sm font-body flex items-center">
            or sign up manually
            {/* Arrow icon: visible on mobile, hidden on md+ */}
            <svg
              className={`ml-2 h-4 w-4 text-gray-500 transition-transform md:hidden ${showManualRegisterFields ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Manual Registration Form section - hidden on mobile by default, shown on click, always shown on md+ */}
        <div className={`${showManualRegisterFields ? 'block' : 'hidden'} md:block`}>
          {/* Formik Wrapper for Registration */}
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              setLoading(true);
              setServerError('');

              const { error: authError } = await signUp(values.name, values.email, values.password);

              if (authError) {
                setServerError(authError.message);
                // setErrors({ general: authError.message }); // Optionally set field-specific errors if appropriate
              } else {
                console.log("Registration successful! AuthContext will handle redirect.");
                // AuthContext's useEffect will handle navigation to /dashboard
              }
              setLoading(false);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched, getFieldProps }) => (
              <Form className="space-y-4">
                {/* Name Input */}
                <Input
                  id="register-name"
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  {...getFieldProps('name')}
                  error={touched.name && errors.name ? errors.name : ''}
                />

                {/* Email Input */}
                <Input
                  id="register-email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  {...getFieldProps('email')}
                  error={touched.email && errors.email ? errors.email : ''}
                />

                {/* Password Input with Toggle */}
                <div className="relative">
                  <Input
                    id="register-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create your password"
                    {...getFieldProps('password')}
                    error={touched.password && errors.password ? errors.password : ''}
                    className="pr-10" // Add padding to make space for the eye icon
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      // Eye-slash icon (hide password)
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.672-1.547A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-5.672 1.547l-1.405-1.405m-1.405-1.405L12 12m-1.405-1.405l-1.405-1.405m-1.405-1.405l-1.405-1.405m-1.405-1.405l-1.405-1.405M12 12l-1.405 1.405M12 12l1.405-1.405m-1.405 1.405l-1.405 1.405" /></svg>
                    ) : (
                      // Eye icon (show password)
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>

                {/* Confirm Password Input with Toggle */}
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...getFieldProps('confirmPassword')}
                    error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}
                    className="pr-10" // Add padding to make space for the eye icon
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? (
                      // Eye-slash icon (hide password)
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.672-1.547A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-5.672 1.547l-1.405-1.405m-1.405-1.405L12 12m-1.405-1.405l-1.405-1.405m-1.405-1.405l-1.405-1.405m-1.405-1.405l-1.405-1.405M12 12l-1.405 1.405M12 12l1.405-1.405m-1.405 1.405l-1.405 1.405" /></svg>
                    ) : (
                      // Eye icon (show password)
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>

                {/* General Server Error Message */}
                {serverError && (
                  <p className="text-red-600 text-sm text-center">{serverError}</p>
                )}

                {/* Sign Up Button (Orange Gradient) */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || loading}
                >
                  {(isSubmitting || loading) ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md flex items-start space-x-2 text-sm font-body mt-4">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            <p>
              For the best experience, we recommend signing up with your Google account for seamless access and security.
            </p>
          </div>

          {/* Footer Links - Changed Link to Button onClick for parent AuthPage switching */}
          <div className="text-center space-y-3 font-body text-sm mt-6">
            <a href="/trouble-signing-in" className="text-blue-600 hover:underline">
              Trouble signing in?
            </a>
            <p className="text-gray-600">
              Already have an account?{' '}
              {/* This Button now triggers the onToggleForm prop */}
              <Button variant="ghost" size="sm" onClick={onToggleForm} className="font-bold">
                Log In
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;