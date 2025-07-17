import React, { useState, useEffect } from "react";
import { createReport } from "./ReportApi";
import "./Report.css";
import { useNavigate } from "react-router-dom";
// import ReportManager from "./ReportManager";

const Report = () => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [checkedRole, setCheckedRole] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.role && user.role.toLowerCase() === "manager") {
      setIsManager(true);
      navigate("/manager-dashboard", { replace: true });
    }
    setCheckedRole(true);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    // Validation
    if (!reportTitle || reportTitle.trim() === "") {
      setMessage("Tiêu đề báo cáo không được để trống!");
      setLoading(false);
      return;
    }
    if (!reportContent || reportContent.trim() === "") {
      setMessage("Nội dung báo cáo không được để trống!");
      setLoading(false);
      return;
    }
    if (!username || username.trim() === "") {
      setMessage("Tên người tạo báo cáo không được để trống!");
      setLoading(false);
      return;
    }
    try {
      await createReport({
        reportTitle: reportTitle,
        reportContent: reportContent,
        username: username,
      });
      setMessage("Tạo báo cáo thành công!");
      setReportTitle("");
      setReportContent("");
      setUsername("");
    } catch {
      setMessage("Có lỗi xảy ra khi tạo báo cáo!");
    } finally {
      setLoading(false);
    }
  };

  if (!checkedRole) return null; // Đợi kiểm tra xong role mới render

  if (isManager) {
    // Đã chuyển hướng, không render gì ở đây
    return null;
  }

  return (
    <div className="report-container">
      <h2>Tạo báo cáo mới</h2>
      <form className="report-form" onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề báo cáo</label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nội dung báo cáo</label>
          <textarea
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            required
            rows={5}
          />
        </div>
        <div>
          <label>Tên người tạo báo cáo (username)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="report-btn">
          {loading ? "Đang gửi..." : "Tạo báo cáo"}
        </button>
      </form>
      {message && (
        <div
          className={`report-message ${
            message.includes("thành công") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Report;
