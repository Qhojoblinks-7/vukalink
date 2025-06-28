// ProfileCard.jsx
// User profile card component

import React from 'react';

const ProfileCard = ({ user }) => (
  <div className="bg-white shadow rounded p-4 flex flex-col items-center">
    <img src={user?.avatar || '/default-avatar.png'} alt="Avatar" className="w-20 h-20 rounded-full mb-2" />
    <div className="font-bold text-lg">{user?.name || 'User Name'}</div>
    <div className="text-gray-500">{user?.email || 'user@email.com'}</div>
    {/* Add more profile info here */}
  </div>
);

export default ProfileCard;
