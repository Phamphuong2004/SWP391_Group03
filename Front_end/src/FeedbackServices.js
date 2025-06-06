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
