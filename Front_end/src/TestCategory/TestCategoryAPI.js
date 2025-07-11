import axios from "axios";

const API_BASE = "/api/";

export const getTestCategoryById = (id) =>
  axios.get(`${API_BASE}test-category/get-by-id/${id}`);

export const getAllTestCategoriesByService = () =>
  axios.get(`${API_BASE}test-category/by-service/all`);

export const getActiveTestCategoriesByService = () =>
  axios.get(`${API_BASE}test-category/by-service/active`);

export const createTestCategory = (data) =>
  axios.post(`${API_BASE}test-category/create`, data);

export const updateTestCategory = (id, data) =>
  axios.put(`${API_BASE}test-category/update/${id}`, data);

export const deleteTestCategory = (id) =>
  axios.delete(`${API_BASE}test-category/delete/${id}`);
