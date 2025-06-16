import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Card, Typography, Spin, Input, Space, DatePicker } from "antd";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import "./AdminLoginHistory.css";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const AdminLoginHistory = () => {
  const [loading, setLoading] = useState(true);
  const [loginHistory, setLoginHistory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const fetchLoginHistory = async () => {
    try {
      const response = await axios.get("/api/auth/admin/login-history");
      setLoginHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching login history:", error);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const filteredData = loginHistory.filter((record) => {
    const matchesSearch =
      record.username.toLowerCase().includes(searchText.toLowerCase()) ||
      record.email.toLowerCase().includes(searchText.toLowerCase()) ||
      record.ipAddress.includes(searchText);

    if (!dateRange) return matchesSearch;

    const loginDate = moment(record.loginTime);
    return (
      matchesSearch &&
      loginDate.isAfter(dateRange[0]) &&
      loginDate.isBefore(dateRange[1])
    );
  });

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Thời gian đăng nhập",
      dataIndex: "loginTime",
      key: "loginTime",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
      sorter: (a, b) => moment(a.loginTime).unix() - moment(b.loginTime).unix(),
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },
    {
      title: "Thiết bị",
      dataIndex: "deviceInfo",
      key: "deviceInfo",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={status === "success" ? "status-success" : "status-failed"}
        >
          {status === "success" ? "Thành công" : "Thất bại"}
        </span>
      ),
    },
  ];

  return (
    <div className="login-history-container">
      <Card className="login-history-card">
        <Title level={2} className="login-history-title">
          Lịch sử đăng nhập hệ thống
        </Title>

        <div className="search-section">
          <Space>
            <Input
              className="search-input"
              placeholder="Tìm kiếm theo tên, email hoặc IP"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <RangePicker
              className="date-picker"
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Space>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng số ${total} bản ghi`,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default AdminLoginHistory;
