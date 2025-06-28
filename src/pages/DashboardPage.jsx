// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { signOut } from '../services/auth'; // Import signOut
import Button from '../components/ui/Button'; // Import Button

const DashboardPage = () => {
  const { user, session } = useAuth(); // Get user and session from context

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Logout error:', error.message);
      alert('Failed to log out: ' + error.message); // Simple alert for demo
    } else {
      console.log('User logged out successfully');
      // AuthContext will automatically update and redirect.
    }
  };

  if (!user) {
    // This case should be handled by App.jsx, but good for robust check
    return <div className="text-center text-vuka-danger mt-10">You are not logged in.</div>;
  }

  return (
    <div className="min-h-screen bg-vuka-background text-vuka-text p-8 flex flex-col items-center">
      <h1 className="text-4xl font-heading font-extrabold text-vuka-blue mb-6">
        Welcome to Your VukaLink Dashboard, {user.email}!
      </h1>
      <p className="text-lg text-vuka-dark-grey mb-8">
        This is where you'll find your opportunities and connections.
      </p>

      <div className="bg-vuka-white rounded-lg shadow-md p-6 w-full max-w-lg mb-8">
        <h2 className="text-2xl font-heading text-vuka-blue mb-4">Your Session Info:</h2>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-60">
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </div>

      <Button onClick={handleSignOut} variant="danger" size="lg">
        Log Out
      </Button>
    </div>
  );
};

export default DashboardPage;