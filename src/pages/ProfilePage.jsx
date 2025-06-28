// ProfilePage.jsx

import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProfileCard from '../components/profile/ProfileCard';

const ProfilePage = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 flex items-center justify-center">
      <ProfileCard user={null} />
    </main>
    <Footer />
  </div>
);

export default ProfilePage;
