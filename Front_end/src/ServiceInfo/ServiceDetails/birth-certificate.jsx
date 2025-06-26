import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { administrativeServices } from "../servicesData";
import "./ServiceDetail.css";

const BirthCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    childName: "",
    dateOfBirth: "",
    gender: "",
    placeOfBirth: "",
    fatherName: "",
    fatherId: "",
    motherName: "",
    motherId: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [files, setFiles] = useState({
    birthProof: null,
    householdBook: null,
    parentId: null,
    marriageCertificate: null,
  });

  const [uploadStatus, setUploadStatus] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const service = administrativeServices.find(
    (s) => s.id === "birth-certificate"
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [fileType]: file,
      }));
      setUploadStatus((prev) => ({
        ...prev,
        [fileType]: "pending",
      }));
    }
  };

  const handleFileUpload = async (fileType) => {
    const file = files[fileType];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus((prev) => ({
          ...prev,
          [fileType]: "success",
        }));
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        [fileType]: "error",
      }));
      console.error("Upload error:", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.childName) errors.childName = "Vui lòng nhập tên trẻ";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Vui lòng nhập ngày sinh";
    if (!formData.gender) errors.gender = "Vui lòng chọn giới tính";
    if (!formData.placeOfBirth) errors.placeOfBirth = "Vui lòng nhập nơi sinh";
    if (!formData.fatherName) errors.fatherName = "Vui lòng nhập tên cha";
    if (!formData.fatherId) errors.fatherId = "Vui lòng nhập CMND/CCCD của cha";
    if (!formData.motherName) errors.motherName = "Vui lòng nhập tên mẹ";
    if (!formData.motherId) errors.motherId = "Vui lòng nhập CMND/CCCD của mẹ";
    if (!formData.address) errors.address = "Vui lòng nhập địa chỉ";
    if (!formData.phoneNumber)
      errors.phoneNumber = "Vui lòng nhập số điện thoại";
    if (!formData.email) errors.email = "Vui lòng nhập email";
    if (!files.birthProof)
      errors.birthProof = "Vui lòng tải lên giấy chứng sinh";
    if (!files.householdBook)
      errors.householdBook = "Vui lòng tải lên sổ hộ khẩu";
    if (!files.parentId)
      errors.parentId = "Vui lòng tải lên CMND/CCCD của cha mẹ";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      const response = await fetch("/api/birth-certificate", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        const data = await response.json();
        const serviceId = data.serviceId || "default-id";
        localStorage.setItem("lastServiceId", serviceId);

        alert("Đơn đăng ký của bạn đã được gửi thành công!");

        navigate(`/service-tracking/${serviceId}`);
      } else {
        throw new Error("Submit failed");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại sau.");
      console.error("Submit error:", error);
    }
  };

  const renderFileUpload = (fileType, label, required = true) => {
    const status = uploadStatus[fileType];
    return (
      <div className="upload-section">
        <label className="upload-label">
          {label} {required && "*"}
          <input
            type="file"
            onChange={(e) => handleFileChange(e, fileType)}
            accept=".pdf,.jpg,.jpeg,.png"
            className="file-input"
          />
        </label>
        {files[fileType] && (
          <div className="upload-status">
            <span className="file-name">{files[fileType].name}</span>
            <button
              type="button"
              onClick={() => handleFileUpload(fileType)}
              className={`upload-button ${
                status === "success" ? "success" : ""
              }`}
              disabled={status === "success"}
            >
              {status === "success" ? "Đã tải lên" : "Tải lên"}
            </button>
          </div>
        )}
        {formErrors[fileType] && (
          <span className="error-message">{formErrors[fileType]}</span>
        )}
      </div>
    );
  };

  if (!service) {
    return <div>Không tìm thấy dịch vụ</div>;
  }

  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>{service.title}</h1>
          <div className="service-category">{service.category}</div>
        </div>
        <div className="service-info">
          <h2>Thông tin dịch vụ</h2>
          <p>{service.description}</p>

          <form onSubmit={handleSubmit} className="birth-certificate-form">
            <div className="form-section">
              <h3>Thông tin trẻ</h3>
              <div className="form-group">
                <label htmlFor="childName">Họ và tên trẻ *</label>
                <input
                  type="text"
                  id="childName"
                  name="childName"
                  value={formData.childName}
                  onChange={handleInputChange}
                  className={formErrors.childName ? "error" : ""}
                />
                {formErrors.childName && (
                  <span className="error-message">{formErrors.childName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Ngày sinh *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={formErrors.dateOfBirth ? "error" : ""}
                />
                {formErrors.dateOfBirth && (
                  <span className="error-message">
                    {formErrors.dateOfBirth}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="gender">Giới tính *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={formErrors.gender ? "error" : ""}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {formErrors.gender && (
                  <span className="error-message">{formErrors.gender}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="placeOfBirth">Nơi sinh *</label>
                <input
                  type="text"
                  id="placeOfBirth"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  className={formErrors.placeOfBirth ? "error" : ""}
                />
                {formErrors.placeOfBirth && (
                  <span className="error-message">
                    {formErrors.placeOfBirth}
                  </span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin cha</h3>
              <div className="form-group">
                <label htmlFor="fatherName">Họ và tên cha *</label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className={formErrors.fatherName ? "error" : ""}
                />
                {formErrors.fatherName && (
                  <span className="error-message">{formErrors.fatherName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="fatherId">CMND/CCCD của cha *</label>
                <input
                  type="text"
                  id="fatherId"
                  name="fatherId"
                  value={formData.fatherId}
                  onChange={handleInputChange}
                  className={formErrors.fatherId ? "error" : ""}
                />
                {formErrors.fatherId && (
                  <span className="error-message">{formErrors.fatherId}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin mẹ</h3>
              <div className="form-group">
                <label htmlFor="motherName">Họ và tên mẹ *</label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  className={formErrors.motherName ? "error" : ""}
                />
                {formErrors.motherName && (
                  <span className="error-message">{formErrors.motherName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="motherId">CMND/CCCD của mẹ *</label>
                <input
                  type="text"
                  id="motherId"
                  name="motherId"
                  value={formData.motherId}
                  onChange={handleInputChange}
                  className={formErrors.motherId ? "error" : ""}
                />
                {formErrors.motherId && (
                  <span className="error-message">{formErrors.motherId}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin liên hệ</h3>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={formErrors.address ? "error" : ""}
                />
                {formErrors.address && (
                  <span className="error-message">{formErrors.address}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={formErrors.phoneNumber ? "error" : ""}
                />
                {formErrors.phoneNumber && (
                  <span className="error-message">
                    {formErrors.phoneNumber}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "error" : ""}
                />
                {formErrors.email && (
                  <span className="error-message">{formErrors.email}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Tải lên giấy tờ cần thiết</h3>
              {renderFileUpload("birthProof", "Giấy chứng sinh")}
              {renderFileUpload("householdBook", "Sổ hộ khẩu")}
              {renderFileUpload("parentId", "CMND/CCCD của cha mẹ")}
              {renderFileUpload(
                "marriageCertificate",
                "Giấy đăng ký kết hôn (nếu có)",
                false
              )}
            </div>

            <div className="form-submit">
              <button type="submit" className="submit-button">
                Gửi đơn đăng ký
              </button>
            </div>
          </form>

          <div className="service-process">
            <h3>Quy trình</h3>
            <ol>
              {service.process?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="processing-time">
            <h3>Thời gian xử lý</h3>
            <p>{service.processingTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthCertificate;
