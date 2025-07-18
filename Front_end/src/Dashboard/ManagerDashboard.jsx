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
import ReportManager from "../Report/ReportManager";
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
  FaArrowLeft,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import axios from "axios";
import { getAllPayments } from "../Payment/PaymentApi";
import TestCategoryManager from "../TestCategory/TestCategoryManager";
import TestPurposeManager from "../TestPurpose/TestPurposeManager";
import { Box, Grid } from "@mui/material";

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
  { label: "Quản lý song song", key: "song-song", icon: <FaClipboardList /> },
  {
    label: "Báo cáo",
    key: "report",
    icon: <FaFileAlt style={{ color: "#ff5722" }} />,
  },
];

const SERVICES = [
  "Xét nghiệm huyết thống",
  "Xét nghiệm hài cốt",
  "Xét nghiệm ADN cá nhân",
  "Xét nghiệm ADN pháp lý",
  "Xét nghiệm ADN trước sinh",
  "Xét nghiệm ADN khác",
  "Xét nghiệm ADN thai nhi",
  "Xét nghiệm ADN di truyền",
  "Xét nghiệm ADN hành chính",
  "Xét nghiệm ADN dân sự",
];

const ManagerDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(true);
  const [serviceCount, setServiceCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

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

  // Hàm load dữ liệu dashboard
  const loadDashboardData = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/services/view-all-service", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => setServiceCount(res.data.length))
      .catch(() => setServiceCount(0));
    // Lấy số lượng lịch hẹn thực tế và lịch hẹn gần đây
    axios
      .get("/api/get-all-appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setAppointmentCount(res.data.length);
        // Lấy 3 lịch hẹn mới nhất (không giới hạn theo tháng)
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        setRecentAppointments(sorted.slice(0, 3));
        // Đếm số lượng từng loại dịch vụ, bỏ dịch vụ tên là số hoặc rỗng
        const serviceCountMap = {};
        res.data.forEach((a) => {
          const type = a.serviceType || a.serviceName;
          if (type && isNaN(type) && type.trim() !== "") {
            serviceCountMap[type] = (serviceCountMap[type] || 0) + 1;
          }
        });
        // Sắp xếp giảm dần theo số lượng, lấy top 3
        const sortedPopular = Object.entries(serviceCountMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        setPopularServices(sortedPopular);
      })
      .catch(() => {
        setAppointmentCount(0);
        setRecentAppointments([]);
        setPopularServices([]);
      });
    // Lấy tổng doanh thu thực tế
    getAllPayments(token)
      .then((payments) => {
        // Chỉ tính các payment có status là 'PAID'
        const total = payments
          .filter((p) => p.status === "PAID")
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        setTotalRevenue(total);
        // Tính doanh thu 12 tháng
        const now = new Date();
        const year = now.getFullYear();
        const monthlyRevenue = Array(12).fill(0);
        payments.forEach((p) => {
          if (p.status === "PAID" && p.paymentDate) {
            const date = new Date(p.paymentDate);
            if (date.getFullYear() === year) {
              const month = date.getMonth(); // 0-11
              monthlyRevenue[month] += p.amount || 0;
            }
          }
        });
        const chartData = monthlyRevenue.map((revenue, idx) => ({
          month: `Tháng ${idx + 1}`,
          revenue,
        }));
        setRevenueData(chartData);
      })
      .catch(() => {
        setTotalRevenue(0);
        setRevenueData([]);
      });
    // Lấy tổng số lượng feedback thực tế bằng cách cộng từng dịch vụ
    const fetchAllFeedbackCount = async () => {
      let total = 0;
      for (const serviceName of SERVICES) {
        try {
          const res = await axios.get(
            `/api/feedback/search/by-service-name/${encodeURIComponent(
              serviceName
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (Array.isArray(res.data)) {
            total += res.data.length;
          }
        } catch {
          // Bỏ qua lỗi từng dịch vụ
        }
      }
      setFeedbackCount(total);
    };
    fetchAllFeedbackCount();
  };

  // Gọi loadDashboardData lần đầu và polling mỗi 30s
  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  // Mock data tổng quan
  const summaryData = {
    serviceCount: serviceCount, // Số lượng dịch vụ ADN thực tế từ API
    appointmentCount: appointmentCount, // Số lượng lịch hẹn thực tế từ API
    totalRevenue: totalRevenue, // Tổng doanh thu thực tế từ API
    feedbackCount: feedbackCount, // Số lượng đánh giá thực tế từ API
  };

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
        return <ReceiveBooking selectedId={selectedAppointmentId} />;
      case "service-tracking":
        return <ServiceTracking />;
      case "song-song":
        return (
          <Box sx={{ flexGrow: 1, px: 2, py: 4 }}>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={6}>
                <TestCategoryManager />
              </Grid>
              <Grid item xs={12} md={6}>
                <TestPurposeManager />
              </Grid>
            </Grid>
          </Box>
        );
      case "report":
        return <ReportManager />;
      default:
        // --- REDESIGN DASHBOARD UI ---
        return (
          <div style={{ padding: 0, width: "100%" }}>
            <h2
              style={{
                marginBottom: 32,
                fontWeight: 900,
                color: "#2563eb",
                fontSize: 32,
                letterSpacing: 1,
              }}
            >
              Bảng điều khiển xét nghiệm ADN
            </h2>
            {/* Stat cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 32,
                marginBottom: 36,
              }}
            >
              <div
                className="stat-card"
                style={{
                  borderLeft: "6px solid #4f5bd5",
                  background: "#f5f7fa",
                  position: "relative",
                }}
              >
                <FaListAlt
                  className="stat-icon"
                  style={{
                    color: "#4f5bd5",
                    position: "absolute",
                    top: 18,
                    right: 18,
                    fontSize: 38,
                    opacity: 0.18,
                  }}
                />
                <div
                  className="dashboard-card-title"
                  style={{ fontWeight: 700, color: "#4f5bd5", fontSize: 18 }}
                >
                  Dịch vụ ADN
                </div>
                <div
                  className="dashboard-card-value"
                  style={{ fontWeight: 900, fontSize: 28 }}
                >
                  {summaryData.serviceCount} dịch vụ
                </div>
              </div>
              <div
                className="stat-card"
                style={{
                  borderLeft: "6px solid #4caf50",
                  background: "#f5f7fa",
                  position: "relative",
                }}
              >
                <FaClipboardList
                  className="stat-icon"
                  style={{
                    color: "#4caf50",
                    position: "absolute",
                    top: 18,
                    right: 18,
                    fontSize: 38,
                    opacity: 0.18,
                  }}
                />
                <div
                  className="dashboard-card-title"
                  style={{ fontWeight: 700, color: "#4caf50", fontSize: 18 }}
                >
                  Lịch hẹn ADN
                </div>
                <div
                  className="dashboard-card-value"
                  style={{ fontWeight: 900, fontSize: 28 }}
                >
                  {summaryData.appointmentCount} lịch hẹn
                </div>
              </div>
              <div
                className="stat-card"
                style={{
                  borderLeft: "6px solid #f39c12",
                  background: "#f5f7fa",
                  position: "relative",
                }}
              >
                <FaMoneyBillWave
                  className="stat-icon"
                  style={{
                    color: "#f39c12",
                    position: "absolute",
                    top: 18,
                    right: 18,
                    fontSize: 38,
                    opacity: 0.18,
                  }}
                />
                <div
                  className="dashboard-card-title"
                  style={{ fontWeight: 700, color: "#f39c12", fontSize: 18 }}
                >
                  Doanh thu
                </div>
                <div
                  className="dashboard-card-value"
                  style={{ fontWeight: 900, fontSize: 28 }}
                >
                  {summaryData.totalRevenue.toLocaleString()} VNĐ
                </div>
              </div>
              <div
                className="stat-card"
                style={{
                  borderLeft: "6px solid #e67e22",
                  background: "#f5f7fa",
                  position: "relative",
                }}
              >
                <FaCommentDots
                  className="stat-icon"
                  style={{
                    color: "#e67e22",
                    position: "absolute",
                    top: 18,
                    right: 18,
                    fontSize: 38,
                    opacity: 0.18,
                  }}
                />
                <div
                  className="dashboard-card-title"
                  style={{ fontWeight: 700, color: "#e67e22", fontSize: 18 }}
                >
                  Đánh giá
                </div>
                <div
                  className="dashboard-card-value"
                  style={{ fontWeight: 900, fontSize: 28 }}
                >
                  {summaryData.feedbackCount} đánh giá
                </div>
              </div>
            </div>
            {/* Biểu đồ doanh thu */}
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 4px 24px rgba(44,62,80,0.08)",
                padding: 32,
                marginBottom: 36,
              }}
            >
              <h3
                style={{
                  color: "#2563eb",
                  marginBottom: 18,
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                Biểu đồ doanh thu theo tháng
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={revenueData}
                  margin={{ top: 24, right: 32, left: 0, bottom: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontWeight: 600, fontSize: 14 }}
                  />
                  <YAxis
                    tickFormatter={(v) => v.toLocaleString()}
                    tick={{ fontWeight: 600, fontSize: 13 }}
                    domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]}
                  />
                  <Tooltip
                    formatter={(v) => v.toLocaleString() + " VNĐ"}
                    contentStyle={{ borderRadius: 12, fontWeight: 500 }}
                  />
                  <Legend
                    iconType="rect"
                    wrapperStyle={{ fontWeight: 700, color: "#2563eb" }}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Doanh thu"
                    fill="url(#colorRevenue)"
                    radius={[8, 8, 0, 0]}
                    barSize={36}
                  >
                    <LabelList
                      dataKey="revenue"
                      position="top"
                      formatter={(v) => (v > 0 ? v.toLocaleString() : "")}
                    />
                  </Bar>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#4f5bd5"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Lịch hẹn gần đây & Dịch vụ phổ biến */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 32,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 28,
                  boxShadow: "0 2px 12px #e0e7ef",
                  minHeight: 220,
                }}
              >
                <h4
                  style={{
                    color: "#2563eb",
                    fontWeight: 800,
                    fontSize: 18,
                    marginBottom: 18,
                  }}
                >
                  Lịch hẹn gần đây
                </h4>
                {recentAppointments.length === 0 ? (
                  <div style={{ marginTop: 16, color: "#aaa" }}>
                    Chưa có dữ liệu
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexDirection: "column",
                      gap: 18,
                    }}
                  >
                    {recentAppointments.map((a) => (
                      <div
                        key={a.appointmentId}
                        style={{
                          background: "#f5f7fa",
                          borderRadius: 10,
                          padding: 16,
                          boxShadow: "0 2px 8px #e0e7ef",
                          marginBottom: 4,
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "#2563eb" }}>
                          {a.serviceType || a.serviceName}
                        </div>
                        <div style={{ fontSize: 15 }}>
                          Mã đơn: <b>{a.appointmentId}</b>
                        </div>
                        <div style={{ fontSize: 15 }}>
                          Ngày hẹn:{" "}
                          <b>
                            {new Date(a.appointmentDate).toLocaleDateString()}
                          </b>
                        </div>
                        <div style={{ fontSize: 15 }}>
                          Khách hàng: <b>{a.fullName}</b>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <button
                            style={{
                              background: "#2563eb",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "6px 18px",
                              fontWeight: 500,
                              cursor: "pointer",
                              fontSize: 15,
                            }}
                            onClick={() => {
                              setSelectedAppointmentId(a.appointmentId);
                              setSelectedMenu("receive-booking");
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 28,
                  boxShadow: "0 2px 12px #e0e7ef",
                  minHeight: 220,
                }}
              >
                <h4
                  style={{
                    color: "#4f5bd5",
                    fontWeight: 800,
                    fontSize: 18,
                    marginBottom: 18,
                  }}
                >
                  Dịch vụ ADN phổ biến
                </h4>
                {popularServices.length === 0 ? (
                  <div style={{ marginTop: 16, color: "#aaa" }}>
                    Chưa có dữ liệu
                  </div>
                ) : (
                  <div style={{ marginTop: 8 }}>
                    {popularServices.map(([type, count]) => (
                      <div
                        key={type}
                        style={{
                          background: "#f5f7fa",
                          borderRadius: 10,
                          padding: 12,
                          marginBottom: 10,
                          fontWeight: 500,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#4f5bd5", fontWeight: 700 }}>
                          {type}
                        </span>
                        <span style={{ color: "#2563eb", fontWeight: 800 }}>
                          {count} lượt đặt
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                }${item.key === "report" ? " report-orange" : ""}`}
                onClick={() => {
                  if (item.key === "report") {
                    navigate("/report");
                  } else {
                    setSelectedMenu(item.key);
                  }
                }}
              >
                <span className="sidebar-menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div
          className="menu-actions"
          style={{ marginTop: "auto", padding: "16px 0 0 0" }}
        >
          <button
            className="sidebar-menu-btn go-home-btn"
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="sidebar-menu-icon">
              <FaArrowLeft />
            </span>
            <span>Về trang chủ</span>
          </button>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            <FaSignOutAlt style={{ marginRight: 8 }} /> Đăng xuất
          </button>
        </div>
      </nav>
      {/* Main content */}
      <div className="manager-dashboard-main">{renderContent()}</div>
    </div>
  );
};

export default ManagerDashboard;
