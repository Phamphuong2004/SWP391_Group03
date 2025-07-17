import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "USER",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // Validation
    if (!form.fullName || form.fullName.trim() === "") {
      setError("Họ tên không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!form.username || form.username.trim() === "") {
      setError("Tên tài khoản không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!form.email || form.email.trim() === "") {
      setError("Email không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError("Email không đúng định dạng!");
      setIsLoading(false);
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      setIsLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setIsLoading(false);
      return;
    }
    if (!form.phone || !/^[0-9]{10,15}$/.test(form.phone)) {
      setError("Số điện thoại không đúng định dạng!");
      setIsLoading(false);
      return;
    }
    if (!form.address || form.address.trim() === "") {
      setError("Địa chỉ không được để trống!");
      setIsLoading(false);
      return;
    }
    // Map role về đúng giá trị cần lưu trong SQL
    const roleMap = {
      USER: "customer",
      STAFF: "staff",
      MANAGER: "manager",
    };
    const dataToSend = { ...form, role: roleMap[form.role] || "customer" };
    try {
      const response = await axios.post("/api/user/register", dataToSend);
      console.log("Register API response:", response.data);
      if (
        response.data &&
        (response.data.Success === true ||
          (typeof response.data.Message === "string" &&
            response.data.Message.toLowerCase().includes(
              "registered successfully"
            )))
      ) {
        navigate("/register-notification");
      } else {
        const msg =
          response.data?.Message ||
          response.data?.message ||
          "Đăng ký thất bại!";
        setError(msg);
      }
    } catch (error) {
      const msg =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        "Đăng ký thất bại!";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-bg">
        <div className="register-container">
          <div className="register-title">Đăng ký tài khoản</div>
          <form className="register-form" onSubmit={handleSubmit}>
            <label>Họ tên</label>
            <input
              name="fullName"
              placeholder="Họ tên"
              onChange={handleChange}
              value={form.fullName}
              required
            />
            <label>Tên tài khoản</label>
            <input
              name="username"
              placeholder="Tên tài khoản"
              onChange={handleChange}
              value={form.username}
              required
            />
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
              required
            />
            <label>Mật khẩu</label>
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              onChange={handleChange}
              value={form.password}
              required
            />
            <label>Xác nhận mật khẩu</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu"
              onChange={handleChange}
              value={form.confirmPassword}
              required
            />
            <label>Số điện thoại</label>
            <input
              name="phone"
              placeholder="Số điện thoại"
              onChange={handleChange}
              value={form.phone}
              required
            />
            <label>Địa chỉ</label>
            <input
              name="address"
              placeholder="Địa chỉ"
              onChange={handleChange}
              value={form.address}
              required
            />
            <label>Vai trò</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="USER">Người dùng</option>
              <option value="STAFF">Nhân viên</option>
              <option value="MANAGER">Quản lý</option>
            </select>
            {error && (
              <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
            )}
            {successMessage && (
              <div style={{ color: "green", marginBottom: 8 }}>
                {successMessage}
              </div>
            )}
            <button
              className="register-btn"
              type="submit"
              disabled={isLoading || !!successMessage}
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
            style={{
              marginTop: "10px",
              background: "#fff",
              color: "#2193b0",
              border: "2px solid #2193b0",
            }}
            disabled={!!successMessage}
          >
            Đã có tài khoản? Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
