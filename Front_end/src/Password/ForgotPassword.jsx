import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/user/forgot-password", { email });
      if (response.data) {
        toast.success("Link reset mật khẩu đã được gửi đến email của bạn!");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      toast.error(
        "Gửi link reset mật khẩu thất bại. Vui lòng kiểm tra lại email!"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Nhập email của bạn"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Đang gửi..." : "Gửi link reset mật khẩu"}
        </button>
        <button type="button" onClick={() => navigate("/login")}>
          Quay lại đăng nhập
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
