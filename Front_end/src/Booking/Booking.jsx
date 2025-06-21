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
const testPurposes = ["Hành chính", "Dân sự"];

const testCategories = [
  "Cha - Con",
  "Mẹ - Con",
  "Anh - Em",
  "Chị - Em",
  "Ông - Cháu",
  "Bà - Cháu",
  "Song sinh",
  "Họ hàng",
  "Khác",
  "Chú - Cháu",
  "Cô - Cháu",
  "Dì - Cháu",
  "Bác - Cháu",
  "Cháu nội",
  "Cháu ngoại",
];

const serviceTypes = [
  "Xét nghiệm huyết thống",
  "Xét nghiệm hài cốt",
  "Xét nghiệm ADN cá nhân",
  "Xét nghiệm ADN pháp lý",
  "Xét nghiệm ADN trước sinh",
  "Xét nghiệm ADN khác",
  "Xét nghiệm ADN thai nhi",
  "Xét nghiệm ADN di truyền",
  "Xét nghiệm ADN hành chính",
  "Xét nghiệm ADN dân sự",
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
    collectionTime: "",
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
    console.log("Thay đổi:", name, value);
    if (name === "province") {
      const selected = provinces.find((p) => p.name === value);
      setDistricts(selected ? selected.districts : []);
      setForm((prev) => ({ ...prev, province: value, district: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, fingerprintFile: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Giá trị gửi lên:", form);
    setIsLoading(true);
    try {
      // Lấy ngày từ appointmentDate
      const datePart = form.appointmentDate
        ? form.appointmentDate.split("T")[0]
        : "";
      // Lấy giờ từ collectionTime (dạng "HH:mm" hoặc "HH:mm:ss")
      let timePart = form.collectionTime;
      if (timePart && timePart.length === 5) timePart += ":00";
      // Ghép lại thành chuỗi ISO
      const collectionTimeStr =
        datePart && timePart ? `${datePart}T${timePart}` : null;

      const data = {
        ...form,
        collectionTime: collectionTimeStr,
      };

      const userString = localStorage.getItem("user");
      if (!userString) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
        setIsLoading(false);
        navigate("/login");
        return;
      }
      const user = JSON.parse(userString);
      const token = user.token;

      const response = await axios.post("/api/create-appointment", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 && response.data?.appointmentId) {
        toast.success("Đặt lịch hẹn thành công!");
        localStorage.setItem("lastServiceId", response.data.appointmentId);

        // Construct the full appointment object to pass in state
        const appointmentDataForState = {
          ...form, // Start with the original form data
          appointmentId: response.data.appointmentId, // Add the ID from the response
          status: "PENDING", // Set initial status
          collectionSampleTime: data.collectionTime,
          user: { username: user.username }, // SECURE: Attach user info
        };
        delete appointmentDataForState.collectionTime; // Clean up the old property

        // Pass the complete, corrected object
        navigate(`/service-tracking/${response.data.appointmentId}`, {
          state: { appointment: appointmentDataForState },
        });
      } else {
        toast.error("Có lỗi xảy ra, không nhận được mã lịch hẹn.");
        navigate("/history");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Đặt lịch hẹn thất bại. Vui lòng thử lại!"
      );
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
              <div style={{ position: "relative" }}>
                <DatePicker
                  selected={form.dob ? new Date(form.dob) : null}
                  onChange={(date) => {
                    setForm((prev) => ({
                      ...prev,
                      dob: date ? date.toISOString().slice(0, 10) : "",
                    }));
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày sinh"
                  className="booking-datepicker-input"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  customInput={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        value={
                          form.dob
                            ? form.dob.split("-").reverse().join("/")
                            : ""
                        }
                        readOnly
                        placeholder="Chọn ngày sinh"
                        style={{ width: "100%", paddingRight: 32 }}
                        className="booking-datepicker-input"
                      />
                      <span
                        style={{
                          position: "absolute",
                          right: 8,
                          cursor: "pointer",
                          fontSize: 20,
                        }}
                        onClick={(e) => {
                          e.target.previousSibling &&
                            e.target.previousSibling.focus &&
                            e.target.previousSibling.focus();
                        }}
                        title="Chọn ngày sinh"
                        role="button"
                        tabIndex={0}
                      >
                        📅
                      </span>
                    </div>
                  }
                />
              </div>
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
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
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
                {testPurposes.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
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
              File vân tay
              <input
                type="file"
                name="fingerprintFile"
                accept="image/*,.pdf"
                onChange={handleFileChange}
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
