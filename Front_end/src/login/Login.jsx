import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả sử thông tin user trả về từ API:
    const userInfo = {
      name: "Tên Người Dùng",
      username: usernameOrEmail,
      avatar:
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(usernameOrEmail),
    };
    // Lưu user vào localStorage
    localStorage.setItem("user", JSON.stringify(userInfo));
    toast.success("Đăng nhập thành công!");
    setTimeout(() => {
      navigate("/");
    }, 1500); // 1.5 giây sau về trang chủ
  };

  const responseGoogleSuccess = (credentialResponse) => {
    // Parse thông tin từ Google (ví dụ, tuỳ API của bạn)
    const userInfo = {
      name: "Tên Google",
      username: "google_user",
      avatar: "link_avatar_google",
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    toast.success("Đăng nhập thành công!");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const responseGoogleFailure = () => {
    alert("Google login thất bại!");
  };

  return (
    <div className="login-page">
      <div className="login-split-bg">
        <div className="login-left">
          <div className="service-card-home">
            <img
              src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
              alt="Dịch vụ xét nghiệm ADN"
              className="login-service-img"
            />
            <h2>Dịch vụ xét nghiệm ADN</h2>
            <p>Chính xác - Bảo mật - Nhanh chóng</p>
          </div>
        </div>
        <div className="login-right">
          <div className="login-container">
            <h2 className="login-title">Đăng nhập</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-group">
                <label htmlFor="username">Tài khoản</label>
                <input
                  id="username"
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="login-btn" type="submit">
                Đăng nhập
              </button>
              <div className="google-login-wrapper">
                <GoogleLogin
                  onSuccess={responseGoogleSuccess}
                  onError={responseGoogleFailure}
                  width="100%"
                  text="signin_with"
                  shape="rectangular"
                  locale="vi"
                  theme="outline"
                />
              </div>
              <button
                type="button"
                className="login-btn"
                style={{
                  marginTop: "10px",
                  background: "#fff",
                  color: "#2193b0",
                  border: "2px solid #2193b0",
                }}
                onClick={() => navigate("/")}
              >
                Quay về trang chủ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
