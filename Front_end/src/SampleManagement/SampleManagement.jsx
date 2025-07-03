import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  getSampleByAppointmentId,
  createSampleByAppointmentId,
  updateSample,
  deleteSample,
} from "./SampleApi";

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
      message.error("Lưu mẫu thất bại");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "sampleId", key: "sampleId" },
    { title: "Loại mẫu", dataIndex: "sampleType", key: "sampleType" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
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
              onClick={() => handleEdit(record)}
              style={{ marginRight: 8 }}
            >
              Sửa
            </Button>
            <Button danger onClick={() => handleDeleteSample(record.sampleId)}>
              Xóa
            </Button>
          </>
        ) : null,
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Quản lý mẫu xét nghiệm</h1>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập mã lịch hẹn (appointmentId)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ width: 240, marginRight: 8 }}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          style={{ marginRight: 8 }}
        >
          Tìm kiếm
        </Button>
        {(user?.role?.toLowerCase() === "staff" ||
          user?.role?.toLowerCase() === "manager") && (
          <Button onClick={handleAdd}>Thêm mẫu</Button>
        )}
      </div>
      <Table
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
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="collectedDate"
            label="Ngày lấy mẫu"
            rules={[{ required: true }]}
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
