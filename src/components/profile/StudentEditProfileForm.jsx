// src/components/profile/StudentEditProfileForm.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import ProfileSection from '../shared/ProfileSection'; // Reusable section component
import {
  UserCircleIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  LinkIcon,
  ShieldCheckIcon,
  KeyIcon,
  BellIcon,
  Cog6ToothIcon,
  TrashIcon
} from '@heroicons/react/24/outline'; // Icons for sections

const StudentEditProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    gender: '', // Assuming gender is part of student profile
    bio: '',
    academicInfo: {
      university: '',
      program: '',
      graduationYear: '',
    },
    skillsInterests: {
      skills: [],
      interests: [],
    },
    resumeCV: {
      fileName: '',
      url: '',
    },
    portfolioProjectLinks: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        gender: user.gender || '',
        bio: user.bio || '',
        academicInfo: user.academicInfo || {
          university: '',
          program: '',
          graduationYear: '',
        },
        skillsInterests: user.skillsInterests || {
          skills: [],
          interests: [],
        },
        resumeCV: user.resumeCV || {
          fileName: '',
          url: '',
        },
        portfolioProjectLinks: user.portfolioProjectLinks || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAcademicInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        [name]: value,
      },
    }));
  };

  const handleArrayChange = (e, fieldName, type) => {
    const value = e.target.value;
    // Simple comma-separated list for now, convert to array
    const newArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({
      ...prev,
      skillsInterests: {
        ...prev.skillsInterests,
        [fieldName]: newArray,
      },
    }));
  };

  const handleResumeCVChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resumeCV: {
          fileName: file.name,
          url: URL.createObjectURL(file), // For local preview, would upload to backend in real app
        },
      }));
    }
  };

  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      portfolioProjectLinks: [...prev.portfolioProjectLinks, { name: '', url: '' }],
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.portfolioProjectLinks];
    newLinks[index][field] = value;
    setFormData(prev => ({
      ...prev,
      portfolioProjectLinks: newLinks,
    }));
  };

  const handleRemoveLink = (index) => {
    const newLinks = formData.portfolioProjectLinks.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      portfolioProjectLinks: newLinks,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <img
          src={user.profileImage || '/images/default-avatar.png'} // Placeholder for user profile image
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 shadow-md"
        />
        <h2 className="text-xl font-semibold mt-3 text-grey-600 -900 dark:text-grey-600  ">{user.name || `${formData.firstName} ${formData.lastName}`}</h2>
        <p className="text-sm text-grey-600 -600 0 dark:text-grey-600  -400">{user.academicInfo?.university || 'University of Innovation'}</p>
        <Button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm">
          Change Profile Photo
        </Button>
      </div>

      <ProfileSection title="Profile Details" icon={<UserCircleIcon className="h-5 w-5 mr-2 text-blue-600" />}> 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">First Name</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Last Name</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" readOnly /> {/* Email usually read-only */}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Gender</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="bio" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Bio</label>
          <textarea id="bio" name="bio" rows="3" value={formData.bio} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
      </ProfileSection>

      <ProfileSection title="Academic Information" icon={<AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />}> 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="university" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">University</label>
            <input type="text" id="university" name="university" value={formData.academicInfo.university} onChange={handleAcademicInfoChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Program</label>
            <input type="text" id="program" name="program" value={formData.academicInfo.program} onChange={handleAcademicInfoChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="graduationYear" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Graduation Year</label>
            <input type="number" id="graduationYear" name="graduationYear" value={formData.academicInfo.graduationYear} onChange={handleAcademicInfoChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Skills & Interests" icon={<BriefcaseIcon className="h-5 w-5 mr-2 text-blue-600" />}> 
        <div className="mb-4">
          <label htmlFor="skills" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Skills (comma-separated)</label>
          <input type="text" id="skills" name="skills" value={formData.skillsInterests.skills.join(', ')} onChange={(e) => handleArrayChange(e, 'skills')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-grey-600 -600 0 dark:text-grey-600  -400">Interests (comma-separated)</label>
          <input type="text" id="interests" name="interests" value={formData.skillsInterests.interests.join(', ')} onChange={(e) => handleArrayChange(e, 'interests')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      </ProfileSection>

      <ProfileSection title="Resume / CV" icon={<BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />}> 
        <div className="flex items-center space-x-4">
          <input type="file" id="resumeCV" name="resumeCV" onChange={handleResumeCVChange} className="block w-full text-sm text-grey-600 -600 0 dark:text-grey-600   file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200" />
          {formData.resumeCV.fileName && (
            <a href={formData.resumeCV.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {formData.resumeCV.fileName}
            </a>
          )}
        </div>
      </ProfileSection>

      <ProfileSection title="Portfolio / Project Links" icon={<LinkIcon className="h-5 w-5 mr-2 text-blue-600" />}> 
        {formData.portfolioProjectLinks.map((link, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              placeholder="Project Name"
              value={link.name}
              onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
              className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
            />
            <input
              type="url"
              placeholder="URL"
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
              className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
            />
            <Button type="button" onClick={() => handleRemoveLink(index)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md">
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={handleAddLink} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-2">
          Add Link
        </Button>
      </ProfileSection>

      {/* Account Settings sections (read-only for general info, but can link to dedicated pages) */}
      <ProfileSection title="Verification Status" icon={<ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-600" />}> 
        <p className="text-sm text-grey-600 -600 0 dark:text-grey-600  -400">Status: <span className="font-semibold text-green-600">Verified</span> (Simulated)</p>
        <p className="text-xs text-grey-600 -600 0 dark:text-grey-600   mt-1">
          Verification helps build trust with employers.
        </p>
      </ProfileSection>

      <ProfileSection title="Account Settings" icon={<Cog6ToothIcon className="h-5 w-5 mr-2 text-blue-600" />}> 
        <ul className="space-y-2">
          <li>
            <a href="/account-settings/password" className="text-blue-600 hover:underline flex items-center">
              <KeyIcon className="h-5 w-5 mr-2" /> Password
            </a>
          </li>
          <li>
            <a href="/account-settings/notifications" className="text-blue-600 hover:underline flex items-center">
              <BellIcon className="h-5 w-5 mr-2" /> Notifications
            </a>
          </li>
          <li>
            <a href="/account-settings/privacy" className="text-blue-600 hover:underline flex items-center">
              <UserCircleIcon className="h-5 w-5 mr-2" /> Privacy
            </a>
          </li>
        </ul>
        <div className="mt-4 border-t pt-4 border-red-200">
          <Button type="button" className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center">
            <TrashIcon className="h-5 w-5 mr-2" /> Delete Account
          </Button>
          <p className="text-xs text-red-500 mt-1">This action is irreversible. Proceed with caution.</p>
        </div>
      </ProfileSection>


      <div className="mt-8 text-right">
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg text-lg font-semibold">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default StudentEditProfileForm;