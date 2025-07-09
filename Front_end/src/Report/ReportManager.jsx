import React, { useEffect, useState } from "react";
import { getReportList, getReportListByUserName } from "./ReportApi";
import "./Report.css";

const ReportManager = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filtering, setFiltering] = useState(false);

  const fetchReports = async (username = "") => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (username.trim()) {
        setFiltering(true);
        res = await getReportListByUserName(username.trim());
      } else {
        setFiltering(false);
        res = await getReportList();
      }
      setReports(res.data);
    } catch {
      setError("Không thể tải danh sách báo cáo!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchReports(filterUser);
  };

  return (
    <div className="report-manager-outer report-manager-dashboard">
      <div className="report-manager-container">
        <h2>Danh sách báo cáo nhân viên</h2>
        <form className="report-filter-form" onSubmit={handleFilter}>
          <input
            type="text"
            placeholder="Lọc theo username nhân viên..."
            value={filterUser}
            onChange={e => setFilterUser(e.target.value)}
            className="report-filter-input"
          />
          <button type="submit" className="report-btn">Lọc</button>
          {filtering && (
            <button type="button" className="report-btn" style={{marginLeft:8}} onClick={() => { setFilterUser(""); fetchReports(""); }}>Bỏ lọc</button>
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
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.reportId || r.id}>
                  <td>{r.reportTitle}</td>
                  <td>{r.reportContent}</td>
                  <td>{r.username}</td>
                  <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</td>
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
