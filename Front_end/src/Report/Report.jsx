import React, { useState } from "react";
import { createReport } from "./ReportApi";
import "./Report.css";

const Report = () => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // Đảm bảo truyền đúng key cho API
      await createReport({
        reportTitle: reportTitle,
        reportContent: reportContent,
        username: username
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
        <button type="submit" disabled={loading}>
          {loading ? "Đang gửi..." : "Tạo báo cáo"}
        </button>
      </form>
      {message && (
        <div className={`report-message ${message.includes("thành công") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Report;
