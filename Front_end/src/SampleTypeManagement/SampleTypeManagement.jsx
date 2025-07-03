import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import {
  getAllSampleTypes,
  createSampleType,
  updateSampleType,
  deleteSampleType,
} from "../SampleManagement/SampleApi";

const SampleTypeManagement = () => {
  const [sampleTypes, setSampleTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSampleType, setEditingSampleType] = useState(null);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSampleTypes = async () => {
    setLoading(true);
    try {
      const data = await getAllSampleTypes(user?.token);
      setSampleTypes(data);
    } catch {
      message.error("Không thể tải danh sách loại mẫu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSampleTypes();
    // eslint-disable-next-line
  }, []);

  const handleAdd = () => {
    setEditingSampleType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingSampleType(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSampleType(id, user?.token);
      message.success("Xóa loại mẫu thành công");
      fetchSampleTypes();
    } catch {
      message.error("Không thể xóa loại mẫu");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSampleType) {
        await updateSampleType(editingSampleType.id, values, user?.token);
        message.success("Cập nhật loại mẫu thành công");
      } else {
        await createSampleType(values, user?.token);
        message.success("Thêm loại mẫu thành công");
      }
      setIsModalVisible(false);
      fetchSampleTypes();
    } catch {
      message.error("Lưu loại mẫu thất bại");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên loại mẫu", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Tên bộ kit", dataIndex: "componentName", key: "componentName" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Quản lý loại mẫu</h1>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Thêm loại mẫu
      </Button>
      <Table
        columns={columns}
        dataSource={sampleTypes}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title={editingSampleType ? "Cập nhật loại mẫu" : "Thêm loại mẫu mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên loại mẫu"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="componentName"
            label="Tên bộ kit"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SampleTypeManagement;
