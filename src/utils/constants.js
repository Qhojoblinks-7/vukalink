// src/utils/constants.js

export const APP_NAME = "Vuka Careers";
export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5173/api';

export const USER_ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  ADMIN: 'admin',
};

export const OPPORTUNITY_TYPES = [
  { value: 'Internship', label: 'Internship' },
  { value: 'Job', label: 'Job' },
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Scholarship', label: 'Scholarship' },
];

export const DURATION_OPTIONS = [
  { value: '1 month', label: '1 month' },
  { value: '2 months', label: '2 months' },
  { value: '3 months', label: '3 months' },
  { value: '4 months', label: '4 months' },
  { value: '5 months', label: '5 months' },
  { value: '6 months', label: '6 months' },
  { value: '7-12 months', label: '7-12 months' },
  { value: '1+ year', label: '1+ year' },
  { value: 'Flexible', label: 'Flexible' },
];

export const STIPEND_OPTIONS = [
  { value: 'Paid', label: 'Paid' },
  { value: 'Unpaid', label: 'Unpaid' },
  { value: 'Stipend', label: 'Stipend' },
];

export const ARTICLE_CATEGORIES = [
  { value: 'All Articles', label: 'All Articles' },
  { value: 'Resume Tips', label: 'Resume Tips' },
  { value: 'Interview Prep', label: 'Interview Prep' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Career Growth', label: 'Career Growth' },
];

export const SORT_OPTIONS = [
  { value: 'Newest', label: 'Newest' },
  { value: 'Oldest', label: 'Oldest' },
  { value: 'Alphabetical', label: 'Alphabetical (A-Z)' },
];

// *****************************************************************
// ADD THIS SECTION TO YOUR src/utils/constants.js FILE
// *****************************************************************
export const DUMMY_ARTICLES = [
  {
    id: '1',
    title: 'Crafting a CV that Gets Noticed',
    description: 'Learn the secrets to building a resume that stands out to employers.',
    imageUrl: 'https://via.placeholder.com/400x250/F0F4F8/6B7280?text=CV+Tips',
    category: 'Resume Tips',
    author: 'Vuka Team',
    date: '2024-05-10T10:00:00Z',
    content: 'Longer content for CV tips goes here...'
  },
  {
    id: '2',
    title: 'Ace Your Internship Interview',
    description: 'Practical tips to shine in your next internship interview.',
    imageUrl: 'https://via.placeholder.com/400x250/E2E8F0/4B5563?text=Interview+Tips',
    category: 'Interview Prep',
    author: 'Career Coach',
    date: '2024-04-22T12:30:00Z',
    content: 'Detailed guide on interview preparation, common questions, and how to answer them.'
  },
  {
    id: '3',
    title: 'Networking for Introverts',
    description: 'Strategies to build your professional network, even if you\'re shy.',
    imageUrl: 'https://via.placeholder.com/400x250/F8FAFC/A0AEC0?text=Networking',
    category: 'Networking',
    author: 'Networking Guru',
    date: '2024-03-15T09:00:00Z',
    content: 'Tips for effective networking without feeling overwhelmed.'
  },
  {
    id: '4',
    title: 'First Steps to Career Success',
    description: 'Essential advice for students starting their career journey.',
    imageUrl: 'https://via.placeholder.com/400x250/F0F8FF/9CA3AF?text=Career+Success',
    category: 'Career Growth',
    author: 'Vuka Team',
    date: '2024-06-01T14:00:00Z',
    content: 'Guidance on setting goals, continuous learning, and adapting to the workplace.'
  },
  {
    id: '5',
    title: 'Building a Strong Online Presence',
    description: 'How to optimize your LinkedIn and professional profiles.',
    imageUrl: 'https://via.placeholder.com/400x250/F7FAFC/D1D5DB?text=Online+Presence',
    category: 'Networking',
    author: 'Digital Expert',
    date: '2024-05-20T11:45:00Z',
    content: 'Detailed steps to create a compelling online professional presence.'
  },
];
// *****************************************************************
// END OF SECTION TO ADD
// *****************************************************************

// Add more constants as your application grows