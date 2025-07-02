import axios from "axios";

// Lấy sample theo sampleId
export const getSampleById = async (sampleId, token) => {
  const res = await axios.get(`/api/sample/get/${sampleId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Lấy sample theo appointmentId
export const getSampleByAppointmentId = async (appointmentId, token) => {
  const res = await axios.get(
    `/api/sample/get/sample-appointment/${appointmentId}`,
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
    `/api/sample/get/sample-appointment/${appointmentId}/participant`,
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
    `/api/sample/create/${appointmentId}`,
    sampleData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// Cập nhật sample
export const updateSample = async (sampleId, sampleData, token) => {
  const res = await axios.put(`/api/sample/update/${sampleId}`, sampleData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Xóa sample
export const deleteSample = async (sampleId, token) => {
  const res = await axios.delete(`/api/sample/${sampleId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};
