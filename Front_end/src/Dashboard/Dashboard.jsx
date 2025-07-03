import React from "react";
import "./Dashboard.css";
import ResultList from "../result/ResultList";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Kết quả xét nghiệm</h2>
      <ResultList />
    </div>
  );
}
