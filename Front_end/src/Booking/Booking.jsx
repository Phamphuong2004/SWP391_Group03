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
    dob: null,
    phone: "",
    email: "",
    gender: "",
    appointmentDate: null, // LocalDateTime
    collectionSampleTime: "",
    testPurpose: "",
    serviceType: "",
    testCategory: "",
    province: "",
    district: "",
    note: "",
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

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, dob: date }));
  };

  const handleAppointmentDateChange = (date) => {
    setForm((prev) => ({ ...prev, appointmentDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = {
        ...form,
        dob: form.dob ? form.dob.toISOString().split("T")[0] : "",
        appointmentDate: form.appointmentDate
          ? form.appointmentDate.toISOString()
          : "",
        collectionSampleTime: form.collectionSampleTime || null,
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
              Ngày sinh
              <DatePicker
                selected={form.dob}
                onChange={handleDateChange}
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
            <label>
              Ngày & giờ hẹn
              <DatePicker
                selected={form.appointmentDate}
                onChange={handleAppointmentDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText="Chọn ngày & giờ"
                className="custom-datepicker"
                required
              />
            </label>
            <label>
              Giờ lấy mẫu (nếu khác giờ hẹn)
              <input
                type="time"
                name="collectionSampleTime"
                value={form.collectionSampleTime}
                onChange={handleChange}
              />
            </label>
            <label>
              Mục đích xét nghiệm
              <select
                name="testPurpose"
                value={form.testPurpose}
                onChange={handleChange}
                required
              >
                <option value="">Chọn mục đích</option>
                {testPurposes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Loại dịch vụ
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                required
              >
                <option value="">Chọn loại dịch vụ</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Loại xét nghiệm
              <select
                name="testCategory"
                value={form.testCategory}
                onChange={handleChange}
                required
              >
                <option value="">Chọn loại xét nghiệm</option>
                {testCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
              Ghi chú
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Nhập ghi chú (nếu có)"
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
