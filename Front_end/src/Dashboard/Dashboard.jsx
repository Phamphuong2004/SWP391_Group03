import React from "react";
import "./Dashboard.css";
import DashboardResults from "../Dashboard";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Kết quả xét nghiệm</h2>
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
          {DashboardResults.map((row, idx) => (
            <tr key={row.id}>
              <td>{idx + 1}</td>
              <td>{row.name}</td>
              <td>{row.test}</td>
              <td>{row.result}</td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
