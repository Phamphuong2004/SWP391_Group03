import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";

export default function Dashboard() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [newResult, setNewResult] = useState("");

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await axios.get("/api/results/getlist");
        setTestResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải kết quả xét nghiệm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  // Lấy userId và userRole từ localStorage
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole'); // 'customer', 'staff', 'manager'

  // Lọc kết quả chỉ của customer hiện tại
  const customerResults = testResults.filter(result => String(result.customerId) === String(userId));
  // Staff/manager xem tất cả, customer chỉ xem của mình
  const displayResults = (userRole === 'customer') ? customerResults : testResults;

  // Xử lý cập nhật kết quả
  function handleEdit(result) {
    setEditingResult(result);
    setNewResult(result.result);
  }

  async function handleUpdate() {
    try {
      await axios.put(`/api/results/${editingResult.id}`, {
        ...editingResult,
        result: newResult,
      });
      setEditingResult(null);
      setLoading(true);
      const response = await axios.get("/api/results/getlist");
      setTestResults(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  }

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
      {editingResult && (
        <div className="edit-modal">
          <h3>Cập nhật kết quả cho {editingResult.name}</h3>
          <input
            value={newResult}
            onChange={e => setNewResult(e.target.value)}
          />
          <button onClick={handleUpdate}>Lưu</button>
          <button onClick={() => setEditingResult(null)}>Hủy</button>
        </div>
      )}
      {displayResults.length === 0 ? (
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
              {(userRole === 'staff' || userRole === 'manager') && <th>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {displayResults.map((result, idx) => (
              <tr key={result.id}>
                <td>{idx + 1}</td>
                <td>{result.name}</td>
                <td>{result.testType}</td>
                <td>{result.result}</td>
                <td>{new Date(result.date).toLocaleDateString()}</td>
                {(userRole === 'staff' || userRole === 'manager') && (
                  <td>
                    <button onClick={() => handleEdit(result)}>Cập nhật</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
