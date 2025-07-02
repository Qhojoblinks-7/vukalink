// src/services/resourceService.js
import api from './api';

const getResources = async (params) => {
  // Assuming your backend has an endpoint for resources/articles
  const response = await api.get('/resources', { params });
  return response.data;
};

const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

const resourceService = {
  getResources,
  getResourceById,
};

export default resourceService;