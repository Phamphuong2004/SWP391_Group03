import React, { useState, useEffect } from "react";
import axios from "axios";
import "./History.css";

export default function History() {
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const allowedRoles = ["admin", "manager", "staff", "customer"];
  if (!user || !allowedRoles.includes(user.role.toLowerCase())) {
    return <div className="error">Bạn không có quyền truy cập trang này.</div>;
  }

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        // Lấy token từ user object trong localStorage
        const token = user.token;
        const response = await axios.get("/api/user/login-history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoginHistory(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching login history:", err); // Log the actual error
        setError("Failed to fetch login history");
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchLoginHistory();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  if (!user) {
    return <div>Please log in to view history.</div>;
  }

  return (
    <div className="history-container">
      <h1>User Login History</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Login Time</th>
            <th>IP Address</th>
            <th>User Agent</th>
            <th>Login Type</th>
          </tr>
        </thead>
        <tbody>
          {loginHistory.map((history) => (
            <tr key={history.id}>
              <td>{history.id}</td>
              <td>{history.user?.username || "Không có"}</td>
              <td>{new Date(history.loginTime).toLocaleString()}</td>
              <td>{history.ipAddress}</td>
              <td>{history.userAgent}</td>
              <td>{history.loginType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
