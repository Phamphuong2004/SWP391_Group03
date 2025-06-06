import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm dòng này
import "./Feedback.css";
import { sendFeedback } from "../FeedbackServices";

// Danh sách dịch vụ mẫu, bạn có thể lấy từ DashboardResults hoặc ADNTestingServices
const SERVICES = [
  "Xét nghiệm huyết thống cha-con",
  "Xét nghiệm huyết thống mẹ-con",
  "Xét nghiệm anh/chị/em ruột",
  "Xét nghiệm ông/bà - cháu",
  "Xét nghiệm song sinh",
  "Xét nghiệm ADN trước sinh",
  "Xét nghiệm phả hệ di truyền",
  "Xét nghiệm gen bệnh lý di truyền",
];

export default function Feedback() {
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Thêm state để điều khiển modal
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate(); // Thêm dòng này

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendFeedback({ name, email, service, message, phone });
    setShowSuccess(true); // Chỉ hiện modal, không cần setSubmitted
    // Optionally reset form fields:
    setService("");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Gửi phản hồi về dịch vụ xét nghiệm ADN</h2>
      {submitted ? (
        <></>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="feedback-label">Dịch vụ đã sử dụng</label>
            <select
              className="feedback-input"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              <option value="">Chọn dịch vụ</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="feedback-label">Họ và tên</label>
            <input
              type="text"
              className="feedback-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="feedback-label">Email</label>
            <input
              type="email"
              className="feedback-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="feedback-label">Số điện thoại</label>
            <input
              type="tel"
              className="feedback-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9]{10,15}"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="mb-3">
            <label className="feedback-label">Nội dung phản hồi</label>
            <textarea
              className="feedback-textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="feedback-btn">
            Gửi phản hồi
          </button>
        </form>
      )}

      {/* Modal thông báo thành công */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-icon" style={{ color: "#2196f3" }}>
              ✅
            </span>
            <p style={{ color: "#2196f3" }}>
              Gửi phản hồi thành công!
              <br />
              Cảm ơn bạn đã đóng góp ý kiến.
            </p>
            <button
              className="modal-btn confirm"
              style={{ background: "#2196f3", marginTop: 16 }}
              onClick={() => {
                setShowSuccess(false);
                navigate("/"); // Chuyển về trang chủ
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
