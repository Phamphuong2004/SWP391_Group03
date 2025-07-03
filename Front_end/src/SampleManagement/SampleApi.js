import axios from "axios";

// Lấy sample theo sampleId
export const getSampleById = async (sampleId, token) => {
  const res = await axios.get(`/api/collected-sample/get/${sampleId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Lấy sample theo appointmentId
export const getSampleByAppointmentId = async (appointmentId, token) => {
  const res = await axios.get(
    `/api/collected-sample/get/sample-appointment/${appointmentId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// Lấy sample theo appointmentId và participant
export const getSampleByAppointmentAndParticipant = async (
  appointmentId,
  token
) => {
  const res = await axios.get(
    `/api/collected-sample/get/sample-appointment/${appointmentId}/participant`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// Tạo sample mới (theo appointmentId)
export const createSampleByAppointmentId = async (
  appointmentId,
  sampleData,
  token
) => {
  const res = await axios.post(
    `/api/collected-sample/create/${appointmentId}`,
    sampleData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// Cập nhật sample
export const updateSample = async (sampleId, sampleData, token) => {
  const res = await axios.put(
    `/api/collected-sample/update/${sampleId}`,
    sampleData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// Xóa sample
export const deleteSample = async (sampleId, token) => {
  const res = await axios.delete(`/api/collected-sample/${sampleId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Cập nhật sample theo appointmentId (API còn thiếu)
export const updateSampleByAppointmentId = async (
  appointmentId,
  sampleData,
  token
) => {
  const res = await axios.post(
    `/api/collected-sample/update/${appointmentId}`,
    sampleData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// Tạo sample mới cho staff theo appointmentId (API còn thiếu)
export const createSampleForStaffByAppointmentId = async (
  appointmentId,
  sampleData,
  token
) => {
  const res = await axios.post(
    `/api/collected-sample/create/staff/${appointmentId}`,
    sampleData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};
