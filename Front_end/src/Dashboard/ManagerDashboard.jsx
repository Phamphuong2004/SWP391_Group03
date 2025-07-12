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
  const [selectedMenu, setSelectedMenu] = useState("report");
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

  useEffect(() => {
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
        // Lọc lịch hẹn trong tháng hiện tại và tháng sau
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const nextMonth = (currentMonth + 1) % 12;
        const nextMonthYear = nextMonth === 0 ? currentYear + 1 : currentYear;
        const filtered = res.data.filter((a) => {
          const date = new Date(a.appointmentDate);
          const month = date.getMonth();
          const year = date.getFullYear();
          return (
            (month === currentMonth && year === currentYear) ||
            (month === nextMonth && year === nextMonthYear)
          );
        });
        filtered.sort(
          (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
        );
        setRecentAppointments(filtered.slice(0, 3));
        // Đếm số lượng từng loại dịch vụ
        const serviceCountMap = {};
        res.data.forEach((a) => {
          const type = a.serviceType || a.serviceName;
          if (type) {
            serviceCountMap[type] = (serviceCountMap[type] || 0) + 1;
          }
        });
        // Sắp xếp giảm dần theo số lượng, lấy top 3
        const sorted = Object.entries(serviceCountMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        setPopularServices(sorted);
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
        return <ReceiveBooking />;
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
        return (
          <div style={{ padding: 32 }}>
            <h2 style={{ marginBottom: 24 }}>Bảng điều khiển xét nghiệm ADN</h2>
            <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
              <div className="stat-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Dịch vụ ADN</div>
                  <div className="dashboard-card-value">
                    {summaryData.serviceCount} dịch vụ
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Lịch hẹn ADN</div>
                  <div className="dashboard-card-value">
                    {summaryData.appointmentCount} lịch hẹn
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Doanh thu</div>
                  <div className="dashboard-card-value">
                    {summaryData.totalRevenue.toLocaleString()} VNĐ
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="dashboard-card">
                  <div className="dashboard-card-title">Đánh giá</div>
                  <div className="dashboard-card-value">
                    {summaryData.feedbackCount} đánh giá
                  </div>
                </div>
              </div>
            </div>
            {/* Phần Doanh thu theo tháng */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(44,62,80,0.08)",
                padding: 24,
                marginBottom: 32,
              }}
            >
              <h3 style={{ color: "#2563eb", marginBottom: 16 }}>
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
                      style={{ fill: "#2563eb", fontWeight: 700, fontSize: 13 }}
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
                        stopColor="#90caf9"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
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
                {recentAppointments.length === 0 ? (
                  <div style={{ marginTop: 16, color: "#aaa" }}>
                    Chưa có dữ liệu
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
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
                          marginBottom: 8,
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>
                          {a.serviceType || a.serviceName}
                        </div>
                        <div>Mã đơn: {a.appointmentId}</div>
                        <div>
                          Ngày hẹn:{" "}
                          {new Date(a.appointmentDate).toLocaleDateString()}
                        </div>
                        <div>Khách hàng: {a.fullName}</div>
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
                  flex: 1,
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h4>Dịch vụ ADN phổ biến</h4>
                {popularServices.length === 0 ? (
                  <div style={{ marginTop: 16, color: "#aaa" }}>
                    Chưa có dữ liệu
                  </div>
                ) : (
                  <div style={{ marginTop: 16 }}>
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
                        }}
                      >
                        <span>{type}</span>
                        <span style={{ color: "#2563eb" }}>
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
