import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  message,
  Input,
  Select,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import "./ReceiveBooking.css";

const { Option } = Select;

const ReceiveBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isEditing, setIsEditing] = useState(false);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const [guestIdentifier, setGuestIdentifier] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [guestBookings, setGuestBookings] = useState([]);

  const kitComponentOptions = [
    "Sample Tube",
    "Barcode Sticker",
    "Instruction Manual",
    "Consent Form",
    "Bone Collection Kit",
    "Sterile Container",
    "DNA Card",
    "Desiccant Packet",
    "Legal Consent Form",
    "Evidence Seal Sticker",
    "Fetal Sample Tube",
    "Mother Consent Form",
    "Multi-Purpose Swab",
    "Non-Invasive Kit",
    "Genetic Risk Form",
    "Application Form",
    "Civil Dispute Envelope",
  ];

  // Fetch bookings based on user role
  const fetchBookings = async () => {
    if (!user || !user.token) {
      message.error("Bạn phải đăng nhập để xem các đơn đặt lịch.");
      return;
    }
    try {
      setLoading(true);
      let apiUrl = "";
      const userRole = user.role.toLowerCase();
      if (userRole === "staff" || userRole === "manager") {
        apiUrl = "/api/get-all-appointments";
      } else if (userRole === "customer") {
        apiUrl = "/api/view-appointments-user";
      } else {
        message.error("Vai trò của bạn không được hỗ trợ.");
        setLoading(false);
        return;
      }

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const appointments = Array.isArray(response.data)
        ? response.data
        : response.data.data && Array.isArray(response.data.data)
        ? response.data.data
        : [];

      console.log("API appointments:", appointments);
      setBookings(appointments);
    } catch (error) {
      message.error("Không thể tải danh sách đơn đặt lịch.");
      console.error("Fetch bookings error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle booking status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `/api/update-appointment/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      message.success("Cập nhật trạng thái thành công");
      fetchBookings();
    } catch (error) {
      message.error("Không thể cập nhật trạng thái");
      console.error(
        "Status update error:",
        error.response?.data || error.message
      );
    }
  };

  // Handle delete booking
  const handleDelete = (bookingId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa đơn này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        try {
          await axios.delete(`/api/delete-appointment/${bookingId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          message.success("Xóa đơn thành công");
          fetchBookings();
        } catch (error) {
          message.error("Không thể xóa đơn");
        }
      },
    });
  };

  // Show booking details modal
  const showBookingDetails = async (booking) => {
    const id = booking.appointmentId;
    try {
      const response = await axios.get(`/api/view-appointment/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const bookingData = response.data || booking;
      setSelectedBooking(bookingData);
      const bookingDetails = {
        ...bookingData,
        appointmentDate: bookingData.appointmentDate
          ? new Date(bookingData.appointmentDate).toISOString().slice(0, 16)
          : "",
        collectionSampleTime: bookingData.collectionSampleTime
          ? new Date(bookingData.collectionSampleTime)
              .toISOString()
              .slice(0, 16)
          : "",
      };
      form.setFieldsValue(bookingDetails);
      setIsEditing(false);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Không thể xem chi tiết đơn");
      setSelectedBooking(booking);
      setIsModalVisible(true);
    }
  };

  // Handle form submission for update
  const handleSubmit = async (values) => {
    try {
      await axios.put(
        `/api/update-appointment/${selectedBooking.appointmentId}`,
        values,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      message.success("Cập nhật đơn thành công");
      setIsModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error("Không thể cập nhật đơn");
    }
  };

  // Thêm hàm tiếp nhận đơn
  const handleAssign = async (bookingId) => {
    try {
      await axios.put(
        `/api/update-appointment/${bookingId}`,
        { staffId: user.id, status: "RECEIVED" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      message.success("Tiếp nhận đơn thành công");
      fetchBookings();
    } catch (error) {
      message.error("Không thể tiếp nhận đơn");
    }
  };

  // Hàm lấy lịch hẹn guest
  const fetchGuestAppointments = async () => {
    try {
      setLoading(true);
      // Ví dụ: dùng phone làm định danh guest, có thể thay đổi theo backend
      const response = await axios.get(
        `/api/view-appointment-guest?phone=${guestIdentifier}`
      );
      setGuestBookings(Array.isArray(response.data) ? response.data : []);
      setGuestModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy lịch hẹn guest");
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc theo trạng thái
  const fetchByStatus = async (status) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/get/appointment-by-status?status=${status}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      message.error("Không thể lọc theo trạng thái");
    } finally {
      setLoading(false);
    }
  };

  console.log("Bookings render:", bookings);
  const columns = [
    {
      title: "ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
      render: (text) => text || "Không có dữ liệu",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => text || "Không có dữ liệu",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (text) =>
        text ? new Date(text).toLocaleDateString() : "Không có dữ liệu",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "Không có dữ liệu",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => text || "Không có dữ liệu",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => showBookingDetails(record)}
            style={{ marginRight: 8 }}
          >
            Xem chi tiết
          </Button>
          {(user.role.toLowerCase() === "staff" ||
            user.role.toLowerCase() === "manager") && (
            <>
              <Button
                type="primary"
                onClick={() =>
                  handleStatusUpdate(record.appointmentId, "CONFIRMED")
                }
                style={{
                  marginRight: 8,
                  background: "#52c41a",
                  borderColor: "#52c41a",
                }}
              >
                Xác nhận
              </Button>
              <Button
                danger
                onClick={() =>
                  handleStatusUpdate(record.appointmentId, "CANCELLED")
                }
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button
                danger
                type="primary"
                onClick={() => handleDelete(record.appointmentId)}
                style={{ marginRight: 8 }}
              >
                Xóa
              </Button>
              <Button
                type="dashed"
                onClick={() => handleAssign(record.appointmentId)}
              >
                Tiếp nhận
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="receive-booking-container">
      <h1 className="receive-booking-title">
        {user.role === "customer"
          ? "Các đơn đã đặt của bạn"
          : "Quản lý đơn đặt lịch"}
      </h1>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Button onClick={() => setGuestModalVisible(true)}>
            Xem lịch hẹn guest
          </Button>
        </Col>
        <Col>
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 180 }}
            allowClear
            onChange={(value) => {
              setStatusFilter(value);
              if (value) fetchByStatus(value);
              else fetchBookings();
            }}
            value={statusFilter}
          >
            <Option value="PENDING">Pending</Option>
            <Option value="CONFIRMED">Confirmed</Option>
            <Option value="CANCELLED">Cancelled</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={bookings}
        loading={loading}
        rowKey="appointmentId"
      />

      <Modal
        title="Chi tiết đơn đặt lịch"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          user.role.toLowerCase() === "staff" ||
          user.role.toLowerCase() === "manager"
            ? [
                !isEditing && (
                  <Button
                    key="edit"
                    type="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                ),
                isEditing && (
                  <Button
                    key="save"
                    type="primary"
                    onClick={() => form.submit()}
                  >
                    Lưu
                  </Button>
                ),
                <Button
                  key="cancel"
                  onClick={() => {
                    setIsEditing(false);
                    form.setFieldsValue(selectedBooking);
                  }}
                >
                  Hủy
                </Button>,
              ]
            : [
                <Button key="close" onClick={() => setIsModalVisible(false)}>
                  Đóng
                </Button>,
              ]
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={!isEditing}
        >
          <Form.Item
            name="fullName"
            label="Tên khách hàng"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="appointmentDate"
            label="Ngày giờ hẹn lấy mẫu"
            rules={[{ required: true }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="collectionSampleTime" label="Giờ lấy mẫu">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="PENDING">Pending</Option>
              <Option value="CONFIRMED">Confirmed</Option>
              <Option value="CANCELLED">Cancelled</Option>
              <Option value="COMPLETED">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="kit_component_name"
            label="Kit Component Name"
            rules={[{ required: false }]}
          >
            <Select allowClear showSearch placeholder="Chọn kit component">
              {kitComponentOptions.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="resultFile"
            label="Result File"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="serviceType" label="Loại dịch vụ">
            <Input disabled />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input disabled />
          </Form.Item>
          <Form.Item name="testCategory" label="Loại xét nghiệm">
            <Input disabled />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea disabled />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xem lịch hẹn guest"
        open={guestModalVisible}
        onCancel={() => setGuestModalVisible(false)}
        footer={null}
      >
        <Input
          placeholder="Nhập số điện thoại guest"
          value={guestIdentifier}
          onChange={(e) => setGuestIdentifier(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Button
          type="primary"
          onClick={fetchGuestAppointments}
          disabled={!guestIdentifier}
          style={{ marginBottom: 16 }}
        >
          Tìm kiếm
        </Button>
        <Table
          columns={columns}
          dataSource={guestBookings}
          rowKey="appointmentId"
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default ReceiveBooking;
