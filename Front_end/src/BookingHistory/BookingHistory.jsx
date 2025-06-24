import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './BookingHistory.css';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [newlyAddedBooking, setNewlyAddedBooking] = useState(null);

    useEffect(() => {
        if (location.state?.newBooking) {
            setNewlyAddedBooking(location.state.newBooking);
            window.history.replaceState({}, document.title)
        }
    }, [location.state]);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            setIsLoading(true);
            try {
                const userString = localStorage.getItem("user");
                if (!userString) {
                    toast.error("Vui lòng đăng nhập để xem lịch sử.");
                    setIsLoading(false);
                    return;
                }
                const user = JSON.parse(userString);
                const token = user.token;

                // Thay thế bằng endpoint API thực tế của bạn
                const response = await axios.get('/api/my-appointments', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data) {
                    setBookings(response.data);
                }
            } catch (error) {
                // Giả lập dữ liệu nếu API lỗi hoặc chưa có
                console.error("Lỗi khi lấy lịch sử đặt lịch:", error);
                toast.info("Sử dụng dữ liệu giả lập do không thể kết nối API.");
                const mockData = [
                    { id: 1, serviceName: 'Xét nghiệm huyết thống cha-con', appointmentDate: '2024-05-20', status: 'Đã hoàn thành', price: '$200' },
                    { id: 2, serviceName: 'Xét nghiệm ADN trước sinh', appointmentDate: '2024-05-25', status: 'Đã hủy', price: '$800' },
                    { id: 3, serviceName: 'Xét nghiệm song sinh', appointmentDate: '2024-06-10', status: 'Đang xử lý', price: '$150' },
                ];
                setBookings(mockData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingHistory();
    }, []);

    return (
        <div className="booking-history-container">
            <div className="history-card">
                <h1 className="history-title">Lịch sử đặt lịch</h1>
                {isLoading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : bookings.length > 0 ? (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Tên dịch vụ</th>
                                <th>Ngày hẹn</th>
                                <th>Trạng thái</th>
                                <th>Chi phí</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newlyAddedBooking && (
                                <tr key={newlyAddedBooking.id} className="new-booking-row">
                                    <td>{newlyAddedBooking.id}</td>
                                    <td>{newlyAddedBooking.serviceName}</td>
                                    <td>{new Date(newlyAddedBooking.appointmentDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${newlyAddedBooking.status?.toLowerCase().replace(' ', '-')}`}>
                                            {newlyAddedBooking.status}
                                        </span>
                                    </td>
                                    <td>{newlyAddedBooking.price}</td>
                                </tr>
                            )}
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td>{booking.serviceName}</td>
                                    <td>{new Date(booking.appointmentDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${booking.status?.toLowerCase().replace(' ', '-')}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>{booking.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Bạn chưa có lịch hẹn nào.</p>
                )}
            </div>
        </div>
    );
};

export default BookingHistory; 