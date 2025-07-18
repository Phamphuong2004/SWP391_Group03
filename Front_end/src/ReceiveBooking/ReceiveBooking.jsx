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
import Swal from "sweetalert2";

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

  // Danh sách kit component chuẩn hóa từ bảng DB
  const kitComponentOptions = [
    {
      id: 1,
      name: "Buccal Swab",
      intro: "Dùng để thu mẫu tế bào niêm mạc miệng.",
    },
    {
      id: 2,
      name: "Sample Storage Bag",
      intro: "Bảo quản mẫu khô và sạch sau khi thu.",
    },
    {
      id: 3,
      name: "User Manual",
      intro: "Tài liệu hướng dẫn dán lấy và gửi mẫu xét nghiệm.",
    },
    {
      id: 4,
      name: "Bone Collection Tube",
      intro: "Dùng để chứa mẫu máu cốt hoặc xương.",
    },
    {
      id: 5,
      name: "Shockproof Box",
      intro: "Bảo vệ mẫu xương trong quá trình vận chuyển.",
    },
    {
      id: 6,
      name: "Personal DNA Test Kit",
      intro: "Dùng để kiểm tra cấu trúc ADN cá nhân.",
    },
    { id: 7, name: "Sample Envelope", intro: "Dùng để đựng mẫu thu thập." },
    {
      id: 8,
      name: "Legal Confirmation Form",
      intro: "Dùng trong hồ sơ pháp lý.",
    },
    {
      id: 9,
      name: "Prenatal DNA Test Kit",
      intro: "Dùng để thu mẫu thai nhi không xâm lấn.",
    },
    {
      id: 10,
      name: "Pregnancy Safety Guide",
      intro: "Tài liệu về an toàn lấy mẫu khi mang thai.",
    },
    {
      id: 11,
      name: "Custom DNA Kit",
      intro: "Dùng cho xét nghiệm đặc thù khác theo yêu cầu.",
    },
    { id: 12, name: "EDTA Tube", intro: "Ống thu mẫu máu nhiễm." },
    {
      id: 13,
      name: "Safety Instruction",
      intro: "Hướng dẫn sử dụng khi xét nghiệm thai nhi.",
    },
    {
      id: 14,
      name: "Genetic History Form",
      intro: "Mẫu tờ khai về bệnh lý gia đình.",
    },
    {
      id: 15,
      name: "Gene Report Guide",
      intro: "Mô tả cách đọc kết quả di truyền.",
    },
    {
      id: 16,
      name: "Administrative Form",
      intro: "Các giấy tờ cần thiết cho thủ tục.",
    },
    { id: 17, name: "Legal File Cover", intro: "Lưu trữ hồ sơ hành chính." },
    {
      id: 18,
      name: "Civil Dispute Form",
      intro: "Sử dụng trong tranh chấp dân sự.",
    },
    {
      id: 19,
      name: "Judicial File",
      intro: "Tài liệu bổ sung cho hồ sơ xét xử.",
    },
  ];

  // Thêm hàm chuyển đổi ngày giờ về local cho input datetime-local
  const toDatetimeLocal = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

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
        `/api/update/staff/${bookingId}`,
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
    console.log("Gọi handleDelete với bookingId:", bookingId);
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa đơn này?",
      text: "Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Không",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/delete-appointment/${bookingId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .then(() => {
            message.success("Xóa đơn thành công");
            fetchBookings();
          })
          .catch((error) => {
            console.error("Lỗi xóa:", error, error.response);
            const msg = error.response?.data?.message || error.message;
            message.error("Không thể xóa đơn: " + msg);
          });
      }
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
        appointmentDate:
          bookingData.appointmentDate || bookingData.appointment_date
            ? toDatetimeLocal(
                bookingData.appointmentDate || bookingData.appointment_date
              )
            : "",
        collectionSampleTime:
          bookingData.collectionSampleTime || bookingData.collection_sample_time
            ? toDatetimeLocal(
                bookingData.collectionSampleTime ||
                  bookingData.collection_sample_time
              )
            : "",
        kit_component_name:
          bookingData.kitComponentName || bookingData.kit_component_name || "",
      };
      form.resetFields();
      console.log("bookingDetails set vào form:", bookingDetails);
      form.setFieldsValue(bookingDetails);
      setIsEditing(false);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Không thể xem chi tiết đơn");
      setSelectedBooking(booking);
      setIsModalVisible(true);
    }
  };

  // Hàm lấy lịch hẹn guest
  const fetchGuestAppointments = async () => {
    if (!guestIdentifier || guestIdentifier.trim() === "") {
      message.error("Vui lòng nhập số điện thoại guest!");
      return;
    }
    if (!/^[0-9]{10,15}$/.test(guestIdentifier)) {
      message.error("Số điện thoại guest không đúng định dạng!");
      return;
    }
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

  // Handle form submission for update
  const handleSubmit = async (values) => {
    // Validation
    if (!values.fullName || values.fullName.trim() === "") {
      message.error("Tên khách hàng không được để trống!");
      return;
    }
    if (!values.phone || !/^[0-9]{10,15}$/.test(values.phone)) {
      message.error("Số điện thoại không hợp lệ!");
      return;
    }
    if (!values.appointmentDate || values.appointmentDate === "") {
      message.error("Ngày hẹn không được để trống!");
      return;
    }
    if (!values.status || values.status.trim() === "") {
      message.error("Trạng thái không được để trống!");
      return;
    }
    // Map lại trường cho backend camelCase
    const submitValues = {
      ...values,
      kitComponentName: values.kit_component_name,
    };
    delete submitValues.kit_component_name;
    try {
      await axios.put(
        `/api/update/staff/${selectedBooking.appointmentId}`,
        submitValues,
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
        `/api/update/staff/${bookingId}`,
        { staffId: user.id, status: "RECEIVED" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      message.success("Tiếp nhận đơn thành công");
      fetchBookings();
    } catch (error) {
      message.error("Không thể tiếp nhận đơn");
    }
  };

  // Thêm hàm hoàn thành đơn
  const handleComplete = async (bookingId) => {
    try {
      await axios.put(
        `/api/update/staff/${bookingId}`,
        { status: "COMPLETED" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      message.success("Đơn đã chuyển sang trạng thái hoàn thành!");
      fetchBookings();
    } catch (error) {
      message.error("Không thể cập nhật trạng thái hoàn thành!");
    }
  };

  // Hàm lọc theo trạng thái
  const fetchByStatus = async (status) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/appointments/by-status?status=${status}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Nếu response.data có trường body, lấy response.data.body
      if (response.data && response.data.body) {
        if (Array.isArray(response.data.body)) {
          setBookings(response.data.body);
        } else {
          setBookings([response.data.body]);
        }
      } else if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else if (response.data) {
        setBookings([response.data]);
      } else {
        setBookings([]);
      }
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
      title: "Tên kit",
      dataIndex: "kitComponentName",
      key: "kitComponentName",
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
                onClick={() => {
                  console.log("Bấm nút Xóa bookingId:", record.appointmentId);
                  handleDelete(record.appointmentId);
                }}
                style={{ marginRight: 8 }}
              >
                Xóa
              </Button>
              <Button
                type="dashed"
                onClick={() => handleAssign(record.appointmentId)}
                style={{ marginRight: 8 }}
              >
                Tiếp nhận
              </Button>
              <Button
                style={{ background: "#4caf50", color: "#fff" }}
                onClick={() => handleComplete(record.appointmentId)}
              >
                Hoàn thành
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  // Thêm mapping key sang tiếng Việt cho các trường cần hiển thị
  const fieldLabels = {
    appointmentId: "Mã đơn",
    fullName: "Tên khách hàng",
    dob: "Ngày sinh",
    phone: "Số điện thoại",
    email: "Email",
    gender: "Giới tính",
    testPurpose: "Mục đích xét nghiệm",
    testCategory: "Nhóm xét nghiệm",
    serviceType: "Loại dịch vụ",
    appointmentDate: "Ngày hẹn",
    collectionSampleTime: "Giờ lấy mẫu",
    collectionLocation: "Nơi lấy mẫu",
    fingerprintFile: "File vân tay",
    district: "Quận/Huyện",
    province: "Tỉnh/Thành phố",
    status: "Trạng thái",
    resultFile: "File kết quả",
    kitComponentName: "Tên kit",
    paymentStatus: "Trạng thái thanh toán",
  };

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
            <Option value="RECEIVED">Received</Option>
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
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedBooking && (
          <div style={{ marginTop: 8 }}>
            <h4>Tất cả thông tin chi tiết</h4>
            <table
              style={{
                width: "100%",
                background: "#f9f9f9",
                borderCollapse: "collapse",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 2px 8px #eee",
              }}
            >
              <tbody>
                {Object.entries(selectedBooking)
                  .filter(([key]) => fieldLabels[key])
                  .map(([key, value], idx) => (
                    <tr key={key || idx}>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: 8,
                          border: "1px solid #eee",
                          width: 180,
                          background: "#f0f0f0",
                        }}
                      >
                        {fieldLabels[key]}
                      </td>
                      <td style={{ padding: 8, border: "1px solid #eee" }}>
                        {value === null || value === undefined || value === ""
                          ? "Không có dữ liệu"
                          : String(value)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
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
