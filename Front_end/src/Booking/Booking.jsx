import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import provinces from "../Provinces";
import ADNTestingServices from "../listOfServices";
import "./Booking.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const genders = ["Nam", "Nữ", "Khác"];
const testPurposes = ["Dân sự", "Hành chính"];

const testCategories = [
  "Xét nghiệm huyết thống cha con",
  "Xét nghiệm huyết thống mẹ con",
  "Xét nghiệm ADN hành chính",
  "Xét nghiệm ADN cá nhân",
  "Xét nghiệm ADN pháp lý",
  "Xét nghiệm ADN trước sinh",
  "Xét nghiệm ADN khác",
];

const serviceTypes = [
  "Tư vấn di truyền",
  "Lấy mẫu tại nhà",
  "Lấy mẫu tại cơ sở",
  "Giao kết quả tận nơi",
  "Dịch vụ nhanh",
  "Dịch vụ tiêu chuẩn",
];

function Booking() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    gender: "",
    testPurpose: "",
    serviceType: "",
    appointmentDate: "",
    collectionTime: "00:00",
    fingerprintFile: "",
    district: "",
    province: "",
    testCategory: "",
  });

  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "province") {
      const selected = provinces.find((p) => p.name === value);
      setDistricts(selected ? selected.districts : []);
      setForm((prev) => ({ ...prev, province: value, district: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let collectionTimeObj = null;
      if (form.collectionTime) {
        const [hour, minute] = form.collectionTime.split(":").map(Number);
        collectionTimeObj = {
          hour: hour || 0,
          minute: minute || 0,
          second: 0,
          nano: 0,
        };
      }
      const data = {
        ...form,
        collectionTime: collectionTimeObj,
      };
      await axios.post("/api/create-appointment", data);
      toast.success("Đặt lịch hẹn thành công!");
      navigate("/booking-notification");
    } catch (err) {
      toast.error("Đặt lịch hẹn thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <form className="booking-form" onSubmit={handleSubmit}>
        <h2 className="booking-title">Đặt lịch hẹn xét nghiệm ADN</h2>
        <div className="booking-row">
          <div className="booking-col">
            <label>
              Họ và tên
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </label>
            <label>
              Ngày sinh (yyyy-mm-dd)
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Số điện thoại
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
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
              />
            </label>
            <label>
              Giới tính
              <input
                type="text"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                placeholder="Nhập giới tính"
                required
              />
            </label>
            <label>
              Mục đích xét nghiệm
              <input
                type="text"
                name="testPurpose"
                value={form.testPurpose}
                onChange={handleChange}
                placeholder="Nhập mục đích"
                required
              />
            </label>
            <label>
              Loại dịch vụ
              <input
                type="text"
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                placeholder="Nhập loại dịch vụ"
                required
              />
            </label>
            <label>
              Ngày & giờ hẹn (ISO 8601)
              <input
                type="datetime-local"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Giờ lấy mẫu (collectionTime)
              <input
                type="time"
                name="collectionTime"
                value={form.collectionTime}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              File vân tay (chỉ nhập tên file hoặc chuỗi)
              <input
                type="text"
                name="fingerprintFile"
                value={form.fingerprintFile}
                onChange={handleChange}
                placeholder="Nhập tên file hoặc chuỗi"
              />
            </label>
            <label>
              Tỉnh/Thành phố
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
            <label>
              Loại xét nghiệm
              <input
                type="text"
                name="testCategory"
                value={form.testCategory}
                onChange={handleChange}
                placeholder="Nhập loại xét nghiệm"
                required
              />
            </label>
          </div>
        </div>
        <div className="booking-submit">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Đang gửi..." : "Đặt lịch hẹn"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Booking;
