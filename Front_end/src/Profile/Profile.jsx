import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [avatarOption, setAvatarOption] = useState("url");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/user/profile", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.data && Object.keys(response.data).length > 0) {
          setUser(response.data);
          setForm(response.data);
        } else {
          const userLocal = JSON.parse(localStorage.getItem("user"));
          if (userLocal) {
            setUser(userLocal);
            setForm(userLocal);
          } else {
            setError("Không thể lấy thông tin người dùng!");
          }
        }
      } catch (err) {
        const userLocal = JSON.parse(localStorage.getItem("user"));
        if (userLocal) {
          setUser(userLocal);
          setForm(userLocal);
        } else {
          setError("Bạn không có quyền truy cập trang này (403 Forbidden).");
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const {
        email,
        phoneNumber,
        fullName,
        address,
        dateOfBirth,
        gender,
        avatar,
        username,
      } = form;
      const updateData = {
        email,
        phoneNumber,
        fullName,
        address,
        dateOfBirth,
        gender,
        avatar,
      };
      const url = `/api/user/profile/update?username=${encodeURIComponent(
        username
      )}`;
      const response = await axios.post(url, updateData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.data) {
        setUser({ ...user, ...updateData });
        setForm({ ...form, ...updateData });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, ...updateData })
        );
        setIsEditing(false);
        setSuccess("Cập nhật thành công!");
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (err) {
      setError("Cập nhật thất bại!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <div>Đang tải thông tin...</div>;
  if (error) return <div className="profile-error">{error}</div>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Thông tin cá nhân</h2>
      {success && <div className="profile-success">{success}</div>}
      {error && <div className="profile-error">{error}</div>}
      <form className="profile-form" onSubmit={handleSave}>
        <div className="profile-avatar-row">
          <img
            src={
              form.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                form.fullName || "User"
              )}`
            }
            alt="avatar"
            className="profile-avatar-img"
          />
          <div>
            <div className="profile-info-main">{form.fullName}</div>
            <div className="profile-info-sub">{form.email}</div>
          </div>
        </div>
        <label className="profile-form-label">Email</label>
        <input
          className="profile-form-input"
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <label className="profile-form-label">Số điện thoại</label>
        <input
          className="profile-form-input"
          name="phoneNumber"
          value={form.phoneNumber || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <label className="profile-form-label">Họ tên</label>
        <input
          className="profile-form-input"
          name="fullName"
          value={form.fullName || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <label className="profile-form-label">Địa chỉ</label>
        <input
          className="profile-form-input"
          name="address"
          value={form.address || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <label className="profile-form-label">Ngày sinh</label>
        <input
          className="profile-form-input"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth ? form.dateOfBirth.substring(0, 10) : ""}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <label className="profile-form-label">Giới tính</label>
        <select
          className="profile-form-input"
          name="gender"
          value={form.gender || ""}
          onChange={handleChange}
          disabled={!isEditing}
        >
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
        <label className="profile-form-label">Avatar</label>
        {isEditing && (
          <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
            <label>
              <input
                type="radio"
                name="avatarOption"
                value="url"
                checked={avatarOption === "url"}
                onChange={() => setAvatarOption("url")}
                disabled={!isEditing}
              />
              Dán link ảnh
            </label>
            <label>
              <input
                type="radio"
                name="avatarOption"
                value="file"
                checked={avatarOption === "file"}
                onChange={() => setAvatarOption("file")}
                disabled={!isEditing}
              />
              Chọn từ thiết bị
            </label>
          </div>
        )}
        {(!isEditing || avatarOption === "url") && (
          <input
            className="profile-form-input"
            name="avatar"
            value={form.avatar || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Dán link ảnh"
            style={{ marginBottom: 8 }}
          />
        )}
        {isEditing && avatarOption === "file" && (
          <input
            type="file"
            accept="image/*"
            className="profile-form-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                setForm({ ...form, avatar: url });
              }
            }}
          />
        )}
        {!isEditing ? (
          <button
            type="button"
            className="profile-btn-main"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="profile-btn-main"
              style={{ marginRight: 8 }}
            >
              Lưu thông tin
            </button>
            <button
              type="button"
              className="profile-btn-main profile-btn-cancel"
              onClick={() => {
                setIsEditing(false);
                setForm(user);
              }}
            >
              Hủy
            </button>
          </>
        )}
      </form>
      <button className="profile-btn-logout" onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
}
