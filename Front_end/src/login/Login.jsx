import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState(""); // Đổi tên biến
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const recordLoginHistory = async (userId, status, token) => {
    try {
      const deviceInfo = `${navigator.platform} - ${navigator.userAgent}`;
      const payload = {
        status,
        deviceInfo,
        loginTime: new Date().toISOString(),
        userId,
      };
      await axios.post("/api/user/login-history", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error recording login history:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Get the token from the auth endpoint
      const authResponse = await axios.post("/api/auth/login", {
        username,
        password,
      });

      const token = authResponse.data.jwt || authResponse.data.token;

      if (!token) {
        toast.error("Không nhận được token xác thực.");
        setIsLoading(false);
        return;
      }

      // Step 2: Use the token to get the user's role from the user endpoint
      const userResponse = await axios.post(
        "/api/user/login",
        { username, password }, // The endpoint might still need credentials
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userRole = userResponse.data.role;

      if (!userRole) {
        toast.error("Không thể lấy được vai trò người dùng.");
        setIsLoading(false);
        return;
      }

      // Step 3: Decode token for user info and combine everything
      const decodedToken = jwtDecode(token);
      const userToStore = {
        id: decodedToken.id,
        username: decodedToken.sub,
        name: decodedToken.name,
        role: userRole,
        token: token,
      };

      localStorage.setItem("user", JSON.stringify(userToStore));
      await recordLoginHistory(userToStore.id, "success", userToStore.token);

      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        error.response?.data?.message ||
          "Tên đăng nhập hoặc mật khẩu không đúng!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const responseGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("/api/auth/google", {
        credential: credentialResponse.credential,
      });

      if (response.data) {
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);

        // Record successful Google login
        await recordLoginHistory(userData.id, "success", userData.token);

        toast.success("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Google login error:", error);
      // Record failed Google login
      await recordLoginHistory(null, "failed", null);
      toast.error("Đăng nhập bằng Google thất bại!");
    }
  };

  const responseGoogleFailure = async () => {
    // Record failed Google login
    await recordLoginHistory(null, "failed", null);
    toast.error("Đăng nhập bằng Google thất bại!");
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
              <div className="login-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <button className="login-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
              <button
                type="button"
                className="login-btn"
                style={{
                  marginTop: "10px",
                  background: "#fff",
                  color: "#2193b0",
                  border: "2px solid #2193b0",
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu
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
