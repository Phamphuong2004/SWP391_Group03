import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ServiceDetail.css";

const CivilContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phoneNumber: "",
    contractType: "",
    contractParties: "",
    contractValue: "",
    contractDescription: "",
    contractDuration: "",
    additionalInfo: "",
  });

  const [files, setFiles] = useState({
    identificationDocuments: null,
    contractDraft: null,
    supportingDocuments: null,
    otherDocuments: null,
  });

  const [uploadStatus, setUploadStatus] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Define service data directly for civil contract service
  const service = {
    id: "civil-contract",
    title: "Hợp đồng dân sự",
    category: "Dịch vụ Dân sự",
    description:
      "Dịch vụ hỗ trợ soạn thảo, tư vấn và công chứng các loại hợp đồng dân sự như hợp đồng mua bán, cho thuê, vay mượn, và các giao dịch dân sự khác.",
    process: [
      "Tiếp nhận yêu cầu và tài liệu",
      "Tư vấn pháp lý",
      "Soạn thảo hợp đồng",
      "Công chứng và xác thực",
      "Hoàn tất thủ tục",
    ],
    processingTime: "3-7 ngày làm việc",
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
    if (!formData.contractType)
      errors.contractType = "Vui lòng chọn loại hợp đồng";
    if (!formData.contractParties)
      errors.contractParties = "Vui lòng nhập thông tin các bên tham gia";
    if (!files.identificationDocuments)
      errors.identificationDocuments = "Vui lòng tải lên giấy tờ tùy thân";
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

      const response = await fetch("/api/civil-contract", {
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

          <form onSubmit={handleSubmit} className="civil-contract-form">
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
              <h3>Thông tin hợp đồng</h3>
              <div className="form-group">
                <label htmlFor="contractType">Loại hợp đồng *</label>
                <select
                  id="contractType"
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleInputChange}
                  className={formErrors.contractType ? "error" : ""}
                >
                  <option value="">Chọn loại hợp đồng</option>
                  <option value="mua-ban">Hợp đồng mua bán</option>
                  <option value="cho-thue">Hợp đồng cho thuê</option>
                  <option value="vay-muon">Hợp đồng vay mượn</option>
                  <option value="dich-vu">Hợp đồng dịch vụ</option>
                  <option value="khac">Loại khác</option>
                </select>
                {formErrors.contractType && (
                  <span className="error-message">
                    {formErrors.contractType}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="contractParties">Các bên tham gia *</label>
                <textarea
                  id="contractParties"
                  name="contractParties"
                  value={formData.contractParties}
                  onChange={handleInputChange}
                  className={formErrors.contractParties ? "error" : ""}
                  placeholder="Nhập thông tin các bên tham gia hợp đồng"
                />
                {formErrors.contractParties && (
                  <span className="error-message">
                    {formErrors.contractParties}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="contractValue">Giá trị hợp đồng</label>
                <input
                  type="text"
                  id="contractValue"
                  name="contractValue"
                  value={formData.contractValue}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 100,000,000 VNĐ"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contractDuration">Thời hạn hợp đồng</label>
                <input
                  type="text"
                  id="contractDuration"
                  name="contractDuration"
                  value={formData.contractDuration}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 12 tháng"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contractDescription">
                  Mô tả nội dung hợp đồng
                </label>
                <textarea
                  id="contractDescription"
                  name="contractDescription"
                  value={formData.contractDescription}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết nội dung và điều khoản của hợp đồng"
                />
              </div>
              <div className="form-group">
                <label htmlFor="additionalInfo">Thông tin bổ sung</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Các thông tin bổ sung khác (nếu có)"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Tải lên giấy tờ liên quan</h3>
              {renderFileUpload(
                "identificationDocuments",
                "Giấy tờ tùy thân (CMND/CCCD/Hộ chiếu)"
              )}
              {renderFileUpload(
                "contractDraft",
                "Bản thảo hợp đồng (nếu có)",
                false
              )}
              {renderFileUpload(
                "supportingDocuments",
                "Tài liệu hỗ trợ (nếu có)",
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

export default CivilContract;
