// StudentEditProfileForm.jsx
import React, { useRef, useState } from 'react';
import { uploadFile, getPublicUrl } from '../../services/upload';

const StudentEditProfileForm = ({ student, onSave }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState(student?.cvUrl || '');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const filePath = `cvs/${student.id}/${file.name}`;
      await uploadFile('student-cvs', filePath, file);
      const url = getPublicUrl('student-cvs', filePath);
      setCvUrl(url);
      // Optionally, call onSave or update profile with new CV URL
    } catch (err) {
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="space-y-4 max-w-xl mx-auto">
      {/* Add student profile fields here */}
      <input type="text" defaultValue={student?.fullName} placeholder="Full Name" className="w-full border rounded px-3 py-2" />
      <input type="email" defaultValue={student?.email} placeholder="Email" className="w-full border rounded px-3 py-2" />
      <textarea defaultValue={student?.bio} placeholder="Bio" className="w-full border rounded px-3 py-2" />
      {/* CV Upload */}
      <div>
        <label className="block mb-1 font-medium">Upload CV</label>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="block" />
        {uploading && <span className="text-blue-600">Uploading...</span>}
        {cvUrl && <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 underline ml-2">View Uploaded CV</a>}
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Save</button>
    </form>
  );
};

export default StudentEditProfileForm;
