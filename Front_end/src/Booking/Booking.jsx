import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import provinces from "../Provinces";
import ADNTestingServices from "../listOfServices";
import "./Booking.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import serviceTypes from "../serviceTypes";

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
  const [guestSuccess, setGuestSuccess] = useState(false);
  const [guestInfo, setGuestInfo] = useState({});

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
      const datePart = form.appointmentDate
        ? form.appointmentDate.split("T")[0]
        : "";
      let timePart = form.collectionTime;
      if (timePart && timePart.length === 5) timePart += ":00";
      const collectionTimeStr =
        datePart && timePart ? `${datePart}T${timePart}` : null;

      const selectedService = serviceTypes.find(
        (s) => s.service_id.toString() === form.serviceType
      );
      const data = {
        ...form,
        serviceType: selectedService ? selectedService.service_name : "",
        collectionTime: collectionTimeStr,
      };

      const userString = localStorage.getItem("user");
      const serviceId = form.serviceType;
      if (!serviceId) {
        toast.error("Vui lòng chọn loại dịch vụ!");
        setIsLoading(false);
        return;
      }

      let response;
      if (!userString) {
        // Nếu chưa đăng nhập, gọi API guest
        response = await axios.post(
          `/api/create/guest-appointment/${serviceId}`,
          data
        );
        if (response.status === 201 && response.data?.appointmentId) {
          setGuestSuccess(true);
          setGuestInfo({
            appointmentId: response.data.appointmentId,
            email: form.email,
            phone: form.phone,
          });
          localStorage.setItem("lastServiceId", response.data.appointmentId);
          // Không chuyển hướng về trang chủ nữa!
        } else {
          toast.error("Có lỗi xảy ra, không nhận được mã lịch hẹn.");
        }
        setIsLoading(false);
        return;
      }
      // Đã đăng nhập, giữ nguyên logic cũ
      const user = JSON.parse(userString);
      const token = user.token;
      response = await axios.post(
        `/api/create-appointment/${serviceId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 && response.data?.appointmentId) {
        toast.success("Đặt lịch hẹn thành công!");
        localStorage.setItem("lastServiceId", response.data.appointmentId);
        const appointmentDataForState = {
          ...form,
          appointmentId: response.data.appointmentId,
          status: "PENDING",
          collectionSampleTime: data.collectionTime,
          user: { username: user.username },
        };
        delete appointmentDataForState.collectionTime;
        navigate("/payment", {
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

  if (guestSuccess) {
    return (
      <div className="booking-success-container">
        <h2>Đặt lịch thành công!</h2>
        <p>
          Mã đơn của bạn: <b>{guestInfo.appointmentId}</b>
        </p>
        <p>
          Email: <b>{guestInfo.email}</b>
        </p>
        <p>
          Số điện thoại: <b>{guestInfo.phone}</b>
        </p>
        <p>
          Vui lòng lưu lại mã đơn, email và số điện thoại để tra cứu hoặc theo
          dõi đơn.
        </p>
        <button
          onClick={() => {
            navigate("/history", {
              state: {
                guestEmail: guestInfo.email,
                guestPhone: guestInfo.phone,
                appointmentId: guestInfo.appointmentId,
              },
            });
          }}
        >
          Theo dõi đơn
        </button>
      </div>
    );
  }

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
                  <option key={type.service_id} value={type.service_id}>
                    {type.service_name}
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
