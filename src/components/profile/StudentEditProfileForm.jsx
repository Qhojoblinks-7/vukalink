// StudentEditProfileForm.jsx
import React from 'react';

const StudentEditProfileForm = ({ student, onSave }) => (
  <form className="space-y-4 max-w-xl mx-auto">
    {/* Add student profile fields here */}
    <input type="text" defaultValue={student?.fullName} placeholder="Full Name" className="w-full border rounded px-3 py-2" />
    <input type="email" defaultValue={student?.email} placeholder="Email" className="w-full border rounded px-3 py-2" />
    <textarea defaultValue={student?.bio} placeholder="Bio" className="w-full border rounded px-3 py-2" />
    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Save</button>
  </form>
);

export default StudentEditProfileForm;
