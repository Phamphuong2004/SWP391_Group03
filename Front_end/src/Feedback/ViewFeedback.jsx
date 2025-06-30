import React, { useState } from "react";

// Dữ liệu mẫu cứng cho feedback
const SAMPLE_FEEDBACKS = [
  {
    feedbackId: 1,
    serviceName: "Xét nghiệm huyết thống cha-con",
    username: "Nguyễn Văn A",
    content: "Dịch vụ rất tốt!",
    rating: 5,
    createdAt: "2025-06-30T08:29:23.047Z",
  },
  {
    feedbackId: 2,
    serviceName: "Xét nghiệm huyết thống mẹ-con",
    username: "Trần Thị B",
    content: "Nhân viên thân thiện.",
    rating: 4,
    createdAt: "2025-06-29T10:15:00.000Z",
  },
];

export default function ViewFeedback() {
  const [feedbacks, setFeedbacks] = useState(SAMPLE_FEEDBACKS);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  // Lấy user info từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.toLowerCase();

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) {
      setFeedbacks((prev) => prev.filter((f) => f.feedbackId !== id));
    }
  };

  const handleEdit = (fb) => {
    setEditingId(fb.feedbackId);
    setEditContent(fb.content);
    setEditRating(fb.rating || 5);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.feedbackId === editingId
          ? { ...f, content: editContent, rating: editRating }
          : f
      )
    );
    setEditingId(null);
    setEditContent("");
    setEditRating(5);
  };

  if (role !== "manager" && role !== "staff") {
    return (
      <div style={{ padding: 32, color: "#e74c3c" }}>
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Quản lý đơn phản hồi khách hàng</h2>
      {feedbacks.length === 0 ? (
        <p>Chưa có đơn phản hồi nào.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Dịch vụ</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>
                Khách hàng
              </th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Nội dung</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Đánh giá</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Ngày gửi</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb.feedbackId}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {fb.feedbackId}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {fb.serviceName}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {fb.username}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {editingId === fb.feedbackId ? (
                    <form
                      onSubmit={handleEditSubmit}
                      style={{ display: "flex", gap: 8 }}
                    >
                      <input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        required
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                        required
                        style={{ width: 50 }}
                      />
                      <button type="submit">Lưu</button>
                      <button type="button" onClick={() => setEditingId(null)}>
                        Hủy
                      </button>
                    </form>
                  ) : (
                    fb.content
                  )}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {fb.rating || 5}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {fb.createdAt ? new Date(fb.createdAt).toLocaleString() : ""}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  <button
                    onClick={() => handleDelete(fb.feedbackId)}
                    style={{ marginRight: 8 }}
                  >
                    Xóa
                  </button>
                  {editingId !== fb.feedbackId && (
                    <button onClick={() => handleEdit(fb)}>Sửa</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
