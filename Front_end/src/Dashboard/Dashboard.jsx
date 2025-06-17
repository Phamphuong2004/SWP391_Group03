import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";

export default function Dashboard() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await axios.get("/api/test-results");
        setTestResults(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải kết quả xét nghiệm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải kết quả xét nghiệm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>Lỗi</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Kết quả xét nghiệm</h2>
      {testResults.length === 0 ? (
        <p className="no-results">Chưa có kết quả xét nghiệm nào.</p>
      ) : (
        <table className="dashboard-table table table-bordered table-striped mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Loại xét nghiệm</th>
              <th>Kết quả</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((result, idx) => (
              <tr key={result.id}>
                <td>{idx + 1}</td>
                <td>{result.name}</td>
                <td>{result.testType}</td>
                <td>{result.result}</td>
                <td>{new Date(result.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
