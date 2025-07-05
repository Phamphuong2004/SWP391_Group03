import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServiceManagement from "../ServiceManagement/ServiceManagement";
import AccountManagement from "../AccountManagement/AccountManagement";
import KitManagement from "../Kit/KitManagement";
import SampleManagement from "../SampleManagement/SampleManagement";
import InvoiceList from "../Payment/InvoiceList";
import ViewFeedback from "../Feedback/ViewFeedback";
import SampleTypeManagement from "../SampleTypeManagement/SampleTypeManagement";
import ResultList from "../result/ResultList";
import ReceiveBooking from "../ReceiveBooking/ReceiveBooking";
import ServiceTracking from "../ServiceTracking/ServiceTracking";
import "./ManagerDashboard.css";
import {
  FaChartBar,
  FaUserCog,
  FaBoxOpen,
  FaVials,
  FaListAlt,
  FaMoneyBillWave,
  FaCommentDots,
  FaFileAlt,
  FaClipboardList,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";

const managerMenu = [
  { label: "Tổng quan", key: "dashboard", icon: <FaHome /> },
  { label: "Quản lý dịch vụ", key: "services", icon: <FaListAlt /> },
  { label: "Quản lý tài khoản", key: "accounts", icon: <FaUserCog /> },
  { label: "Quản lý Kit", key: "kits", icon: <FaBoxOpen /> },
  { label: "Quản lý mẫu tổng hợp", key: "samples", icon: <FaVials /> },
  { label: "Quản lý loại mẫu", key: "sampletypes", icon: <FaClipboardList /> },
  { label: "Quản lý hóa đơn", key: "invoices", icon: <FaMoneyBillWave /> },
  { label: "Quản lý feedback", key: "feedback", icon: <FaCommentDots /> },
  { label: "Quản lý kết quả xét nghiệm", key: "results", icon: <FaFileAlt /> },
  { label: "Quản lý đơn", key: "receive-booking", icon: <FaClipboardList /> },
  { label: "Theo dõi đơn", key: "service-tracking", icon: <FaChartBar /> },
];

const ManagerDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (
      !user ||
      typeof user.role !== "string" ||
      user.role.toLowerCase() !== "manager"
    ) {
      setIsManager(false);
      setTimeout(() => navigate("/"), 1500);
    }
  }, [navigate]);

  if (!isManager) {
    return (
      <div
        style={{
          padding: 48,
          textAlign: "center",
          color: "#e74c3c",
          fontSize: 20,
        }}
      >
        Bạn không có quyền truy cập trang này. Đang chuyển về trang chủ...
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedMenu) {
      case "services":
        return <ServiceManagement />;
      case "accounts":
        return <AccountManagement />;
      case "kits":
        return <KitManagement />;
      case "samples":
        return <SampleManagement />;
      case "sampletypes":
        return <SampleTypeManagement />;
      case "invoices":
        return <InvoiceList />;
      case "feedback":
        return <ViewFeedback />;
      case "results":
        return <ResultList />;
      case "receive-booking":
        return <ReceiveBooking />;
      case "service-tracking":
        return <ServiceTracking />;
      default:
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ marginBottom: 24 }}>Bảng điều khiển xét nghiệm ADN</h2>
            <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
              <div className="stat-card">
                <div>Dịch vụ ADN</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#aaa" }}>
                  Chưa có dữ liệu
                </div>
                <span className="stat-icon">
                  <FaListAlt />
                </span>
              </div>
              <div className="stat-card">
                <div>Lịch hẹn ADN</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#aaa" }}>
                  Chưa có dữ liệu
                </div>
                <span className="stat-icon">
                  <FaClipboardList />
                </span>
              </div>
              <div className="stat-card">
                <div>Doanh thu</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#aaa" }}>
                  Chưa có dữ liệu
                </div>
                <span className="stat-icon">
                  <FaMoneyBillWave />
                </span>
              </div>
              <div className="stat-card">
                <div>Đánh giá</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#aaa" }}>
                  Chưa có dữ liệu
                </div>
                <span className="stat-icon">
                  <FaCommentDots />
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
              <div
                style={{
                  flex: 2,
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  minHeight: 180,
                }}
              >
                <h4>Doanh thu theo tháng</h4>
                <div
                  style={{
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                  }}
                >
                  Chưa có dữ liệu
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  minHeight: 180,
                }}
              >
                <h4>Phân bố loại xét nghiệm ADN</h4>
                <div
                  style={{
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                  }}
                >
                  Chưa có dữ liệu
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <div
                style={{
                  flex: 2,
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h4>Lịch hẹn gần đây</h4>
                <div style={{ marginTop: 16, color: "#aaa" }}>
                  Chưa có dữ liệu
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h4>Dịch vụ ADN phổ biến</h4>
                <div style={{ marginTop: 16, color: "#aaa" }}>
                  Chưa có dữ liệu
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="manager-dashboard-container"
      style={{ display: "flex", minHeight: "100vh" }}
    >
      {/* Sidebar/Menu */}
      <nav className="manager-sidebar">
        <h3 className="sidebar-title">Quản lý hệ thống ADN</h3>
        <ul className="sidebar-menu">
          {managerMenu.map((item) => (
            <li key={item.key}>
              <button
                className={`sidebar-menu-btn${
                  selectedMenu === item.key ? " selected" : ""
                }`}
                onClick={() => setSelectedMenu(item.key)}
              >
                <span className="sidebar-menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          <FaSignOutAlt style={{ marginRight: 8 }} /> Đăng xuất
        </button>
      </nav>
      {/* Main content */}
      <div className="manager-dashboard-main">{renderContent()}</div>
    </div>
  );
};

export default ManagerDashboard;
