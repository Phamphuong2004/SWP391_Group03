import axios from 'axios';

// PUT: Update feedback by ID
export const updateFeedback = async (feedbackId, data) => {
  return axios.put(`/api/feedback/update/${feedbackId}`, data);
};

// POST: Create feedback for a service
export const createFeedback = async (serviceId, data) => {
  return axios.post(`/api/feedback/create/${serviceId}`, data);
};

// GET: Get feedback by service name
export const getFeedbackByServiceName = async (serviceName) => {
  return axios.get(`/api/feedback/search/by-service-name/${serviceName}`);
};

// DELETE: Delete feedback by ID
export const deleteFeedback = async (feedbackId) => {
  return axios.delete(`/api/feedback/delete/${feedbackId}`);
};
