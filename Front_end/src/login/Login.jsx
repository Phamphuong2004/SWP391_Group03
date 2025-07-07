import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(false);
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

      // Lưu token vào localStorage
      localStorage.setItem("token", token);

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

      const profileResponse = await axios.get(
        "http://localhost:8080/api/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const profileData = profileResponse.data;
      const userWithProfile = { ...userToStore, ...profileData };
      localStorage.setItem("user", JSON.stringify(userWithProfile));
      window.dispatchEvent(new Event("userUpdated"));
      await recordLoginHistory(
        userWithProfile.id,
        "success",
        userWithProfile.token
      );

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
        const profileResponse = await axios.get(
          "http://localhost:8080/api/user/profile",
          {
            headers: { Authorization: `Bearer ${userData.token}` },
          }
        );
        const profileData = profileResponse.data;
        const userWithProfile = { ...userData, ...profileData };
        localStorage.setItem("user", JSON.stringify(userWithProfile));
        localStorage.setItem("token", userData.token);
        window.dispatchEvent(new Event("userUpdated"));

        // Record successful Google login
        await recordLoginHistory(
          userWithProfile.id,
          "success",
          userWithProfile.token
        );

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
    <div className="login-split-root">
      <div className="login-split-left">
        <div className="login-welcome-block">
          <div className="login-welcome-title">Welcome Back!</div>
          <div className="login-welcome-desc">
            Đăng nhập để tiếp tục trải nghiệm hệ thống ADN Testing
          </div>
        </div>
      </div>
      <div className="login-split-right">
        <div className="login-form-container">
          <div className="login-title">Đăng nhập</div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
              <span className="input-icon">
                <FaUser />
              </span>
            </div>
            <div className="login-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className="input-icon">
                <FaLock />
              </span>
            </div>
            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Ghi nhớ đăng nhập
              </label>
              <span
                className="login-link"
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </span>
            </div>
            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
          <div className="login-signup">
            Chưa có tài khoản?
            <a onClick={() => navigate("/register")}>Đăng ký ngay</a>
          </div>
        </div>
      </div>
    </div>
  );
}
