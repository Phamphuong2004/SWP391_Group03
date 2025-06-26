import React, { useState } from "react";
import { updateRole } from "./AccountApi";
import { useNavigate } from "react-router-dom";
import "./UpdateRoleForm.css";

export default function UpdateRoleForm() {
  const [username, setUsername] = useState("");
  const [newRole, setNewRole] = useState("customer");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await updateRole({ username, newRole });
      setSuccess("Cập nhật role thành công!");
      setUsername("");
      setNewRole("customer");
      setTimeout(() => {
        navigate("/account-management");
      }, 1200);
    } catch (err) {
      setError("Cập nhật role thất bại!");
    }
  };

  return (
    <div className="update-role-form-outer">
      <div className="update-role-form-center">
        <h1 className="update-role-main-title">Cập nhật Role cho tài khoản</h1>
        <div className="update-role-form-container">
          <h2>Cập nhật Role</h2>
          {success && <div className="success-msg">{success}</div>}
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role mới</label>
              <select
                id="role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                required
              >
                <option value="manager">manager</option>
                <option value="staff">staff</option>
                <option value="customer">customer</option>
              </select>
            </div>
            <button type="submit">Cập nhật</button>
          </form>
        </div>
      </div>
    </div>
  );
}
