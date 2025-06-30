import axios from "axios";

/**
 * Lưu feedback vào localStorage (giả lập backend)
 * @param {Object} feedback
 * @param {string} feedback.name - Họ và tên khách hàng
 * @param {string} feedback.email - Email khách hàng
 * @param {string} feedback.service - Dịch vụ khách hàng chọn
 * @param {string} feedback.message - Nội dung phản hồi
 * @param {string} [feedback.phone] - Số điện thoại (nếu có)
 */
export function sendFeedback({ name, email, service, message, phone }) {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
  feedbacks.push({
    name,
    email,
    service,
    message,
    phone,
    date: new Date().toISOString(),
  });
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  return Promise.resolve({ success: true });
}

/**
 * Lấy danh sách feedback đã lưu
 */
export function getFeedbacks() {
  return JSON.parse(localStorage.getItem("feedbacks") || "[]");
}

export async function createFeedback(serviceId, content, rating) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.post(
    `/api/feedback/create/${serviceId}`,
    { content, rating },
    {
      headers: authHeader,
    }
  );
  return res.data;
}

export async function updateFeedback(feedbackId, content, rating) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.put(
    `/api/feedback/update/${feedbackId}`,
    { content, rating },
    {
      headers: authHeader,
    }
  );
  return res.data;
}

export async function deleteFeedback(feedbackId) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  await axios.delete(`/api/feedback/delete/${feedbackId}`, {
    headers: authHeader,
  });
  return true;
}

export async function getFeedbackByServiceName(serviceName) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.get(
    `/api/feedback/search/by-service-name/${serviceName}`,
    {
      headers: authHeader,
    }
  );
  return res.data;
}
