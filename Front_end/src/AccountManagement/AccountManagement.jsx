import React, { useEffect, useState } from "react";
import "./AccountManagement.css";
import {
  getAllAccounts,
  updateAccount,
  deleteAccount,
  updateRole,
} from "./AccountApi";
import { useNavigate } from "react-router-dom";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showRole, setShowRole] = useState(false);
  const [roleData, setRoleData] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  // Lấy role từ localStorage
  let isManager = false;
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      isManager = user.role && user.role.toLowerCase() === "manager";
    }
  } catch (e) {
    isManager = false;
  }

  const reload = () => {
    setLoading(true);
    getAllAccounts()
      .then((data) => {
        setAccounts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Không thể tải danh sách tài khoản.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isManager) return;
    reload();
  }, [isManager]);

  const handleEdit = (acc) => {
    setEditData({ ...acc });
    setShowEdit(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
    try {
      await deleteAccount(id);
      setSuccessMsg("Xóa tài khoản thành công!");
      setError("");
      reload();
    } catch (err) {
      // Lấy message chi tiết từ backend nếu có
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Lỗi khi xóa tài khoản.";
      setError(msg);
    }
  };

  const handleRole = (acc) => {
    setRoleData({ username: acc.username, newRole: acc.role });
    setShowRole(true);
  };

  const validateEditData = () => {
    if (!editData.username || editData.username.trim() === "") {
      setError("Tên đăng nhập không được để trống.");
      return false;
    }
    if (!editData.email || editData.email.trim() === "") {
      setError("Email không được để trống.");
      return false;
    }
    // Đơn giản: kiểm tra email có @
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(editData.email)) {
      setError("Email không đúng định dạng.");
      return false;
    }
    if (!editData.role || editData.role.trim() === "") {
      setError("Role không được để trống.");
      return false;
    }
    return true;
  };

  const validateRoleData = () => {
    if (!roleData.username || roleData.username.trim() === "") {
      setError("Tên đăng nhập không được để trống.");
      return false;
    }
    if (!roleData.newRole || roleData.newRole.trim() === "") {
      setError("Role không được để trống.");
      return false;
    }
    return true;
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRoleData()) return;
    try {
      await updateRole({
        username: roleData.username,
        newRole: roleData.newRole,
      });
      setShowRole(false);
      setRoleData(null);
      setSuccessMsg("Cập nhật role thành công!");
      setError("");
      reload();
    } catch {
      setError("Lỗi khi cập nhật role.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditData()) return;
    try {
      await updateAccount(editData.userId, editData);
      setShowEdit(false);
      setEditData(null);
      setSuccessMsg("Cập nhật tài khoản thành công!");
      setError("");
      reload();
    } catch {
      setError("Lỗi khi cập nhật tài khoản.");
    }
  };

  return (
    <div className="account-mgmt-container">
      <h2>Quản lý Tài khoản</h2>
      {successMsg && <div className="success-msg">{successMsg}</div>}
      {error && (
        <div
          className="success-msg"
          style={{ background: "#f8d7da", color: "#721c24" }}
        >
          {error}
        </div>
      )}
      <button className="add-btn">+ Thêm tài khoản</button>
      <table className="account-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Role</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.userId}>
              <td>{acc.userId}</td>
              <td>{acc.username}</td>
              <td>{acc.email}</td>
              <td>{acc.role}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(acc)}>
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(acc.userId)}
                >
                  Xóa
                </button>
                <button
                  className="edit-btn"
                  onClick={() => navigate("/update-role")}
                >
                  Cập nhật role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal cập nhật role */}
      {showRole && roleData && (
        <div className="modal-bg" onClick={() => setShowRole(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Cập nhật role</h2>
            <form onSubmit={handleRoleSubmit} className="account-form">
              <label>Role</label>
              <select
                value={roleData.newRole}
                onChange={(e) =>
                  setRoleData((d) => ({ ...d, newRole: e.target.value }))
                }
              >
                <option value="manager">manager</option>
                <option value="staff">staff</option>
                <option value="customer">customer</option>
              </select>
              <div className="form-actions">
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setShowRole(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal sửa tài khoản */}
      {showEdit && editData && (
        <div className="modal-bg" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Sửa tài khoản</h2>
            <form onSubmit={handleEditSubmit} className="account-form">
              <label>Tên đăng nhập</label>
              <input
                value={editData.username}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, username: e.target.value }))
                }
              />
              <label>Email</label>
              <input
                value={editData.email}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, email: e.target.value }))
                }
              />
              <label>Role</label>
              <input
                value={editData.role}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, role: e.target.value }))
                }
              />
              <div className="form-actions">
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setShowEdit(false)}>
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
