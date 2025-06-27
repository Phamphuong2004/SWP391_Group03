import React, { useEffect, useState } from "react";
import "./AccountManagement.css";
import {
  getAllAccounts,
  updateAccount,
  deleteAccount,
  updateRole,
} from "./AccountApi";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showRole, setShowRole] = useState(false);
  const [roleData, setRoleData] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

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

  // useEffect chỉ reload khi vào trang hoặc khi isManager thay đổi
  useEffect(() => {
    if (!isManager) return;
    reload();
  }, [isManager]);

  // Khi bấm Sửa, chỉ set state, không reload
  const handleEdit = (acc) => {
    setEditData({ ...acc });
    setShowEdit(true);
  };

  // Khi bấm Cập nhật role, chỉ set state, không reload
  const handleRole = (acc) => {
    setRoleData({ id: acc.userId, role: acc.role });
    setShowRole(true);
  };

  // Chỉ reload sau khi submit form thành công
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAccount(editData.userId, editData);
      setShowEdit(false);
      setEditData(null);
      setSuccessMsg("Cập nhật tài khoản thành công!");
      reload();
    } catch {
      setError("Lỗi khi cập nhật tài khoản.");
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRole(roleData);
      setShowRole(false);
      setRoleData(null);
      setSuccessMsg("Cập nhật role thành công!");
      reload();
    } catch {
      setError("Lỗi khi cập nhật role.");
    }
  };

  const handleDelete = async (userId) => {
    if (!userId) {
      setError("Không xác định được tài khoản cần xóa.");
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await deleteAccount(userId);
      setSuccessMsg("Xóa tài khoản thành công!");
      reload();
    } catch {
      setError("Lỗi khi xóa tài khoản.");
    }
  };

  if (!isManager) {
    return (
      <div className="account-mgmt-container">
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="account-mgmt-container">
        Đang tải danh sách tài khoản...
      </div>
    );
  }

  if (error) {
    return <div className="account-mgmt-container">{error}</div>;
  }

  // Thêm log kiểm tra state trước khi render modal
  console.log("showEdit:", showEdit, "editData:", editData);

  return (
    <div className="account-mgmt-container">
      <h1>Quản lý Tài khoản</h1>
      {successMsg && <div className="success-msg">{successMsg}</div>}
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
          {accounts.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Không có tài khoản nào.
              </td>
            </tr>
          ) : (
            accounts.map((acc, idx) => {
              console.log(acc); // Debug: kiểm tra object acc có userId không
              return (
                <tr key={acc.userId || idx}>
                  <td>{acc.userId}</td>
                  <td>{acc.username}</td>
                  <td>{acc.email}</td>
                  <td>{acc.role}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(acc)}
                    >
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
                      onClick={() => handleRole(acc)}
                    >
                      Cập nhật role
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/* Modal sửa tài khoản */}
      {showEdit && (
        <div className="modal-bg" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Sửa tài khoản</h2>
            <form onSubmit={handleEditSubmit} className="account-form">
              <label>Tên đăng nhập</label>
              <input
                value={editData?.username || ""}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, username: e.target.value }))
                }
              />
              <label>Email</label>
              <input
                value={editData?.email || ""}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, email: e.target.value }))
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
      {/* Modal cập nhật role */}
      {showRole && (
        <div className="modal-bg" onClick={() => setShowRole(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Cập nhật role</h2>
            <form onSubmit={handleRoleSubmit} className="account-form">
              <label>Role</label>
              <select
                value={roleData.role}
                onChange={(e) =>
                  setRoleData((d) => ({ ...d, role: e.target.value }))
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
    </div>
  );
}
