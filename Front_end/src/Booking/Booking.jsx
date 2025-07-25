import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import provinces from "../Provinces";
import "./Booking.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import serviceTypes from "../serviceTypes";
import { Select } from "antd";
// XÓA: import { Steps } from "antd";
import { getKitByServiceId } from "../Kit/KitApi";
import { getSampleTypesByComponentName } from "../SampleManagement/SampleApi";
import { getActiveTestCategoriesByService } from "../TestCategory/TestCategoryAPI";
import { getTestPurposesByServiceName } from "../servicetestpurpose/servicetestpurpose";

const genders = ["Nam", "Nữ", "Khác"];

// Dropdown options for collectionLocation
const collectionLocations = ["Tại nhà", "Tại cơ sở y tế"];
// Danh sách kit component chuẩn hóa từ bảng DB
// XÓA: const kitComponentNames = [...];

// XÓA: Mapping dịch vụ sang mục đích xét nghiệm
// const servicePurposeMap = {
//   1: ["Hành chính"],
//   2: ["Hành chính"],
//   3: ["Hành chính"],
//   4: ["Hành chính", "Dân sự"], // Ví dụ: dịch vụ này có cả hai
//   5: ["Hành chính"],
//   6: ["Dân sự"],
//   7: ["Dân sự"],
//   8: ["Dân sự"],
//   9: ["Hành chính"],
//   10: ["Dân sự"],
// };

