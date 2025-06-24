import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function StaffDashboard() {
  // Lấy role từ localStorage
  let currentUser = null;
  let isStaff = false;
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      currentUser = JSON.parse(userString);
      isStaff = currentUser.role === "staff";
    }
  } catch (e) {
    isStaff = false;
  }

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API endpoint lấy danh sách đơn (điều chỉnh theo backend)
  const API_BASE_URL = "http://localhost:8080/api";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) throw new Error('Không thể tải danh sách đơn');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái đơn
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Không thể cập nhật trạng thái đơn');
      setOrders(orders => orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      alert('Cập nhật trạng thái thành công!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  useEffect(() => {
    if (isStaff) fetchOrders();
  }, [isStaff]);

  if (!isStaff) {
    return (
      <div className="container mt-4">
        <h2>Trang Nhân Viên (Staff Dashboard)</h2>
        <p>Bạn không có quyền truy cập chức năng này.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Trang Nhân Viên (Staff Dashboard)</h2>
        <p>Đang tải danh sách đơn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2>Trang Nhân Viên (Staff Dashboard)</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Trang Nhân Viên (Staff Dashboard)</h2>
      <p>Bạn có thể cập nhật trạng thái các đơn của khách hàng.</p>
      <div className="dashboard-table">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Tên khách</th>
              <th>Dịch vụ</th>
              <th>Ngày hẹn</th>
              <th>Trạng thái</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName || order.full_name || order.name}</td>
                <td>{order.serviceName || order.service_name}</td>
                <td>{order.appointmentDate ? new Date(order.appointmentDate).toLocaleDateString() : ''}</td>
                <td>
                  <span className={`badge ${order.status === 'Đã hoàn thành' ? 'bg-success' : order.status === 'Đã hủy' ? 'bg-danger' : 'bg-warning'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
