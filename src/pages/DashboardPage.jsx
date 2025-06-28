// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../services/auth';
import Button from '../components/ui/Button';

const DashboardPage = () => {
  // Access user and session from the authentication context.
  // Best Practice: Centralized auth state via useAuth hook.
  const { user, session } = useAuth();

  // Handle user logout.
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Logout error:', error.message);
      // Best Practice: Provide user feedback (e.g., toast notification)
      alert('Failed to log out: ' + error.message);
    } else {
      console.log('User logged out successfully');
      // AuthContext's listener in App.jsx will automatically handle redirection.
    }
  };

  // Guard clause: Though PrivateRoute in App.jsx handles unauthenticated users,
  // this provides a robust check if DashboardPage is ever accessed directly without authentication context.
  if (!user) {
    return (
      <div className="text-center text-vuka-danger mt-10">
        You are not logged in. Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vuka-background text-vuka-text p-8 flex flex-col items-center">
      {/* Welcome Section */}
      <section className="text-center mb-10 w-full max-w-2xl">
        <h1 className="text-4xl font-heading font-extrabold text-vuka-blue mb-4">
          Welcome, {user.email || 'VukaLink User'}!
        </h1>
        <p className="text-xl text-vuka-dark-grey">
          Your hub for connecting with opportunities.
        </p>
      </section>

      {/* Key Metrics / Quick Info Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
        {/* Card 1: Recent Opportunities Placeholder */}
        <div className="bg-vuka-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-heading text-vuka-strong mb-3">Recent Opportunities</h2>
          <p className="text-vuka-medium-grey">
            Check out the latest job and internship postings.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => alert('View Opportunities!')}>
            View All
          </Button>
        </div>

        {/* Card 2: Profile Completion Placeholder */}
        <div className="bg-vuka-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-heading text-vuka-strong mb-3">Complete Your Profile</h2>
          <p className="text-vuka-medium-grey">
            Enhance your profile to attract more matches.
          </p>
          <Button variant="primary" size="sm" className="mt-4" onClick={() => alert('Go to Profile!')}>
            Edit Profile
          </Button>
        </div>

        {/* Card 3: New Connections Placeholder */}
        <div className="bg-vuka-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-heading text-vuka-strong mb-3">Your Network</h2>
          <p className="text-vuka-medium-grey">
            See who's viewed your profile and new connections.
          </p>
          <Button variant="ghost" size="sm" className="mt-4" onClick={() => alert('Explore Network!')}>
            My Network
          </Button>
        </div>
      </section>

      {/* Debugging / Session Info (Optional, remove in production) */}
      <section className="bg-vuka-white rounded-lg shadow-md p-6 w-full max-w-lg mb-8">
        <h2 className="text-2xl font-heading text-vuka-blue mb-4">Your Session Info (Dev Only):</h2>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-60">
          {/* Best Practice: Use JSON.stringify with null, 2 for readable output */}
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </section>

      {/* Logout Button */}
      <Button onClick={handleSignOut} variant="danger" size="lg" className="mt-8">
        Log Out
      </Button>
    </div>
  );
};

export default DashboardPage;