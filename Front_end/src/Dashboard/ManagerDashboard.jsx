import React, { useState, useEffect } from "react";
import "./Dashboard.css";

export default function ManagerDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Đang làm việc"
  });

  // Lấy role từ localStorage
  let currentUser = null;
  let isManager = false;
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      currentUser = JSON.parse(userString);
      isManager = currentUser.role === "manager";
    }
  } catch (e) {
    isManager = false;
  }

  // API Base URL - thay đổi theo backend của bạn
  const API_BASE_URL = "http://localhost:8080/api"; // Điều chỉnh URL này

  // Fetch danh sách nhân viên
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Không thể tải danh sách nhân viên');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Thêm nhân viên mới
  const handleAddEmployee = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Không thể thêm nhân viên');
      }
      const newEmployee = await response.json();
      setEmployees([...employees, newEmployee]);
      setShowAddForm(false);
      resetForm();
      alert('Thêm nhân viên thành công!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
      console.error('Error adding employee:', err);
    }
  };

  // Sửa thông tin nhân viên
  const handleEditEmployee = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/users/${editingEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin nhân viên');
      }
      const updatedEmployee = await response.json();
      const updatedEmployees = employees.map(emp =>
        emp.id === editingEmployee.id ? updatedEmployee : emp
      );
      setEmployees(updatedEmployees);
      setShowEditForm(false);
      setEditingEmployee(null);
      resetForm();
      alert('Cập nhật thông tin thành công!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
      console.error('Error updating employee:', err);
    }
  };

  // Xóa nhân viên
  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Không thể xóa nhân viên');
      }
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      alert('Xóa nhân viên thành công!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
      console.error('Error deleting employee:', err);
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || employee.fullName || "",
      email: employee.email || "",
      phone: employee.phone || employee.phoneNumber || "",
      status: employee.status || "Đang làm việc"
    });
    setShowEditForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "Đang làm việc"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải danh sách nhân viên...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchEmployees}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Quản Lý Nhân Viên</h2>

      <div className="mb-4">
        {isManager && (
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowAddForm(true)}
          >
            + Thêm Nhân Viên Mới
          </button>
        )}
        <span className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          Chỉ Manager có quyền thêm, sửa, xóa nhân viên
        </span>
      </div>

      {/* Bảng danh sách nhân viên */}
      <div className="dashboard-table">
        {employees.length === 0 ? (
          <div className="no-results">
            <p>Chưa có nhân viên nào trong hệ thống</p>
          </div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                {isManager && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name || employee.fullName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone || employee.phoneNumber}</td>
                  <td>
                    <span className={`badge ${(employee.status || 'Đang làm việc') === 'Đang làm việc' ? 'bg-success' : 'bg-warning'}`}>
                      {employee.status || 'Đang làm việc'}
                    </span>
                  </td>
                  {isManager && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleEditClick(employee)}
                      >
                        <i className="fas fa-edit"></i> Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        title="Xóa nhân viên"
                      >
                        <i className="fas fa-trash"></i> Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal thêm nhân viên */}
      {showAddForm && isManager && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm Nhân Viên Mới</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Họ và Tên *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Số điện thoại *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Đang làm việc">Đang làm việc</option>
                    <option value="Tạm nghỉ">Tạm nghỉ</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddEmployee}
              >
                Thêm Nhân Viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa nhân viên */}
      {showEditForm && isManager && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sửa Thông Tin Nhân Viên</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingEmployee(null);
                  resetForm();
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Họ và Tên *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Số điện thoại *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Đang làm việc">Đang làm việc</option>
                    <option value="Tạm nghỉ">Tạm nghỉ</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingEmployee(null);
                  resetForm();
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEditEmployee}
              >
                Cập Nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
