import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { administrativeServices } from "../servicesData";
import "./ServiceDetail.css";

const PropertyDispute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phoneNumber: "",
    disputeDescription: "",
    involvedParties: "",
    propertyDetails: "",
    additionalInfo: "",
  });

  const [files, setFiles] = useState({
    disputeDocuments: null,
    propertyPapers: null,
    otherDocuments: null,
  });

  const [uploadStatus, setUploadStatus] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Define service data directly since we know this is the property dispute page
  const service = {
    id: "property-dispute",
    title: "Giải quyết tranh chấp tài sản",
    category: "Dịch vụ Dân sự",
    description:
      "Dịch vụ hỗ trợ giải quyết các tranh chấp liên quan đến tài sản, quyền sở hữu, phân chia tài sản, v.v.",
    process: [
      "Tiếp nhận hồ sơ",
      "Xác minh thông tin",
      "Tư vấn và hòa giải",
      "Hoàn tất thủ tục pháp lý",
    ],
    processingTime: "5-10 ngày làm việc",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    if (!formData.applicantName) errors.applicantName = "Vui lòng nhập họ tên";
    if (!formData.email) errors.email = "Vui lòng nhập email";
    if (!formData.phoneNumber)
      errors.phoneNumber = "Vui lòng nhập số điện thoại";
    if (!formData.disputeDescription)
      errors.disputeDescription = "Vui lòng mô tả tranh chấp";
    if (!files.disputeDocuments)
      errors.disputeDocuments = "Vui lòng tải lên tài liệu tranh chấp";
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

      const response = await fetch("/api/property-dispute", {
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

          <form onSubmit={handleSubmit} className="property-dispute-form">
            <div className="form-section">
              <h3>Thông tin người đăng ký</h3>
              <div className="form-group">
                <label htmlFor="applicantName">Họ và tên *</label>
                <input
                  type="text"
                  id="applicantName"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  className={formErrors.applicantName ? "error" : ""}
                />
                {formErrors.applicantName && (
                  <span className="error-message">
                    {formErrors.applicantName}
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
            </div>
            <div className="form-section">
              <h3>Thông tin tranh chấp</h3>
              <div className="form-group">
                <label htmlFor="disputeDescription">Mô tả tranh chấp *</label>
                <textarea
                  id="disputeDescription"
                  name="disputeDescription"
                  value={formData.disputeDescription}
                  onChange={handleInputChange}
                  className={formErrors.disputeDescription ? "error" : ""}
                />
                {formErrors.disputeDescription && (
                  <span className="error-message">
                    {formErrors.disputeDescription}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="involvedParties">Các bên liên quan</label>
                <input
                  type="text"
                  id="involvedParties"
                  name="involvedParties"
                  value={formData.involvedParties}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="propertyDetails">Chi tiết tài sản</label>
                <input
                  type="text"
                  id="propertyDetails"
                  name="propertyDetails"
                  value={formData.propertyDetails}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="additionalInfo">Thông tin bổ sung</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-section">
              <h3>Tải lên giấy tờ liên quan</h3>
              {renderFileUpload("disputeDocuments", "Tài liệu tranh chấp")}
              {renderFileUpload(
                "propertyPapers",
                "Giấy tờ tài sản (nếu có)",
                false
              )}
              {renderFileUpload(
                "otherDocuments",
                "Giấy tờ khác (nếu có)",
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

export default PropertyDispute;
