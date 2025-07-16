import axios from "axios";

// Lấy sample theo sampleId (endpoint mới)
export const getSampleById = async (sampleId, token) => {
  const res = await axios.get(`/api/collected-sample/get/sample/${sampleId}`, {
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
  // Loại bỏ sampleId nếu có trong sampleData
  const { sampleId: _removed, ...dataWithoutSampleId } = sampleData;
  const res = await axios.put(
    `/api/collected-sample/update/${sampleId}`,
    dataWithoutSampleId,
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

// Cập nhật sample theo appointmentId (POST)
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

// Tạo sample mới cho staff theo appointmentId (POST)
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

// Lấy danh sách participants theo appointmentId (GET)
export const getParticipantsByAppointmentId = async (appointmentId, token) => {
  const res = await axios.get(
    `/api/collected-sample/appointments/${appointmentId}/participants`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// --- SAMPLE TYPE API ---
// Lấy tất cả loại mẫu
export const getAllSampleTypes = async (token) => {
  const res = await axios.get("/api/sample-types/all", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Lấy loại mẫu theo tên bộ kit
export const getSampleTypesByComponentName = async (componentName, token) => {
  const res = await axios.get(
    `/api/sample-types/get-by-component-name/${encodeURIComponent(
      componentName
    )}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// Tạo mới loại mẫu
export const createSampleType = async (sampleType, token) => {
  const res = await axios.post("/api/sample-types/create", sampleType, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Cập nhật loại mẫu
export const updateSampleType = async (id, sampleType, token) => {
  const res = await axios.post(`/api/sample-types/update/${id}`, sampleType, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Xóa loại mẫu theo id
export const deleteSampleType = async (id, token) => {
  const res = await axios.delete(`/api/sample-types/delete/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// --- SAMPLE TYPE CONTROLLER API BỔ SUNG ---
// Lấy loại mẫu theo tên (GET)
export const getSampleTypeByName = async (name, token) => {
  const res = await axios.get(
    `/api/sample-types/get-by-name/${encodeURIComponent(name)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// Lấy loại mẫu theo id (GET)
export const getSampleTypeById = async (id, token) => {
  const res = await axios.get(`/api/sample-types/get-by-id/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Xóa loại mẫu theo tên (DELETE)
export const deleteSampleTypeByName = async (name, token) => {
  const res = await axios.delete(
    `/api/sample-types/delete-by-name/${encodeURIComponent(name)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};
