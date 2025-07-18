import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  getSampleByAppointmentId,
  createSampleByAppointmentId,
  updateSample,
  deleteSample,
} from "./SampleApi";
import "./SampleManagement.css";
const SampleManagement = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSample, setEditingSample] = useState(null);
  const [form] = Form.useForm();
  const [searchId, setSearchId] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSamples = async (appointmentId) => {
    setLoading(true);
    try {
      const data = await getSampleByAppointmentId(appointmentId, user?.token);
      setSamples(Array.isArray(data) ? data : [data]);
    } catch (err) {
      message.error("Không thể tải danh sách mẫu");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchId) return message.warning("Nhập mã lịch hẹn để tìm kiếm");
    fetchSamples(searchId);
  };

  const handleAdd = () => {
    setEditingSample(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (sample) => {
    setEditingSample(sample);
    form.setFieldsValue(sample);
    setIsModalVisible(true);
  };

  const handleDeleteSample = async (sampleId) => {
    try {
      await deleteSample(sampleId, user?.token);
      message.success("Xóa mẫu thành công");
      fetchSamples(searchId);
    } catch (err) {
      message.error("Không thể xóa mẫu");
    }
  };

  const handleCompleteSample = async (sample) => {
    try {
      await updateSample(
        sample.sampleId,
        { ...sample, status: "completed" },
        user?.token
      );
      message.success("Đã chuyển sang trạng thái hoàn thành!");
      fetchSamples(searchId);
    } catch (err) {
      message.error("Không thể cập nhật trạng thái!");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSample) {
        await updateSample(editingSample.sampleId, values, user?.token);
        message.success("Cập nhật mẫu thành công");
      } else {
        await createSampleByAppointmentId(searchId, values, user?.token);
        message.success("Thêm mẫu thành công");
      }
      setIsModalVisible(false);
      fetchSamples(searchId);
    } catch (err) {
      // Nếu là lỗi validation của form
      if (err && err.errorFields) return;
      // Nếu là lỗi từ server
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        message.error(err.response.data.message);
      } else if (err && err.message) {
        message.error(err.message);
      } else {
        message.error("Lưu mẫu thất bại");
      }
    }
  };

  const columns = [
    { title: "ID", dataIndex: "sampleId", key: "sampleId" },
    { title: "Loại mẫu", dataIndex: "sampleType", key: "sampleType" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => <span className="status">{text}</span>,
    },
    { title: "Ngày lấy mẫu", dataIndex: "collectedDate", key: "collectedDate" },
    {
      title: "Thành phần kit",
      dataIndex: "kitComponentName",
      key: "kitComponentName",
    },
    { title: "Người tạo", dataIndex: "username", key: "username" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) =>
        user?.role?.toLowerCase() === "staff" ||
        user?.role?.toLowerCase() === "manager" ? (
          <>
            <Button
              className="button"
              onClick={() => handleEdit(record)}
              style={{ marginRight: 8 }}
            >
              Sửa
            </Button>
            <Button
              danger
              className="button"
              onClick={() => handleDeleteSample(record.sampleId)}
            >
              Xóa
            </Button>
            <Button
              className="button"
              style={{ marginLeft: 8, background: "#4caf50", color: "#fff" }}
              onClick={() => handleCompleteSample(record)}
            >
              Hoàn thành
            </Button>
          </>
        ) : null,
    },
  ];

  return (
    <div className="sample-management-container">
      <h1 className="sample-management-title">Quản lý mẫu xét nghiệm</h1>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập mã lịch hẹn (appointmentId)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ width: 240, marginRight: 8 }}
        />
        <Button
          type="primary"
          className="button"
          onClick={handleSearch}
          style={{ marginRight: 8 }}
        >
          Tìm kiếm
        </Button>
        {(user?.role?.toLowerCase() === "staff" ||
          user?.role?.toLowerCase() === "manager") && (
          <Button className="button" onClick={handleAdd}>
            Thêm mẫu
          </Button>
        )}
      </div>
      <Table
        className="sample-management-table"
        columns={columns}
        dataSource={samples}
        loading={loading}
        rowKey="sampleId"
        pagination={false}
      />
      <Modal
        title={editingSample ? "Cập nhật mẫu" : "Thêm mẫu mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="sampleType"
            label="Loại mẫu"
            rules={[
              { required: true, message: "Vui lòng nhập loại mẫu" },
              { pattern: /^[A-Za-zÀ-ỹ\s]+$/, message: "Chỉ nhập chữ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng nhập trạng thái" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="collectedDate"
            label="Ngày lấy mẫu"
            rules={[
              { required: true, message: "Vui lòng chọn ngày lấy mẫu" },
              {
                validator: (_, value) =>
                  !value || /^\d{4}-\d{2}-\d{2}$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        "Định dạng ngày không hợp lệ (YYYY-MM-DD)"
                      ),
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item name="kitComponentName" label="Thành phần kit">
            <Input disabled />
          </Form.Item>
          <Form.Item name="username" label="Người tạo">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SampleManagement;
