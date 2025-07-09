import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import "./StaffResult.css";
import {
  getResultList,
  createResult,
  updateResult,
  deleteResult,
  getResultById,
} from "../result/ResultsApi";

const StaffResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [form] = Form.useForm();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailResult, setDetailResult] = useState(null);
  const [filterAppointmentId, setFilterAppointmentId] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    try {
      const userString = localStorage.getItem("user");
      const token = userString ? JSON.parse(userString).token : null;
      const { data } = await getResultList(token);
      setResults(data);
    } catch {
      message.error("Không thể tải danh sách kết quả");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleAdd = () => {
    setEditingResult(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingResult(record);
    form.setFieldsValue({
      resultDate: record.resultDate,
      resultData: record.resultData,
      interpretation: record.interpretation,
      status: record.status,
      sampleId: record.sampleId,
      username: record.username,
      appointmentId: record.appointmentId,
      resultFile: record.resultFile,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const userString = localStorage.getItem("user");
      const token = userString ? JSON.parse(userString).token : null;
      await deleteResult(id, token);
      message.success("Xóa kết quả thành công");
      fetchResults();
    } catch {
      message.error("Không thể xóa kết quả");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const username = user ? user.username : null;
      const payload = {
        resultDate: values.resultDate,
        resultData: values.resultData,
        interpretation: values.interpretation,
        status: values.status,
        sampleId: values.sampleId,
        username: username,
        appointmentId: values.appointmentId,
        resultFile: values.resultFile,
      };
      const token = user ? user.token : null;
      if (editingResult) {
        await updateResult(editingResult.id, payload, token);
        message.success("Cập nhật kết quả thành công");
      } else {
        await createResult(payload, token);
        message.success("Thêm kết quả thành công");
      }
      setIsModalVisible(false);
      fetchResults();
    } catch {
      message.error("Lưu kết quả thất bại");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      form.setFieldsValue({ resultFile: file.name });
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const userString = localStorage.getItem("user");
      const token = userString ? JSON.parse(userString).token : null;
      const { data } = await getResultById(id, token);
      setDetailResult(data);
      setDetailModalVisible(true);
    } catch {
      message.error("Không thể tải chi tiết kết quả");
    }
  };

  // --- Sửa lỗi gọi API với undefined triệt để ---
  const handleFilter = async () => {
    if (!filterAppointmentId || filterAppointmentId === "undefined") {
      // Nếu input rỗng hoặc là undefined, chỉ load lại toàn bộ danh sách
      setFilterAppointmentId("");
      fetchResults();
      return;
    }
    if (!/^[0-9]+$/.test(filterAppointmentId)) {
      message.error("Mã lịch hẹn phải là số!");
      return;
    }
    try {
      const userString = localStorage.getItem("user");
      const token = userString ? JSON.parse(userString).token : null;
      const res = await fetch(
        `/api/results/appointment/${filterAppointmentId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();
      setResults(Array.isArray(data) ? data : data ? [data] : []);
    } catch {
      message.error("Không thể lọc kết quả theo mã lịch hẹn");
      setResults([]);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Ngày trả kết quả", dataIndex: "resultDate", key: "resultDate" },
    { title: "Kết quả", dataIndex: "resultData", key: "resultData" },
    { title: "Nhận định", dataIndex: "interpretation", key: "interpretation" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => <span className="status">{text}</span>,
    },
    { title: "ID mẫu", dataIndex: "sampleId", key: "sampleId" },
    { title: "Người nhập", dataIndex: "username", key: "username" },
    { title: "Mã lịch hẹn", dataIndex: "appointmentId", key: "appointmentId" },
    { title: "File kết quả", dataIndex: "resultFile", key: "resultFile" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            className="button"
            onClick={() => handleViewDetail(record.id)}
            style={{ marginRight: 8 }}
          >
            Xem chi tiết
          </Button>
          <Button
            className="button"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger className="button">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="staff-result-container">
      <h1 className="staff-result-title">Quản lý kết quả xét nghiệm</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Input
          placeholder="Lọc theo mã lịch hẹn"
          value={filterAppointmentId}
          onChange={(e) => setFilterAppointmentId(e.target.value)}
          style={{ width: 200 }}
        />
        <Button className="button" onClick={handleFilter}>
          Lọc
        </Button>
        <Button
          className="button"
          onClick={() => {
            setFilterAppointmentId("");
            fetchResults();
          }}
        >
          Bỏ lọc
        </Button>
        <Button
          type="primary"
          className="button"
          onClick={handleAdd}
          style={{ marginLeft: "auto" }}
        >
          Thêm kết quả
        </Button>
      </div>
      <Table
        className="staff-result-table"
        columns={columns}
        dataSource={results}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={false}
      />
      <Modal
        title={editingResult ? "Cập nhật kết quả" : "Thêm kết quả mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="resultDate"
            label="Ngày trả kết quả"
            rules={[{ required: true }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="resultData"
            label="Kết quả xét nghiệm"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="interpretation"
            label="Nhận định"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sampleId"
            label="ID mẫu"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Người nhập"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="appointmentId"
            label="Mã lịch hẹn"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="File kết quả" required>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </Form.Item>
          <Form.Item
            name="resultFile"
            style={{ display: "none" }}
            rules={[
              { required: true, message: "Vui lòng nhập file kết quả!" },
              {
                pattern: /\.(pdf|docx?|PDF|DOCX?)$/,
                message: "File phải là PDF, DOC hoặc DOCX!",
              },
            ]}
          >
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chi tiết kết quả"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
      >
        {detailResult ? (
          <div>
            {Object.entries(detailResult).map(([key, value]) => (
              <p key={key}>
                <b>{key}:</b> {value}
              </p>
            ))}
          </div>
        ) : (
          <p>Đang tải...</p>
        )}
      </Modal>
    </div>
  );
};

export default StaffResult;
