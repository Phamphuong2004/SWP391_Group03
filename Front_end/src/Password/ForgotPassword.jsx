import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ForgotPassword.css";
import { FaPhoneAlt, FaLock } from "react-icons/fa";

function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!phoneNumber || phoneNumber.trim() === "") {
      toast.error("Số điện thoại không được để trống!");
      return;
    }
    if (!/^[0-9]{10,15}$/.test(phoneNumber)) {
      toast.error("Số điện thoại không đúng định dạng!");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("/api/user/reset-password", {
        phoneNumber,
        newPassword,
        confirmPassword,
      });
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
    <div className="forgot-bg">
      <div className="forgot-form-glass">
        <div className="forgot-title">Đặt lại mật khẩu</div>
        <div className="forgot-desc">
          Nhập số điện thoại và mật khẩu mới để đặt lại mật khẩu cho tài khoản
          của bạn.
        </div>
        <form onSubmit={handleSubmit}>
          <div className="forgot-group">
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
            <span className="input-icon">
              <FaPhoneAlt />
            </span>
          </div>
          <div className="forgot-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu mới"
            />
            <span className="input-icon">
              <FaLock />
            </span>
          </div>
          <div className="forgot-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Nhập lại mật khẩu mới"
            />
            <span className="input-icon">
              <FaLock />
            </span>
          </div>
          <button className="forgot-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
          <button
            className="forgot-btn-outline"
            type="button"
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
