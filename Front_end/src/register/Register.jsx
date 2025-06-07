import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { registerAccount as defaultAccounts } from "../RegisterAccount";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatar: "",
    role: "user", // mặc định là user
  });
  const [accounts, setAccounts] = useState(() => {
    const local = localStorage.getItem("registerAccount");
    return local ? JSON.parse(local) : defaultAccounts;
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra trùng username/email
    const isExist = accounts.some(
      (acc) => acc.username === form.username || acc.email === form.email
    );
    if (isExist) {
      alert("Tên tài khoản hoặc email đã tồn tại!");
      return;
    }
    // Thêm user mới vào mảng registerAccount
    const newAccount = {
      ...form,
      avatar:
        form.avatar?.trim() !== ""
          ? form.avatar
          : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      id: (accounts.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };
    accounts.push(newAccount);
    localStorage.setItem("registerAccount", JSON.stringify(accounts));
    setAccounts([...accounts]);
    alert("Đăng ký thành công!");
    navigate("/login");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-bg">
        <div className="register-container">
          <div className="register-title">Đăng ký tài khoản</div>
          <form className="register-form" onSubmit={handleSubmit}>
            <label>Họ tên</label>
            <input
              name="name"
              placeholder="Họ tên"
              onChange={handleChange}
              required
            />
            <label>Tên tài khoản</label>
            <input
              name="username"
              placeholder="Tên tài khoản"
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <label>Mật khẩu</label>
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              onChange={handleChange}
              required
            />
            <label>Số điện thoại</label>
            <input
              name="phone"
              placeholder="Số điện thoại"
              onChange={handleChange}
              required
            />
            <label>Địa chỉ</label>
            <input
              name="address"
              placeholder="Địa chỉ"
              onChange={handleChange}
              required
            />
            <label>Avatar (tùy chọn)</label>
            <input
              name="avatar"
              placeholder="Link ảnh đại diện (nếu có)"
              onChange={handleChange}
            />
            <label>Vai trò</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Người dùng</option>
              <option value="staff">Nhân viên (Staff)</option>
            </select>
            <button className="register-btn" type="submit">
              Đăng ký
            </button>
          </form>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                console.log(credentialResponse)
              }
              onError={() => console.log("Login Failed")}
            />
          </div>

          <button className="login-btn" onClick={handleLoginRedirect}>
            Đã có tài khoản? Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
