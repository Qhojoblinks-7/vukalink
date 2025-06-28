// AuthForms.jsx
// Container for login/register forms

import React from 'react';
import LoginForm from '../../../components/auth/LoginForm';
import RegisterForm from '../../../components/auth/RegisterForm';

const AuthForms = () => (
  <div>
    {/* Toggle between <LoginForm /> and <RegisterForm /> as needed */}
    <LoginForm />
  </div>
);

export default AuthForms;
