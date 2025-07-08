import axios from 'axios';

const API_BASE = '/api/reports';

export const getReportById = (report_id) =>
  axios.get(`${API_BASE}/${report_id}`);

export const updateReport = (report_id, data) =>
  axios.put(`${API_BASE}/${report_id}`, data);

export const deleteReport = (report_id) =>
  axios.delete(`${API_BASE}/${report_id}`);

export const createReport = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${API_BASE}/create`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getReportList = () =>
  axios.get(`${API_BASE}/getList`);

export const getReportListByUserName = (user_name) =>
  axios.get(`${API_BASE}/getListByUserName/${user_name}`); 