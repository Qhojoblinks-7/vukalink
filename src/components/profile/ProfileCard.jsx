// src/components/profile/ProfileCard.jsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import md5 from 'md5'; // Ensure you have installed this: npm install md5

// Helper to generate Gravatar URL
const getGravatarUrl = (email, size = 120, defaultImage = 'retro') => {
  if (!email) return `https://api.dicebear.com/7.x/initials/svg?seed=user`; // Fallback if no email
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
};

const ProfileCard = ({ user, profile, onSave, onUploadAvatar, loading }) => { // <-- Re-added onUploadAvatar prop
  // Internal state for form fields, initialized from 'profile' prop
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || ''); // <-- Re-added avatarUrl state

  // NEW STUDENT-SPECIFIC FIELDS
  const [university, setUniversity] = useState(profile?.university || '');
  const [major, setMajor] = useState(profile?.major || '');
  const [graduationYear, setGraduationYear] = useState(profile?.graduation_year || '');
  const [skills, setSkills] = useState(Array.isArray(profile?.skills) ? profile.skills.join(', ') : '');
  const [interests, setInterests] = useState(Array.isArray(profile?.interests) ? profile.interests.join(', ') : '');
  const [academicStatus, setAcademicStatus] = useState(profile?.academic_status || 'Enrolled');
  const [resumeUrl, setResumeUrl] = useState(profile?.resume_url || '');

  // State to manage edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');

  // Update internal state when 'profile' prop changes (e.g., after fetching or saving)
  useEffect(() => {
    setFullName(profile?.full_name || '');
    setPhoneNumber(profile?.phone_number || '');
    setBio(profile?.bio || '');
    setAvatarUrl(profile?.avatar_url || ''); // <-- Re-initialise avatarUrl from prop

    // Update NEW STUDENT-SPECIFIC FIELDS
    setUniversity(profile?.university || '');
    setMajor(profile?.major || '');
    setGraduationYear(profile?.graduation_year || '');
    setSkills(Array.isArray(profile?.skills) ? profile.skills.join(', ') : '');
    setInterests(Array.isArray(profile?.interests) ? profile.interests.join(', ') : '');
    setAcademicStatus(profile?.academic_status || 'Enrolled');
    setResumeUrl(profile?.resume_url || '');

    // Reset edit mode and error when profile prop changes (e.g., after successful save)
    setIsEditing(false);
    setFormError('');
  }, [profile]);

  const handleSave = () => {
    setFormError('');
    if (!fullName || !phoneNumber || !university || !major || !graduationYear || !academicStatus) {
      setFormError('Full Name, Phone Number, University, Major, Graduation Year, and Academic Status are required.');
      return;
    }

    const parsedSkills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const parsedInterests = interests.split(',').map(i => i.trim()).filter(i => i.length > 0);

    const updatedProfile = {
      full_name: fullName,
      phone_number: phoneNumber,
      bio: bio,
      avatar_url: avatarUrl, // <-- Include avatarUrl in the payload for saving
      
      university: university,
      major: major,
      graduation_year: parseInt(graduationYear, 10),
      skills: parsedSkills,
      interests: parsedInterests,
      academic_status: academicStatus,
      resume_url: resumeUrl
    };
    onSave(updatedProfile); // Call the prop function to save
  };

  const handleAvatarChange = async (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setFormError('Please select an image to upload.');
      return;
    }
    const file = event.target.files[0];
    setFormError(''); // Clear previous error

    if (onUploadAvatar) { // Check if onUploadAvatar prop is provided
      const { data: newAvatarUrl, error } = await onUploadAvatar(file);
      if (error) {
        setFormError('Failed to upload avatar: ' + error.message);
      } else if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl); // Update local state with new avatar URL
        // Immediately save the profile with the new avatar URL
        // This is important because the avatar URL needs to be persisted to the DB
        handleSave(); // Trigger a save of the entire profile after avatar upload
      }
    } else {
      setFormError('Avatar upload function not provided.');
    }
  };

  // Determine the source for the avatar image: custom URL if available, else Gravatar
  const displayAvatarSrc = avatarUrl || getGravatarUrl(user?.email);

  return (
    <div className="bg-white  rounded-lg shadow-xl p-8 w-full max-w-lg">
      <div className="flex flex-col items-center mb-6">
        <img
          src={displayAvatarSrc} // <-- Use the conditional avatar source
          alt="Avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-900 -light mb-4"
        />
        {isEditing && ( // Only show upload input in edit mode
          <label className="cursor-pointer text-blue-900  hover:underline text-sm mb-4">
            Upload New Avatar
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={loading} />
          </label>
        )}
        <h2 className="text-2xl font-heading font-bold text-boldtext-center">{profile?.full_name || user?.email}</h2>
        <p className="text-grey-600 text-md">{user?.email}</p>
      </div>

      {formError && <p className="text-red-600 text-center mb-4">{formError}</p>}

      {!isEditing ? (
        // View Mode
        <div className="space-y-4">
          <ProfileDetail label="Phone Number" value={profile?.phone_number} />
          <ProfileDetail label="University" value={profile?.university} />
          <ProfileDetail label="Major" value={profile?.major} />
          <ProfileDetail label="Graduation Year" value={profile?.graduation_year} />
          <ProfileDetail label="Academic Status" value={profile?.academic_status} />
          <ProfileDetail label="Skills" value={Array.isArray(profile?.skills) && profile.skills.length > 0 ? profile.skills.join(', ') : null} />
          <ProfileDetail label="Interests" value={Array.isArray(profile?.interests) && profile.interests.length > 0 ? profile.interests.join(', ') : null} />
          <ProfileDetail label="Bio" value={profile?.bio} />
          {profile?.resume_url && (
            <div className="border-b border-gray-300 pb-4 last:border-b-0">
              <p className="text-sm text-grey-500">Resume:</p>
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-900  hover:underline">
                View Resume
              </a>
            </div>
          )}

          <Button onClick={() => setIsEditing(true)} className="w-full mt-6">
            Edit Profile
          </Button>
        </div>
      ) : (
        // Edit Mode
        <div className="space-y-4">
          <Input
            id="full-name"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            id="phone-number"
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            id="university"
            label="University"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            id="major"
            label="Major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            id="graduation-year"
            label="Graduation Year"
            type="number"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            id="academic-status"
            label="Academic Status"
            value={academicStatus}
            onChange={(e) => setAcademicStatus(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            id="skills"
            label="Skills (comma-separated)"
            type="textarea"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            disabled={loading}
            placeholder="e.g., React, Python, Communication"
          />
          <Input
            id="interests"
            label="Interests (comma-separated)"
            type="textarea"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            disabled={loading}
            placeholder="e.g., Fintech, AI/ML, Digital Marketing"
          />
          <Input
            id="bio"
            label="Bio"
            type="textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={loading}
          />

          <div className="flex space-x-4 mt-6">
            <Button onClick={handleSave} className="flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="ghost" onClick={() => {
              setIsEditing(false);
              setFormError(''); // Clear error on cancel
              // Reset local state to prop values on cancel
              setFullName(profile?.full_name || '');
              setPhoneNumber(profile?.phone_number || '');
              setBio(profile?.bio || '');
              setAvatarUrl(profile?.avatar_url || ''); // Reset avatarUrl on cancel
              setUniversity(profile?.university || '');
              setMajor(profile?.major || '');
              setGraduationYear(profile?.graduation_year || '');
              setSkills(Array.isArray(profile?.skills) ? profile.skills.join(', ') : '');
              setInterests(Array.isArray(profile?.interests) ? profile.interests.join(', ') : '');
              setAcademicStatus(profile?.academic_status || 'Enrolled');
              setResumeUrl(profile?.resume_url || '');
            }} className="flex-1" disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for consistent display of profile details
const ProfileDetail = ({ label, value }) => (
    <div className="border-b border-gray-300 pb-4 last:border-b-0">
    <p className="text-sm text-grey-500">{label}:</p>
    <p className="text-grey-600 -900 font-medium">{value || 'N/A'}</p>
  </div>
);

export default ProfileCard;