function Booking() {
  const location = useLocation();
  const serviceFromNavigation = location.state?.service;

  // Ref to track timers for cleanup
  const timersRef = useRef([]);

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
    collectionLocation: "",
    kitComponentName: "",
    sampleTypes: [],
  });

  const [formData, setFormData] = useState({
    customerName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    gender: "",
    city: "",
    district: "",
    serviceType: serviceFromNavigation?.name || "",
    serviceCategory: serviceFromNavigation?.type || "", // Sửa dòng này
    appointmentDate: "",
    appointmentTime: "",
    documents: null,
    testType: "",
    collectionLocation: "",
  });

  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [guestSuccess, setGuestSuccess] = useState(false);
  const [guestInfo, setGuestInfo] = useState({});

  const [dynamicSampleTypeOptions, setDynamicSampleTypeOptions] = useState([]);
  const [testCategories, setTestCategories] = useState([]);
  const [availablePurposes, setAvailablePurposes] = useState([]);
  const [filteredKits, setFilteredKits] = useState([]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateFullName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-ZÀ-ỹ\s]+$/.test(name);
  };

  const validateDateOfBirth = (dob) => {
    if (!dob) return false;
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  };

  const validateAppointmentDate = (appointmentDate) => {
    if (!appointmentDate) return false;
    const appointment = new Date(appointmentDate);
    const now = new Date();
    return appointment > now;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate fullName
    if (!form.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    } else if (!validateFullName(form.fullName)) {
      newErrors.fullName =
        "Họ và tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái";
    }

    // Validate dob
    if (!form.dob) {
      newErrors.dob = "Ngày sinh không được để trống";
    } else if (!validateDateOfBirth(form.dob)) {
      newErrors.dob = "Ngày sinh không hợp lệ";
    }

    // Validate phone
    if (!form.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 số";
    }

    // Validate email
    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    // Validate gender
    if (!form.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    // Validate province
    if (!form.province) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    }

    // Validate district
    if (!form.district) {
      newErrors.district = "Vui lòng chọn quận/huyện";
    }

    // Validate testPurpose
    if (!form.testPurpose) {
      newErrors.testPurpose = "Vui lòng chọn mục đích xét nghiệm";
    }

    // Validate serviceType
    if (!form.serviceType) {
      newErrors.serviceType = "Vui lòng chọn loại dịch vụ";
    }

    // Validate appointmentDate
    if (!form.appointmentDate) {
      newErrors.appointmentDate = "Vui lòng chọn ngày hẹn";
    } else if (!validateAppointmentDate(form.appointmentDate)) {
      newErrors.appointmentDate = "Ngày hẹn phải là ngày trong tương lai";
    }

    // Validate collectionTime
    if (!form.collectionTime) {
      newErrors.collectionTime = "Vui lòng chọn giờ lấy mẫu";
    }

    // Validate testCategory
    if (!form.testCategory) {
      newErrors.testCategory = "Vui lòng chọn loại xét nghiệm";
    }

    // Validate collectionLocation
    if (!form.collectionLocation) {
      newErrors.collectionLocation = "Vui lòng chọn địa điểm lấy mẫu";
    }

    // Validate kitComponentName
    if (!form.kitComponentName) {
      newErrors.kitComponentName = "Vui lòng chọn bộ kit";
    }

    // Validate sampleTypes
    if (!form.sampleTypes || form.sampleTypes.length === 0) {
      newErrors.sampleTypes = "Vui lòng chọn ít nhất một loại mẫu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Khi vào trang booking, nếu có serviceId truyền qua state thì tự động fill vào form và reset các trường liên quan
  React.useEffect(() => {
    if (location.state && location.state.serviceId) {
      setForm((prev) => ({
        ...prev,
        serviceType: String(location.state.serviceId),
        testPurpose: "",
        kitComponentName: "",
      }));
      localStorage.setItem(
        "bookingServiceId",
        String(location.state.serviceId)
      );
    } else {
      // Nếu không có state, thử lấy từ localStorage
      const savedId = localStorage.getItem("bookingServiceId");
      if (savedId) {
        setForm((prev) => ({
          ...prev,
          serviceType: savedId,
          testPurpose: "",
          kitComponentName: "",
        }));
      }
    }
    if (location.state && location.state.fixedPurpose) {
      setForm((prev) => ({
        ...prev,
        testPurpose: location.state.fixedPurpose,
      }));
      setAvailablePurposes([location.state.fixedPurpose]);
    }
  }, [location.state]);

  useEffect(() => {
    if (
      !form.testPurpose &&
      availablePurposes &&
      availablePurposes.length === 1
    ) {
      setForm((prev) => ({ ...prev, testPurpose: availablePurposes[0] }));
    }
  }, [availablePurposes, form.testPurpose]);

  useEffect(() => {
    if (form.serviceType) {
      const selectedService = serviceTypes.find(
        (s) => String(s.service_id) === String(form.serviceType)
      );
      if (selectedService) {
        getActiveTestCategoriesByService(selectedService.service_name)
          .then((res) => setTestCategories(res.data))
          .catch(() => setTestCategories([]));
      }
    } else {
      setTestCategories([]);
    }
    // eslint-disable-next-line
  }, [form.serviceType]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Update form first
    if (name === "province") {
      const selected = provinces.find((p) => p.name === value);
      setDistricts(selected ? selected.districts : []);
      setForm((prev) => ({ ...prev, province: value, district: "" }));
      // Clear district error when province changes
      if (errors.district) {
        setErrors((prev) => ({ ...prev, district: "" }));
      }
    } else if (name === "serviceType") {
      // Gọi API lấy mục đích xét nghiệm động từ backend
      try {
        const selectedService = serviceTypes.find(
          (s) => String(s.service_id) === String(value)
        );
        if (selectedService) {
          const res = await getTestPurposesByServiceName(
            selectedService.service_name
          );
          setAvailablePurposes(res.data || []);
        } else {
          setAvailablePurposes([]);
        }
      } catch (err) {
        setAvailablePurposes([]);
        toast.error("Không lấy được mục đích xét nghiệm!");
      }
      // Gọi API lấy kit động
      try {
        const res = await getKitByServiceId(value);
        setFilteredKits(res.data); // res.data là mảng kit trả về từ API
      } catch (err) {
        setFilteredKits([]);
        toast.error("Không lấy được danh sách kit!");
      }
      // Reset testPurpose và kitComponentName về rỗng mỗi khi đổi dịch vụ
      setForm((prev) => ({
        ...prev,
        serviceType: value,
        testPurpose: "",
        kitComponentName: "",
      }));
      // Clear related errors
      setErrors((prev) => ({
        ...prev,
        testPurpose: "",
        kitComponentName: "",
        sampleTypes: [],
      }));
    } else if (name === "kitComponentName") {
      setForm((prev) => ({
        ...prev,
        kitComponentName: value,
        sampleTypes: [],
      }));
      try {
        const token = JSON.parse(localStorage.getItem("user") || "null")?.token;
        const res = await getSampleTypesByComponentName(value, token);
        setDynamicSampleTypeOptions(
          (res || []).map((item) => ({ value: item.name, label: item.name }))
        );
      } catch (err) {
        setDynamicSampleTypeOptions([]);
        toast.error("Không lấy được loại mẫu!");
      }
      // Clear sampleTypes error
      setErrors((prev) => ({ ...prev, sampleTypes: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Validate the specific field after updating form
    const timer = setTimeout(() => {
      validateField(name, value);
    }, 100);
    timersRef.current.push(timer);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    let errorMessage = "";
    switch (fieldName) {
      case "fullName":
        if (!value.trim()) {
          errorMessage = "Họ và tên không được để trống";
        } else if (!validateFullName(value)) {
          errorMessage =
            "Họ và tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái";
        }
        break;

      case "dob":
        if (!value) {
          errorMessage = "Ngày sinh không được để trống";
        } else if (!validateDateOfBirth(value)) {
          errorMessage = "Ngày sinh không hợp lệ";
        }
        break;

      case "phone":
        if (!value.trim()) {
          errorMessage = "Số điện thoại không được để trống";
        } else if (!validatePhone(value)) {
          errorMessage =
            "Số điện thoại phải có 10-11 số và số điện thoại không phải là chữ";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMessage = "Email không được để trống";
        } else if (!validateEmail(value)) {
          errorMessage = "Email không đúng định dạng";
        }
        break;

      case "gender":
        if (!value) {
          errorMessage = "Vui lòng chọn giới tính";
        }
        break;

      case "province":
        if (!value) {
          errorMessage = "Vui lòng chọn tỉnh/thành phố";
        }
        break;

      case "district":
        if (!value) {
          errorMessage = "Vui lòng chọn quận/huyện";
        }
        break;

      case "testPurpose":
        if (!value) {
          errorMessage = "Vui lòng chọn mục đích xét nghiệm";
        }
        break;

      case "serviceType":
        if (!value) {
          errorMessage = "Vui lòng chọn loại dịch vụ";
        }
        break;

      case "appointmentDate":
        if (!value) {
          errorMessage = "Vui lòng chọn ngày hẹn";
        } else if (!validateAppointmentDate(value)) {
          errorMessage = "Ngày hẹn phải là ngày trong tương lai";
        }
        break;

      case "collectionTime":
        if (!value) {
          errorMessage = "Vui lòng chọn giờ lấy mẫu";
        }
        break;

      case "testCategory":
        if (!value) {
          errorMessage = "Vui lòng chọn loại xét nghiệm";
        }
        break;

      case "collectionLocation":
        if (!value) {
          errorMessage = "Vui lòng chọn địa điểm lấy mẫu";
        }
        break;

      case "kitComponentName":
        if (!value) {
          errorMessage = "Vui lòng chọn bộ kit";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  };

  const handleSampleTypesChange = (values) => {
    setForm((prev) => ({ ...prev, sampleTypes: values }));

    // Validate sampleTypes
    let errorMessage = "";
    if (!values || values.length === 0) {
      errorMessage = "Vui lòng chọn ít nhất một loại mẫu";
    }

    setErrors((prev) => ({ ...prev, sampleTypes: errorMessage }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, fingerprintFile: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      localStorage.removeItem("bookingServiceId");
      return;
    }

    console.log("Giá trị gửi lên:", form);
    setIsLoading(true);
    try {
      const datePart = form.appointmentDate
        ? form.appointmentDate.split("T")[0]
        : "";
      let timePart = form.collectionTime;
      if (timePart && timePart.length === 5) timePart += ":00";
      const collectionTimeStr =
        datePart && timePart ? `${datePart}T${timePart}` : "";

      const selectedService = serviceTypes.find(
        (s) => s.service_id.toString() === form.serviceType
      );
      const data = {
        fullName: typeof form.fullName === "string" ? form.fullName : "",
        dob: typeof form.dob === "string" ? form.dob : "",
        phone: typeof form.phone === "string" ? form.phone : "",
        email: typeof form.email === "string" ? form.email : "",
        gender: typeof form.gender === "string" ? form.gender : "",
        // testPurpose: ép về string nếu là object
        testPurpose:
          typeof form.testPurpose === "string"
            ? form.testPurpose
            : form.testPurpose?.testPurposeName || "",
        serviceType:
          typeof form.serviceType === "string"
            ? form.serviceType
            : form.serviceType?.value || "",
        appointmentDate:
          typeof form.appointmentDate === "string" ? form.appointmentDate : "",
        collectionTime: collectionTimeStr,
        fingerprintFile:
          typeof form.fingerprintFile === "string" ? form.fingerprintFile : "",
        district: typeof form.district === "string" ? form.district : "",
        province: typeof form.province === "string" ? form.province : "",
        // Sửa testCategory thành string nếu là object
        testCategory:
          typeof form.testCategory === "string"
            ? form.testCategory
            : form.testCategory?.value || "",
        collectionLocation:
          typeof form.collectionLocation === "string"
            ? form.collectionLocation
            : "",
        // Sửa kitComponentName thành string nếu là object
        kitComponentName:
          typeof form.kitComponentName === "string"
            ? form.kitComponentName
            : form.kitComponentName?.value || "",
        // Sửa sampleTypes thành mảng chuỗi
        sampleTypes: (form.sampleTypes || []).map((item) =>
          typeof item === "string" ? item : item.value
        ),
      };

      // Log dữ liệu gửi lên để debug
      console.log("Dữ liệu gửi lên:", data);

      const userString = localStorage.getItem("user");
      const serviceId = form.serviceType;
      if (!serviceId) {
        toast.error("Vui lòng chọn loại dịch vụ!");
        setIsLoading(false);
        localStorage.removeItem("bookingServiceId");
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
          localStorage.removeItem("bookingServiceId");
          // Chuyển hướng sang trang thanh toán cho guest
          navigate("/payment", {
            state: {
              appointment: {
                ...form,
                appointmentId: response.data.appointmentId,
                status: "PENDING",
                collectionSampleTime: data.collectionTime,
              },
            },
          });
          return;
        } else {
          toast.error("Có lỗi xảy ra, không nhận được mã lịch hẹn.");
        }
        setIsLoading(false);
        localStorage.removeItem("bookingServiceId");
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
        localStorage.removeItem("bookingServiceId");
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
        localStorage.removeItem("bookingServiceId");
      }
    } catch (err) {
      console.error(
        "Lỗi trả về từ backend:",
        err.response?.data || err.message
      );
      toast.error(
        err.response?.data?.message ||
          "Đặt lịch hẹn thất bại. Vui lòng thử lại!"
      );
      localStorage.removeItem("bookingServiceId");
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

  // Xác định selectedServiceType và kitsToShow dùng chung cho cả mô tả và dropdown
  const selectedServiceType = serviceTypes.find(
    (s) => String(s.service_id) === String(form.serviceType)
  );
  let kitsToShow = [];
  if (filteredKits.length > 0) {
    kitsToShow = filteredKits;
  } else if (Array.isArray(selectedServiceType?.kits)) {
    if (
      selectedServiceType.kits.length > 0 &&
      typeof selectedServiceType.kits[0] === "object"
    ) {
      kitsToShow = selectedServiceType.kits;
    } else {
      kitsToShow = selectedServiceType.kits.map((name) => ({
        kitComponentName: name,
        introduction: "",
      }));
    }
  }

  return (
    <div className="booking-page">
      <form className="booking-form" onSubmit={handleSubmit}>
        <h2 className="booking-title">Đặt lịch hẹn xét nghiệm ADN</h2>
        <div className="booking-2col-flex">
          {/* Cột trái: Thông tin cá nhân */}
          <div className="booking-col booking-col-personal">
            <h3>Thông tin cá nhân</h3>
            <label>
              Họ và tên
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className={errors.fullName ? "error" : ""}
                required
              />
              {errors.fullName && (
                <p className="error-message">{errors.fullName}</p>
              )}
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
                    // Validate after date change
                    const timer = setTimeout(() => {
                      validateField(
                        "dob",
                        date ? date.toISOString().slice(0, 10) : ""
                      );
                    }, 100);
                    timersRef.current.push(timer);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày sinh"
                  className={`booking-datepicker-input ${
                    errors.dob ? "error" : ""
                  }`}
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
                        className={`booking-datepicker-input ${
                          errors.dob ? "error" : ""
                        }`}
                      />
                      <span
                        style={{
                          position: "absolute",
                          right: 8,
                          cursor: "pointer",
                          fontSize: 20,
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
              {errors.dob && <p className="error-message">{errors.dob}</p>}
            </label>
            <label>
              Số điện thoại
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className={errors.phone ? "error" : ""}
                required
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className={errors.email ? "error" : ""}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </label>
            <label>
              Giới tính
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={errors.gender ? "error" : ""}
                required
              >
                <option value="">Chọn giới tính</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="error-message">{errors.gender}</p>
              )}
            </label>
            <label>
              Tỉnh/Thành phố
              <select
                name="province"
                value={form.province}
                onChange={handleChange}
                className={errors.province ? "error" : ""}
                required
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="error-message">{errors.province}</p>
              )}
            </label>
            <label>
              Quận/Huyện
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                className={errors.district ? "error" : ""}
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
              {errors.district && (
                <p className="error-message">{errors.district}</p>
              )}
            </label>
          </div>

          {/* Cột phải: Thông tin xét nghiệm */}
          <div className="booking-col booking-col-test">
            <h3>Thông tin xét nghiệm</h3>
            {/* Thanh thông báo mục đích xét nghiệm */}
            {form.serviceType && availablePurposes.length > 0 && (
              <div
                className="purpose-info-bar"
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  background: "#e3f0ff",
                  border: "1.5px solid #1976d2",
                  borderRadius: 8,
                }}
              >
                <b>Dịch vụ này hỗ trợ mục đích xét nghiệm:</b>{" "}
                {availablePurposes.map((p) => p.testPurposeName).join(", ")}
              </div>
            )}
            {/* Nếu có fixedPurpose thì hiện input disabled */}
            {location.state && location.state.fixedPurpose && (
              <label>
                Mục đích xét nghiệm
                <input
                  type="text"
                  value={location.state.fixedPurpose}
                  disabled
                  style={{ background: "#f7eaea", color: "#b9b9b9" }}
                />
              </label>
            )}
            {/* Nếu có nhiều hơn 1 mục đích thì hiện dropdown */}
            {!location.state?.fixedPurpose && availablePurposes.length > 1 && (
              <label>
                Mục đích xét nghiệm
                <select
                  name="testPurpose"
                  value={form.testPurpose}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn mục đích</option>
                  {availablePurposes.map((purpose) => (
                    <option
                      key={purpose.testPurposeId || purpose.id}
                      value={purpose.testPurposeName}
                    >
                      {purpose.testPurposeName}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {/* Nếu chỉ có 1 mục đích và không có fixedPurpose thì hiện input disabled */}
            {!location.state?.fixedPurpose &&
              availablePurposes.length === 1 && (
                <label>
                  Mục đích xét nghiệm
                  <input
                    type="text"
                    value={availablePurposes[0].testPurposeName}
                    disabled
                    style={{ background: "#f7eaea", color: "#b9b9b9" }}
                  />
                </label>
              )}
            <label>
              Loại dịch vụ
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                className={errors.serviceType ? "error" : ""}
                required
                disabled={
                  !!(location.state && location.state.serviceId) ||
                  !!localStorage.getItem("bookingServiceId")
                }
              >
                <option value="">Chọn loại dịch vụ</option>
                {serviceTypes.map((type) => (
                  <option key={type.service_id} value={String(type.service_id)}>
                    {type.service_name}
                  </option>
                ))}
              </select>
              {errors.serviceType && (
                <p className="error-message">{errors.serviceType}</p>
              )}
            </label>
            {/* Hiển thị thông tin mô tả và bộ kit sử dụng của loại dịch vụ */}
            {form.serviceType && selectedServiceType && (
              <div
                className="service-info-box"
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  background: "#f6fafd",
                  border: "1.5px solid #90caf9",
                  borderRadius: 8,
                }}
              >
                <div>
                  <b>Mô tả dịch vụ:</b> {selectedServiceType.description}
                </div>
                <div style={{ marginTop: 4 }}>
                  <b>Bộ kit sử dụng:</b>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                    {kitsToShow.length > 0 ? (
                      kitsToShow.map((kit, idx) => (
                        <li key={idx} style={{ marginBottom: 2 }}>
                          <b>{kit.kitComponentName}</b>
                          {kit.introduction ? `: ${kit.introduction}` : ""}
                        </li>
                      ))
                    ) : (
                      <li>Không xác định</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            <label>
              Ngày & giờ hẹn (ISO 8601)
              <input
                type="datetime-local"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                className={errors.appointmentDate ? "error" : ""}
                required
              />
              {errors.appointmentDate && (
                <p className="error-message">{errors.appointmentDate}</p>
              )}
            </label>
            <label>
              Giờ lấy mẫu (collectionTime)
              <input
                type="time"
                name="collectionTime"
                value={form.collectionTime}
                onChange={handleChange}
                className={errors.collectionTime ? "error" : ""}
                required
              />
              {errors.collectionTime && (
                <p className="error-message">{errors.collectionTime}</p>
              )}
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
              Loại xét nghiệm
              <select
                name="testCategory"
                value={form.testCategory}
                onChange={handleChange}
                className={errors.testCategory ? "error" : ""}
                required
              >
                <option value="">Chọn loại xét nghiệm</option>
                {testCategories.map((cat) => (
                  <option key={cat.id} value={cat.testCategoryName}>
                    {cat.testCategoryName}
                  </option>
                ))}
              </select>
              {errors.testCategory && (
                <p className="error-message">{errors.testCategory}</p>
              )}
            </label>
            <label>
              Địa điểm lấy mẫu (collectionLocation)
              <select
                name="collectionLocation"
                value={form.collectionLocation}
                onChange={handleChange}
                className={errors.collectionLocation ? "error" : ""}
                required
              >
                <option value="">Chọn địa điểm lấy mẫu</option>
                {collectionLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.collectionLocation && (
                <p className="error-message">{errors.collectionLocation}</p>
              )}
            </label>
            <label>
              Bộ kit sử dụng (kitComponentName)
              <select
                name="kitComponentName"
                value={form.kitComponentName}
                onChange={handleChange}
                className={errors.kitComponentName ? "error" : ""}
                required
              >
                <option value="">Chọn bộ kit</option>
                {kitsToShow.map((kit, idx) => (
                  <option key={idx} value={kit.kitComponentName}>
                    {kit.kitComponentName}
                    {kit.introduction ? ` - ${kit.introduction}` : ""}
                  </option>
                ))}
              </select>
              {errors.kitComponentName && (
                <p className="error-message">{errors.kitComponentName}</p>
              )}
            </label>
            <label>
              Loại mẫu (sampleTypes)
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Chọn loại mẫu"
                value={form.sampleTypes || []}
                onChange={handleSampleTypesChange}
                options={dynamicSampleTypeOptions}
                className={errors.sampleTypes ? "error" : ""}
                required
              />
              {errors.sampleTypes && (
                <p className="error-message">{errors.sampleTypes}</p>
              )}
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
