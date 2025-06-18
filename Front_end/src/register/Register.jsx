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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post("/api/user/register", form);
      console.log("Register response:", response.data);
      if (response.data && response.data.jwt) {
        const userData = {
          ...response.data,
          token: response.data.jwt,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", response.data.jwt);
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
            {error && (
              <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
            )}
            <button className="register-btn" type="submit" disabled={isLoading}>
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
          >
            Đã có tài khoản? Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
