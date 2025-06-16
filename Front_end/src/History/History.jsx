import React, { useState, useEffect } from "react";
import axios from "axios";
import "./History.css";

export default function History() {
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const response = await axios.get("/api/user/login-history");
        setLoginHistory(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch login history");
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

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
              <td>{history.user.username}</td>
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
