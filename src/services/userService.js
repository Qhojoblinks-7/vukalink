// src/services/userService.js
import api from './api';

const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}/profile`);
  return response.data;
};

const updateProfile = async (userId, profileData) => {
  const response = await api.put(`/users/${userId}/profile`, profileData);
  return response.data;
};

// Add functions for messages, applications, etc., if they are user-centric
const getUserApplications = async (userId) => {
  const response = await api.get(`/users/${userId}/applications`);
  return response.data;
};

const userService = {
  getUserProfile,
  updateProfile,
  getUserApplications,
};

export default userService;