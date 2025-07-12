import React, { useState } from "react";
import "./KitManagement.css";
import {
  getKitByServiceId,
  createKitComponent,
  deleteKitComponent,
  updateKitComponent,
} from "./KitApi";

const KitManagement = () => {
  const [serviceId, setServiceId] = useState("");
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    componentName: "",
    quantity: "",
    introduction: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [editingKit, setEditingKit] = useState(null);

  const fetchKits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getKitByServiceId(serviceId);
      setKits(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Không thể lấy danh sách kit!");
      setKits([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddKit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createKitComponent(serviceId, form);
      setForm({ componentName: "", quantity: "", introduction: "" });
      setRefresh((r) => !r);
    } catch (err) {
      setError("Thêm kit thất bại!");
    }
  };

  const handleEdit = (kit) => {
    setEditingKit(kit);
    setForm({
      componentName: kit.componentName || "",
      quantity:
        kit.quantity !== undefined && kit.quantity !== null ? kit.quantity : "",
      introduction: kit.introduction || "",
    });
  };

  const handleUpdateKit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateKitComponent(
        editingKit.kitComponentId || editingKit.id,
        form
      );
      setEditingKit(null);
      setForm({ componentName: "", quantity: "", introduction: "" });
      setRefresh((r) => !r);
    } catch (err) {
      setError("Cập nhật kit thất bại!");
    }
  };

  const handleCancelEdit = () => {
    setEditingKit(null);
    setForm({ componentName: "", quantity: "", introduction: "" });
  };

  const handleDelete = async (kitComponentId) => {
    setError(null);
    try {
      await deleteKitComponent(kitComponentId);
      setRefresh((r) => !r);
    } catch (err) {
      setError("Xóa kit thất bại!");
    }
  };

  React.useEffect(() => {
    if (serviceId) fetchKits();
    // eslint-disable-next-line
  }, [serviceId, refresh]);

  return (
    <div className="kit-management-card">
      <h2 className="kit-management-title">Quản lý Kit</h2>
      <div className="kit-management-serviceid-row">
        <label htmlFor="serviceId">Nhập mã dịch vụ:</label>
        <div className="serviceid-input-group">
          <input
            id="serviceId"
            className="kit-service-id-input"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            placeholder="Nhập mã dịch vụ"
          />
          <button
            className="btn-load-kit"
            onClick={fetchKits}
            disabled={!serviceId}
          >
            Tải kit
          </button>
        </div>
      </div>
      {error && <div className="kit-management-error">{error}</div>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table
          className="kit-management-table"
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Tên kit</th>
              <th>Số lượng</th>
              <th>Hướng dẫn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {kits.length === 0 ? (
              <tr>
                <td colSpan="4">Không có kit nào</td>
              </tr>
            ) : (
              kits.map((kit) => (
                <tr key={kit.kitComponentId || kit.id}>
                  <td>{kit.componentName}</td>
                  <td>{kit.quantity}</td>
                  <td>{kit.introduction}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(kit)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(kit.kitComponentId || kit.id)}
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
      <h3 className="kit-management-subtitle">
        {editingKit ? "Cập nhật kit" : "Thêm kit mới"}
      </h3>
      <form
        className="kit-management-form"
        onSubmit={editingKit ? handleUpdateKit : handleAddKit}
      >
        <div className="form-group">
          <label htmlFor="componentName">Tên kit</label>
          <input
            id="componentName"
            name="componentName"
            placeholder="Tên kit"
            value={form.componentName ?? ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Số lượng</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            placeholder="Số lượng"
            value={form.quantity ?? ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="introduction">Hướng dẫn</label>
          <input
            id="introduction"
            name="introduction"
            placeholder="Hướng dẫn"
            value={form.introduction ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={!serviceId}>
            {editingKit ? "Cập nhật kit" : "Thêm kit"}
          </button>
          {editingKit && (
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancelEdit}
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default KitManagement;
