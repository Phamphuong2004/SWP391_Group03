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
        const userLocal = JSON.parse(localStorage.getItem("user"));
        if (!userLocal || !userLocal.token || !userLocal.username) {
          setError("Thông tin đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
          navigate("/login");
          return;
        }

        const response = await axios.get(`/api/user/profile`, {
          headers: { Authorization: `Bearer ${userLocal.token}` },
        });

        const userData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        if (userData) {
          // Final transformation to handle all backend inconsistencies (camelCase vs snake_case)
          const transformedData = {
            email: userData.email,
            phone: userData.phone || userData.phoneNumber,
            full_name: userData.full_name || userData.fullName,
            address: userData.address,
            date_of_birth: userData.date_of_birth || userData.dateOfBirth,
            gender: userData.gender,
            avatar: userData.avatar,
            username: userLocal.username,
          };
          setUser(transformedData);
          setForm(transformedData);
        } else {
          setError(
            "Không thể lấy thông tin người dùng từ server. Sử dụng dữ liệu cục bộ."
          );
          setUser(userLocal);
          setForm(userLocal);
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin cá nhân:", err);
        const userLocal = JSON.parse(localStorage.getItem("user"));
        if (userLocal) {
          setUser(userLocal);
          setForm(userLocal);
          setError(
            "Không thể kết nối tới server. Dữ liệu hiển thị có thể đã cũ."
          );
        } else {
          setError("Lỗi nghiêm trọng. Vui lòng đăng nhập lại.");
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const userLocal = JSON.parse(localStorage.getItem("user"));
      if (!userLocal || !userLocal.token) {
        setError("Lỗi xác thực. Vui lòng đăng nhập lại.");
        return;
      }

      const {
        email,
        phone,
        full_name,
        address,
        date_of_birth,
        gender,
        avatar,
      } = form;

      const updateData = {
        email,
        phone,
        full_name,
        address,
        date_of_birth,
        gender,
        avatar,
      };

      const url = `/api/user/profile/update?username=${encodeURIComponent(
        userLocal.username
      )}`;

      const response = await axios.post(url, updateData, {
        headers: { Authorization: `Bearer ${userLocal.token}` },
      });

      if (response.data) {
        const updatedUser = { ...user, ...updateData };
        setUser(updatedUser);
        setForm(updatedUser);

        const existingUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...existingUser, ...updatedUser })
        );

        setIsEditing(false);
        setSuccess("Cập nhật thành công!");
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setError(err.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user)
    return (
      <div style={{ color: "var(--text-color)" }}>Đang tải thông tin...</div>
    );
  if (error && !user) return <div className="profile-error">{error}</div>;

  console.log("4. Dữ liệu hiện tại trong form state:", form);
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
                form.full_name || "User"
              )}`
            }
            alt="avatar"
            className="profile-avatar-img"
          />
          <div>
            <div className="profile-info-main">{form.full_name}</div>
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
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <label className="profile-form-label">Họ tên</label>
        <input
          className="profile-form-input"
          name="full_name"
          value={form.full_name || ""}
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
          name="date_of_birth"
          type="date"
          value={(form.date_of_birth || "").substring(0, 10)}
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
                const reader = new FileReader();
                reader.onloadend = () => {
                  setForm({ ...form, avatar: reader.result });
                };
                reader.readAsDataURL(file);
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
