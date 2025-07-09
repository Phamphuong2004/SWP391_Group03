import React, { useState, useEffect } from "react";
import "./Feedback.css";
import {
  createFeedback,
  getFeedbackByServiceName,
  deleteFeedback,
  updateFeedback,
} from "../FeedbackServices";

// Danh sách dịch vụ mẫu có cả id và tên
const SERVICES = [
  { id: 1, name: "Xét nghiệm huyết thống cha-con" },
  { id: 2, name: "Xét nghiệm huyết thống mẹ-con" },
  { id: 3, name: "Xét nghiệm anh/chị/em ruột" },
  { id: 4, name: "Xét nghiệm ông/bà - cháu" },
  { id: 5, name: "Xét nghiệm song sinh" },
  { id: 6, name: "Xét nghiệm ADN trước sinh" },
  { id: 7, name: "Xét nghiệm phả hệ di truyền" },
  { id: 8, name: "Xét nghiệm gen bệnh lý di truyền" },
];

export default function Feedback() {
  const [serviceId, setServiceId] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  // Lấy user info từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.toLowerCase();
  const username = user?.username;

  // Debug: log ra console để kiểm tra giá trị thực tế
  console.log("[Feedback] user:", user, "role:", role);

  // Lấy feedback khi chọn dịch vụ (chỉ staff/manager mới được xem)
  useEffect(() => {
    if ((role === "manager" || role === "staff") && serviceId) {
      setLoading(true);
      const serviceName = SERVICES.find(
        (s) => s.id === Number(serviceId)
      )?.name;
      if (!serviceName) return;
      getFeedbackByServiceName(serviceName)
        .then((data) => setFeedbacks(Array.isArray(data) ? data : []))
        .finally(() => setLoading(false));
    } else {
      setFeedbacks([]);
    }
  }, [serviceId, showSuccess, role]);

  // Nếu không có user hoặc role thì hiển thị cảnh báo (đặt sau tất cả các hook)
  if (!user || !role) {
    return (
      <div className="feedback-container">
        <h2 className="feedback-title">Gửi phản hồi về dịch vụ xét nghiệm ADN</h2>
        <div style={{color: 'red', marginTop: 24, fontWeight: 'bold'}}>Bạn cần đăng nhập bằng tài khoản customer để gửi phản hồi.</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceId) return;
    await createFeedback(Number(serviceId), content, rating);
    setShowSuccess(true);
    setContent("");
    setRating(5);
  };

  // Sửa feedback
  const handleEdit = (fb) => {
    setEditingId(fb.feedbackId);
    setEditContent(fb.content);
    setEditRating(fb.rating || 5);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateFeedback(editingId, editContent, editRating);
    setEditingId(null);
    setEditContent("");
    setEditRating(5);
    setShowSuccess(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) {
      await deleteFeedback(id);
      setFeedbacks((prev) => prev.filter((f) => f.feedbackId !== id));
    }
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Gửi phản hồi về dịch vụ xét nghiệm ADN</h2>
      {/* Chỉ customer mới thấy form gửi feedback */}
      {role === "customer" && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="feedback-label">Dịch vụ đã sử dụng</label>
            <select
              className="feedback-input"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
            >
              <option value="">Chọn dịch vụ</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="feedback-label">Nội dung phản hồi</label>
            <textarea
              className="feedback-textarea"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="feedback-label">Đánh giá</label>
            <div style={{ fontSize: 32 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    cursor: "pointer",
                    color: star <= rating ? "#FFD700" : "#ccc",
                    transition: "color 0.2s"
                  }}
                  onClick={() => setRating(star)}
                  role="button"
                  aria-label={`Đánh giá ${star} sao`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <button type="submit" className="feedback-btn" disabled={loading}>
            Gửi phản hồi
          </button>
        </form>
      )}

      {/* Danh sách feedback chỉ staff/manager mới xem được */}
      {(role === "manager" || role === "staff") && (
        <div className="feedback-list">
          <div className="mb-3">
            <label className="feedback-label">Chọn dịch vụ để xem feedback</label>
            <select
              className="feedback-input"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
            >
              <option value="">Chọn dịch vụ</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {serviceId && (
            <>
              <h3>
                Phản hồi cho dịch vụ: {SERVICES.find((s) => s.id === Number(serviceId))?.name}
              </h3>
              {loading ? (
                <p>Đang tải...</p>
              ) : feedbacks.length === 0 ? (
                <p>Chưa có phản hồi nào.</p>
              ) : (
                <ul>
                  {feedbacks.map((fb) => (
                    <li key={fb.feedbackId} className="feedback-item">
                      <div>
                        <b>{fb.username || fb.email || "Ẩn danh"}</b>: {editingId === fb.feedbackId ? (
                          <form
                            onSubmit={handleEditSubmit}
                            style={{ display: "inline" }}
                          >
                            <input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              required
                            />
                            <span style={{ color: "#f39c12", marginLeft: 8 }}>
                              {[1,2,3,4,5].map((star) => (
                                <span
                                  key={star}
                                  style={{
                                    cursor: "pointer",
                                    color: star <= editRating ? "#FFD700" : "#ccc",
                                    fontSize: 20
                                  }}
                                  onClick={() => setEditRating(star)}
                                >
                                  ★
                                </span>
                              ))}
                            </span>
                            <button type="submit">Lưu</button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                            >
                              Hủy
                            </button>
                          </form>
                        ) : (
                          <>
                            {fb.content} {" "}
                            <span style={{ color: "#f39c12" }}>
                              {[1,2,3,4,5].map((star) => (
                                <span
                                  key={star}
                                  style={{
                                    color: star <= fb.rating ? "#FFD700" : "#ccc",
                                    fontSize: 20
                                  }}
                                >
                                  ★
                                </span>
                              ))}
                            </span>
                          </>
                        )}
                      </div>
                      {(role === "manager" || role === "staff" || fb.username === username) && (
                        <>
                          <button
                            className="feedback-delete-btn"
                            onClick={() => handleDelete(fb.feedbackId)}
                          >
                            Xóa
                          </button>
                          {editingId !== fb.feedbackId && (
                            <button
                              className="feedback-edit-btn"
                              onClick={() => handleEdit(fb)}
                            >
                              Sửa
                            </button>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
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
