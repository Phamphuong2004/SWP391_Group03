import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [form, setForm] = useState(user);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarOption, setAvatarOption] = useState("url"); // "url" hoặc "file"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/user/profile", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.data) {
          console.log("PROFILE DATA:", response.data);
          setUser({
            ...response.data,
            name: response.data.name || response.data.fullName || "",
            username: response.data.username || response.data.userName || "",
          });
          setForm({
            ...response.data,
            name: response.data.name || response.data.fullName || "",
            username: response.data.username || response.data.userName || "",
          });
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/user/profile/update", form, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.data) {
        setUser(form);
        localStorage.setItem("user", JSON.stringify(form));
        setSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      alert("Cập nhật thông tin thất bại!");
      console.error(error);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("userFullName");
      localStorage.removeItem("token");
      setUser({
        name: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        avatar: "",
      });
      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        avatar: "",
      });
      alert("Tài khoản đã được xóa.");
      navigate("/login");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      {success && (
        <div
          style={{
            marginBottom: 18,
            padding: "12px 18px",
            background: "#d4edda",
            color: "#155724",
            borderRadius: 8,
            fontWeight: 500,
            textAlign: "center",
            border: "1.5px solid #c3e6cb",
            fontSize: 16,
            letterSpacing: 0.2,
          }}
        >
          Đã cập nhật thông tin thành công!
        </div>
      )}
      <div className="profile-title">Thông tin cá nhân</div>
      <Form onSubmit={handleSave}>
        <div className="profile-avatar-row">
          <img
            src={
              form.avatar ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(form.name)
            }
            alt="avatar"
            className="profile-avatar-img"
          />
          <div>
            <div className="profile-info-main">{form.name}</div>
            <div className="profile-info-sub">{form.username}</div>
          </div>
        </div>
        <Form.Group className="mb-3">
          <Form.Label className="profile-form-label">Họ tên</Form.Label>
          <Form.Control
            className="profile-form-input"
            name="name"
            value={form.name}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="profile-form-label">Tên đăng nhập</Form.Label>
          <Form.Control
            className="profile-form-input"
            name="username"
            value={form.username}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="profile-form-label">Email</Form.Label>
          <Form.Control
            className="profile-form-input"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="profile-form-label">Số điện thoại</Form.Label>
          <Form.Control
            className="profile-form-input"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="profile-form-label">Địa chỉ</Form.Label>
          <Form.Control
            className="profile-form-input"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="profile-form-label">Avatar</Form.Label>
          {isEditing && (
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <Form.Check
                type="radio"
                label="Dán link ảnh"
                name="avatarOption"
                id="avatar-url"
                checked={avatarOption === "url"}
                onChange={() => setAvatarOption("url")}
              />
              <Form.Check
                type="radio"
                label="Đính kèm ảnh"
                name="avatarOption"
                id="avatar-file"
                checked={avatarOption === "file"}
                onChange={() => setAvatarOption("file")}
              />
            </div>
          )}
          <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
            {(!isEditing || avatarOption === "url") && (
              <Form.Control
                className="profile-form-input"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="Dán link ảnh"
                style={{ marginBottom: 8 }}
              />
            )}
            {isEditing && avatarOption === "file" && (
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const url = URL.createObjectURL(file);
                    setForm({ ...form, avatar: url });
                  }
                }}
              />
            )}
          </div>
        </Form.Group>
        {!isEditing ? (
          <Button
            type="button"
            className="profile-btn-main"
            style={{
              background: "linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)",
            }}
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              className="profile-btn-main"
              style={{ marginRight: 8 }}
            >
              Lưu thông tin
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="profile-btn-main"
              style={{
                background: "#ccc",
                color: "#333",
                marginLeft: 8,
              }}
              onClick={() => {
                setIsEditing(false);
                setForm(user); // reset lại dữ liệu nếu hủy chỉnh sửa
              }}
            >
              Hủy
            </Button>
          </>
        )}
      </Form>
      <Button
        variant="danger"
        onClick={handleDeleteAccount}
        className="profile-btn-danger"
      >
        Xóa tài khoản
      </Button>
    </div>
  );
}

export default Profile;
