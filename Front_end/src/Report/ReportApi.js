import axios from 'axios';

const API_BASE = '/api/reports';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getReportById = (report_id) =>
  axios.get(`${API_BASE}/${report_id}`, { headers: getAuthHeader() });

export const updateReport = (report_id, data) =>
  axios.put(`${API_BASE}/${report_id}`, data, { headers: getAuthHeader() });

export const deleteReport = (report_id) =>
  axios.delete(`${API_BASE}/${report_id}`, { headers: getAuthHeader() });

export const createReport = (data) => {
  return axios.post(
    `${API_BASE}/create`,
    data,
    {
      headers: getAuthHeader(),
    }
  );
};

export const getReportList = () =>
  axios.get(`${API_BASE}/getList`, { headers: getAuthHeader() });

export const getReportListByUserName = (user_name) =>
  axios.get(`${API_BASE}/getListByUserName/${user_name}`, { headers: getAuthHeader() }); 