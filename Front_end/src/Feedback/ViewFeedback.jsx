import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewFeedback.css";

export default function ViewFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serviceName, setServiceName] = useState("");

  // Danh sách dịch vụ đúng theo DB
  const SERVICES = [
    "Xét nghiệm huyết thống",
    "Xét nghiệm hài cốt",
    "Xét nghiệm ADN cá nhân",
    "Xét nghiệm ADN pháp lý",
    "Xét nghiệm ADN trước sinh",
    "Xét nghiệm ADN khác",
    "Xét nghiệm ADN thai nhi",
    "Xét nghiệm ADN di truyền",
    "Xét nghiệm ADN hành chính",
    "Xét nghiệm ADN dân sự",
  ];

  // Lấy user info từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.toLowerCase();
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Lấy danh sách feedback từ API (theo serviceName)
  useEffect(() => {
    if (!serviceName) return;
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `/api/feedback/search/by-service-name/${encodeURIComponent(
            serviceName
          )}`,
          { headers: authHeader }
        );
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [serviceName]);

  // Xóa feedback
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`/api/feedback/delete/${id}`, { headers: authHeader });
      setFeedbacks((prev) => prev.filter((f) => f.feedbackId !== id));
    } catch (err) {
      console.error(err);
      setError("Xóa feedback thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // Sửa feedback
  const handleEdit = (fb) => {
    setEditingId(fb.feedbackId || fb.id);
    setEditContent(fb.content);
    setEditRating(fb.rating || 5);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.put(
        `/api/feedback/update/${editingId}`,
        {
          content: editContent,
          rating: editRating,
        },
        { headers: authHeader }
      );
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.feedbackId === editingId || f.id === editingId
            ? { ...f, content: editContent, rating: editRating }
            : f
        )
      );
      setEditingId(null);
      setEditContent("");
      setEditRating(5);
    } catch (err) {
      console.error(err);
      setError("Cập nhật feedback thất bại.");
    } finally {
      setLoading(false);
    }
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
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Chọn dịch vụ:</label>
        <select
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
        >
          <option value="">Chọn dịch vụ</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {loading ? (
        <div>Đang tải...</div>
      ) : feedbacks.length === 0 ? (
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
              <tr key={fb.feedbackId || fb.id}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {fb.feedbackId || fb.id || ""}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {fb.serviceName}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {fb.username || fb.fullName || "Ẩn danh"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {editingId === (fb.feedbackId || fb.id) ? (
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
                  {fb.createdAt ||
                  fb.feedback_date ||
                  fb.feedbackDate ||
                  fb.feedbackDateTime
                    ? new Date(
                        fb.createdAt ||
                          fb.feedback_date ||
                          fb.feedbackDate ||
                          fb.feedbackDateTime
                      ).toLocaleString()
                    : ""}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  <button
                    onClick={() => handleDelete(fb.feedbackId || fb.id)}
                    style={{ marginRight: 8 }}
                  >
                    Xóa
                  </button>
                  {editingId !== (fb.feedbackId || fb.id) && (
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
