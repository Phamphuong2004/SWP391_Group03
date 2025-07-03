import React, { useEffect, useState } from "react";
import {
  getAllPayments,
  deletePayment,
  getPaymentById,
  createPayment,
  updatePayment,
} from "./PaymentApi";
import "./InvoiceList.css";
import { message } from "antd";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userString = localStorage.getItem("user");
        const token = userString ? JSON.parse(userString).token : null;
        if (!token) throw new Error("Bạn cần đăng nhập!");
        const data = await getAllPayments(token);
        setInvoices(data);
      } catch {
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "PAID") return inv.status === "PAID";
    if (statusFilter === "PENDING") return inv.status === "PENDING";
    return true;
  });

  const handleDeletePayment = async (paymentId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      if (!token) throw new Error("Bạn cần đăng nhập!");
      if (!window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) return;
      await deletePayment(paymentId, token);
      message.success("Xóa hóa đơn thành công!");
      const data = await getAllPayments(token);
      setInvoices(data);
    } catch (err) {
      message.error(
        "Không thể xóa hóa đơn! " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleView = async (paymentId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const data = await getPaymentById(paymentId, token);
      setModalData(data);
      setModalType("view");
      setShowModal(true);
    } catch (err) {
      message.error("Không thể lấy chi tiết hóa đơn!");
    }
  };

  const handleEdit = async (paymentId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const data = await getPaymentById(paymentId, token);
      setModalData(data);
      setModalType("edit");
      setShowModal(true);
    } catch (err) {
      message.error("Không thể lấy dữ liệu để sửa!");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      await updatePayment(modalData.paymentId, modalData, token);
      message.success("Cập nhật hóa đơn thành công!");
      setShowModal(false);
      const data = await getAllPayments(token);
      setInvoices(data);
    } catch (err) {
      message.error("Không thể cập nhật hóa đơn!");
    }
  };

  const handleCreate = () => {
    setModalData({
      appointmentId: "",
      amount: "",
      method: "",
      status: "PENDING",
      paymentDate: new Date().toISOString(),
    });
    setModalType("create");
    setShowModal(true);
  };

  const handleSaveCreate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      await createPayment(modalData, token);
      message.success("Tạo hóa đơn thành công!");
      setShowModal(false);
      const data = await getAllPayments(token);
      setInvoices(data);
    } catch (err) {
      message.error("Không thể tạo hóa đơn!");
    }
  };

  return (
    <div className="payment-bg">
      <div className="payment-card payment-shadow">
        <h1 className="payment-title">Danh sách hóa đơn</h1>
        <button
          className="btn-confirm"
          style={{
            width: "fit-content",
            marginBottom: 16,
            background: "#2563eb",
          }}
          onClick={handleCreate}
        >
          Thêm mới hóa đơn
        </button>
        <div className="section-title" style={{ marginBottom: 16 }}>
          <label>Lọc trạng thái: </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ marginLeft: 8 }}
          >
            <option value="ALL">Tất cả</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="PENDING">Chưa thanh toán</option>
          </select>
        </div>
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : filteredInvoices.length === 0 ? (
          <div>Không có hóa đơn nào.</div>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Mã hóa đơn</th>
                <th>Mã lịch hẹn</th>
                <th>Số tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.paymentId}>
                  <td>{inv.paymentId}</td>
                  <td>{inv.appointmentId}</td>
                  <td>{inv.amount}</td>
                  <td>{inv.method}</td>
                  <td>
                    {inv.status === "PAID" ? (
                      <span className="status-paid">Đã thanh toán</span>
                    ) : (
                      <span className="status-pending">Chưa thanh toán</span>
                    )}
                  </td>
                  <td>
                    {inv.createdAt
                      ? new Date(inv.createdAt).toLocaleString()
                      : ""}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-confirm delete"
                        onClick={() => handleDeletePayment(inv.paymentId)}
                      >
                        Xóa
                      </button>
                      <button
                        className="btn-confirm edit"
                        onClick={() => handleEdit(inv.paymentId)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn-confirm view"
                        onClick={() => handleView(inv.paymentId)}
                      >
                        Xem
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              minWidth: 320,
              maxWidth: 400,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }}
          >
            <h2 style={{ color: "#2563eb", marginBottom: 16 }}>
              {modalType === "view" && "Chi tiết hóa đơn"}
              {modalType === "edit" && "Sửa hóa đơn"}
              {modalType === "create" && "Thêm mới hóa đơn"}
            </h2>
            <div style={{ marginBottom: 16 }}>
              <div>
                <b>Mã hóa đơn:</b> {modalData?.paymentId || "(Tự sinh)"}
              </div>
              <div>
                <b>Mã lịch hẹn:</b>{" "}
                {modalType === "view" ? (
                  modalData?.appointmentId
                ) : (
                  <input
                    value={modalData?.appointmentId || ""}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        appointmentId: e.target.value,
                      })
                    }
                  />
                )}
              </div>
              <div>
                <b>Số tiền:</b>{" "}
                {modalType === "view" ? (
                  modalData?.amount
                ) : (
                  <input
                    value={modalData?.amount || ""}
                    onChange={(e) =>
                      setModalData({ ...modalData, amount: e.target.value })
                    }
                  />
                )}
              </div>
              <div>
                <b>Phương thức:</b>{" "}
                {modalType === "view" ? (
                  modalData?.method
                ) : (
                  <input
                    value={modalData?.method || ""}
                    onChange={(e) =>
                      setModalData({ ...modalData, method: e.target.value })
                    }
                  />
                )}
              </div>
              <div>
                <b>Trạng thái:</b>{" "}
                {modalType === "view" ? (
                  modalData?.status
                ) : (
                  <select
                    value={modalData?.status || "PENDING"}
                    onChange={(e) =>
                      setModalData({ ...modalData, status: e.target.value })
                    }
                  >
                    <option value="PENDING">Chưa thanh toán</option>
                    <option value="PAID">Đã thanh toán</option>
                  </select>
                )}
              </div>
              <div>
                <b>Ngày tạo:</b>{" "}
                {modalType === "view" ? (
                  modalData?.paymentDate ? (
                    new Date(modalData.paymentDate).toLocaleString()
                  ) : (
                    ""
                  )
                ) : (
                  <input
                    type="datetime-local"
                    value={
                      modalData?.paymentDate
                        ? modalData.paymentDate.slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        paymentDate: e.target.value,
                      })
                    }
                  />
                )}
              </div>
            </div>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
            >
              <button
                className="btn-confirm"
                style={{ background: "#888" }}
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
              {modalType === "edit" && (
                <button className="btn-confirm" onClick={handleSaveEdit}>
                  Lưu
                </button>
              )}
              {modalType === "create" && (
                <button className="btn-confirm" onClick={handleSaveCreate}>
                  Tạo mới
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
