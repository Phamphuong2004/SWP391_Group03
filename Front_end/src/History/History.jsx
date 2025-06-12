import React from "react";
import "./History.css";

export default function History() {
  return (
    <div className="history-container">
      <h1>User Login and Registration History</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Date</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>{/* Dữ liệu sẽ được thêm vào đây sau */}</tbody>
      </table>
    </div>
  );
}
