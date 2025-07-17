import React, { useEffect, useState } from "react";
import {
  getReportList,
  getReportListByUserName,
  getReportById,
  deleteReport,
} from "./ReportApi";
import "./ReportManager.css";

const ReportManager = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterId, setFilterId] = useState("");
  const [filtering, setFiltering] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.toLowerCase();
  const isStaff = role === "staff";

  const fetchReports = async (username = "", id = "") => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (id.trim()) {
        res = await getReportById(id.trim());
        setReports(res.data ? [res.data] : []);
        setFiltering(true);
      } else if (username.trim()) {
        res = await getReportListByUserName(username.trim());
        setReports(res.data);
        setFiltering(true);
      } else {
        res = await getReportList();
        setReports(res.data);
        setFiltering(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách báo cáo!"
      );
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    // Validation
    if (filterId && (!/^[0-9]+$/.test(filterId) || Number(filterId) <= 0)) {
      setError("ID báo cáo phải là số dương!");
      return;
    }
    if (filterUser && /[^a-zA-Z0-9_]/.test(filterUser)) {
      setError("Username không được chứa ký tự đặc biệt!");
      return;
    }
    setError("");
    fetchReports(filterUser, filterId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa báo cáo này?")) return;
    try {
      await deleteReport(id);
      setReports(reports.filter((r) => (r.reportId || r.id) !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Xóa báo cáo thất bại!");
    }
  };

  return (
    <div className="report-manager-outer report-manager-dashboard">
      <div className="report-manager-container">
        <h2>Danh sách báo cáo nhân viên</h2>
        <form className="report-filter-form" onSubmit={handleFilter}>
          <input
            type="text"
            placeholder="Tìm theo ID báo cáo..."
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            className="report-filter-input"
            style={{ maxWidth: 180 }}
          />
          <input
            type="text"
            placeholder="Lọc theo username nhân viên..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="report-filter-input"
            style={{ maxWidth: 220 }}
          />
          <button type="submit" className="report-btn">
            Lọc
          </button>
          {filtering && (
            <button
              type="button"
              className="report-btn"
              style={{ marginLeft: 8 }}
              onClick={() => {
                setFilterUser("");
                setFilterId("");
                fetchReports("", "");
              }}
            >
              Bỏ lọc
            </button>
          )}
        </form>
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div className="report-message error">{error}</div>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Nội dung</th>
                <th>Người tạo</th>
                <th>Ngày tạo</th>
                {isStaff && <th>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {reports.map((report, idx) => (
                <tr key={report.id || report.reportId || idx}>
                  <td>{report.reportTitle}</td>
                  <td>{report.reportContent}</td>
                  <td>{report.username}</td>
                  <td>{report.createdAt}</td>
                  {isStaff && (
                    <td>
                      <button
                        className="report-delete-btn"
                        onClick={() =>
                          handleDelete(report.id || report.reportId)
                        }
                      >
                        Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportManager;
