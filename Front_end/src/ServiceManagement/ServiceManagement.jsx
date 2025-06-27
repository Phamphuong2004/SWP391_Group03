import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceManagement.css";

const emptyService = { name: "", description: "", type: "", price: "" };

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // 'add' | 'edit'
  const [formData, setFormData] = useState(emptyService);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch all services
  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/services/view-all-service", {
        headers: authHeader,
      });
      setServices(res.data || []);
    } catch (err) {
      setError("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Search by name
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return fetchServices();
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `/api/services/search-by-name?name=${encodeURIComponent(search)}`,
        { headers: authHeader }
      );
      setServices(res.data || []);
    } catch (err) {
      setError("Không tìm thấy dịch vụ phù hợp.");
    } finally {
      setLoading(false);
    }
  };

  // Open form for add/edit
  const openForm = (mode, service) => {
    setFormMode(mode);
    setShowForm(true);
    setFormData(service ? { ...service } : emptyService);
    setEditingId(service ? service.serviceId : null);
  };

  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Validate
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.type.trim() ||
      formData.price === ""
    ) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      setLoading(false);
      return;
    }
    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      setError("Giá phải là số dương.");
      setLoading(false);
      return;
    }
    // Chuẩn hóa body
    const body = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type.trim(),
      price: Number(formData.price),
    };
    try {
      if (formMode === "add") {
        await axios.post("/api/services/add-service", body, {
          headers: authHeader,
        });
        setSuccessMsg("Thêm dịch vụ thành công!");
      } else {
        await axios.put(`/api/services/update-service/${editingId}`, body, {
          headers: authHeader,
        });
        setSuccessMsg("Cập nhật dịch vụ thành công!");
      }
      setShowForm(false);
      fetchServices();
    } catch (err) {
      setError("Có lỗi khi lưu dịch vụ.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  // Delete service
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`/api/services/delete-service/${id}`, {
        headers: authHeader,
      });
      setSuccessMsg("Xóa dịch vụ thành công!");
      fetchServices();
    } catch (err) {
      setError("Không thể xóa dịch vụ.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  return (
    <div className="service-mgmt-container">
      <h1>Quản lý Dịch vụ</h1>
      <form className="service-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Tìm kiếm</button>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            fetchServices();
          }}
        >
          Tải lại
        </button>
      </form>
      <button className="add-btn" onClick={() => openForm("add")}>
        + Thêm dịch vụ
      </button>
      {error && <div className="error-msg">{error}</div>}
      {successMsg && <div className="success-msg">{successMsg}</div>}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <table className="service-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên dịch vụ</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr key="no-data">
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Không có dịch vụ nào.
                </td>
              </tr>
            ) : (
              services.map((s, idx) => (
                <tr key={s.serviceId || idx}>
                  <td>{s.service_id}</td>
                  <td>{s.service_name}</td>
                  <td>{s.description}</td>
                  <td>{s.price}</td>
                  <td>{s.service_type}</td>
                  <td>
                    <button onClick={() => openForm("edit", s)}>Sửa</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(s.serviceId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {showForm && (
        <div className="modal-bg" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{formMode === "add" ? "Thêm dịch vụ" : "Sửa dịch vụ"}</h2>
            <form onSubmit={handleFormSubmit} className="service-form">
              <label>Tên dịch vụ</label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
              />
              <label>Mô tả</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
              />
              <label>Loại</label>
              <input
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, type: e.target.value }))
                }
              />
              <label>Giá</label>
              <input
                required
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, price: e.target.value }))
                }
              />
              <div className="form-actions">
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
