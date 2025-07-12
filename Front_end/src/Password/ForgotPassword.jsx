import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(
        "/api/user/reset-password",
        {
          phoneNumber,
          newPassword,
          confirmPassword,
        },
        { headers }
      );
      if (response.data && response.data.Success === true) {
        toast.success(response.data.Message || "Đặt lại mật khẩu thành công!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(response.data?.Message || "Đặt lại mật khẩu thất bại!");
      }
    } catch (error) {
      toast.error(
        "Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại số điện thoại hoặc thử lại!"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phoneNumber">Số điện thoại</label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="Nhập số điện thoại của bạn"
            pattern="[0-9]{10,15}"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Nhập mật khẩu mới"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
        <button type="button" onClick={() => navigate("/login")}>
          Quay lại đăng nhập
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
