import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import provinces from "../Provinces";
import ADNTestingServices from "../listOfServices";
import "./Booking.css";
import { useNavigate } from "react-router-dom";

const genders = ["Nam", "Nữ", "Khác"];

function Booking() {
  const [form, setForm] = useState({
    name: "",
    dob: null,
    phone: "",
    email: "",
    gender: "",
    service: "Tại nhà",
    province: "",
    district: "",
    address: "",
    testType: "",
    time: "",
    note: "",
  });

  const [districts, setDistricts] = useState([]);
  const [type, setType] = useState("dan-su");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "province") {
      const selected = provinces.find((p) => p.name === value);
      setDistricts(selected ? selected.districts : []);
      setForm((prev) => ({
        ...prev,
        province: value,
        district: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    // alert("Đăng ký thành công!"); // XÓA DÒNG NÀY
    handleBookingSuccess();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleBookingSuccess = () => {
    // ...xử lý lưu thông tin đặt lịch...
    navigate("/register-notification");
  };

  return (
    <>
      <form className="booking-form" onSubmit={handleSubmit}>
        <h2 className="booking-title">Đăng ký xét nghiệm ADN</h2>
        <div className="booking-row">
          <div className="booking-col">
            <label>
              Họ và tên
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </label>
            <label>
              Số điện thoại
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </label>
            <label>
              Giới tính
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Chọn giới tính</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <div className="booking-service">
              <span>Chọn dịch vụ xét nghiệm</span>
              <div className="booking-service-options">
                <label>
                  <input
                    type="radio"
                    name="service"
                    value="Tại nhà"
                    checked={form.service === "Tại nhà"}
                    onChange={handleChange}
                  />{" "}
                  Tại nhà
                </label>
                <label>
                  <input
                    type="radio"
                    name="service"
                    value="Tại cơ sở"
                    checked={form.service === "Tại cơ sở"}
                    onChange={handleChange}
                  />{" "}
                  Tại cơ sở
                </label>
              </div>
              {/* Nếu chọn "Tại cơ sở" thì hiển thị upload file */}
              {form.service === "Tại cơ sở" && (
                <label style={{ marginTop: 12, display: "block" }}>
                  Đính kèm file dấu vân tay:
                  <input
                    type="file"
                    name="fingerprint"
                    accept=".jpg,.png,.pdf"
                  />
                </label>
              )}
            </div>
            <label>
              Tỉnh lấy mẫu
              <select
                name="province"
                value={form.province}
                onChange={handleChange}
                required
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Địa chỉ
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
                required
              />
            </label>
            <label>
              Nội dung yêu cầu
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Nhập nội dung"
              />
            </label>
          </div>
          <div className="booking-col">
            <label>
              Ngày tháng năm sinh
              <DatePicker
                selected={form.dob}
                onChange={(date) =>
                  setForm((prev) => ({
                    ...prev,
                    dob: date,
                  }))
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="custom-datepicker"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </label>
            <label>
              Loại xét nghiệm ADN
              <select
                name="testType"
                value={form.testType}
                onChange={handleChange}
                required
              >
                <option value="">Chọn loại xét nghiệm ADN</option>
                {ADNTestingServices.map((s) => (
                  <option key={s.id} value={s.testType}>
                    {s.testType}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Giờ lấy mẫu
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Quận/Huyện
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                required
                disabled={!form.province}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {/* XÓA PHẦN CHỌN DÂN SỰ/HÀNH CHÍNH Ở ĐÂY */}
        {/* <div className="booking-row">
        <label>
          <input
            type="radio"
            name="type"
            value="dan-su"
            checked={type === "dan-su"}
            onChange={() => setType("dan-su")}
          />
          Dân sự
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="hanh-chinh"
            checked={type === "hanh-chinh"}
            onChange={() => setType("hanh-chinh")}
          />
          Hành chính
        </label>
        {type === "hanh-chinh" && (
          <label style={{ marginLeft: 16 }}>
            Đính kèm file dấu vân tay:
            <input type="file" name="fingerprint" accept=".jpg,.png,.pdf" />
          </label>
        )}
      </div> */}
        <div className="booking-submit">
          <button type="submit">Đăng ký</button>
        </div>
      </form>
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-icon">📝</span>
            <p>Bạn có chắc chắn muốn đăng ký xét nghiệm ADN không?</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={handleConfirm} className="modal-btn confirm">
                Xác nhận
              </button>
              <button onClick={handleCancel} className="modal-btn cancel">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Booking;
