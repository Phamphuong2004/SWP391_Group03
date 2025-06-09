import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("https://6846474a7dbda7ee7aae992c.mockapi.io/api/Login/Users");
      const users = response.data;

      const user = users.find(
        (user) => (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Đã xảy ra lỗi khi đăng nhập!");
    }
  };

  const responseGoogleSuccess = (credentialResponse) => {
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
    <div
      className="login-page"
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url("https://img.lovepik.com/photo/40088/2192.jpg_wh860.jpg") no-repeat center center fixed`,
        backgroundSize: "cover",
      }}
    >
      <div className="login-split-bg">
        <div className="login-left">
          <div className="service-card-home">
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