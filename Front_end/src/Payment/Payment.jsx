import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ADNTestingServices from '../listOfServices';
import './Payment.css';
import { toast } from 'react-toastify';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { appointment } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    if (!appointment) {
        return (
            <div className="payment-container">
                <div className="payment-card" style={{ textAlign: 'center' }}>
                    <h1 className="payment-title">Không tìm thấy thông tin lịch hẹn</h1>
                    <p style={{ margin: '1.5rem 0' }}>Vui lòng quay lại và đặt lịch hẹn trước khi thanh toán.</p>
                    <button onClick={() => navigate('/booking')} className="btn btn-primary">
                        Đặt lịch ngay
                    </button>
                </div>
            </div>
        );
    }

    const serviceDetails = ADNTestingServices.find(service => service.testType === appointment.serviceType);

    const handlePayment = () => {
        if (!paymentMethod) {
            toast.warn('Vui lòng chọn phương thức thanh toán.');
            return;
        }

        console.log('Xử lý thanh toán cho lịch hẹn:', appointment.appointmentId);
        console.log('Phương thức thanh toán:', paymentMethod);
        console.log('Số tiền:', serviceDetails?.price);

        // Giả lập xử lý thanh toán
        toast.success('Thanh toán thành công! Lịch hẹn của bạn đã được xác nhận.');

        const newHistoryItem = {
            id: appointment.appointmentId,
            serviceName: appointment.serviceType,
            appointmentDate: appointment.appointmentDate,
            status: 'Đang xử lý',
            price: serviceDetails?.price || 'N/A'
        };

        // Đặt trạng thái thanh toán thành công
        setPaymentSuccess(true);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // Hiển thị màn hình thanh toán thành công
    if (paymentSuccess) {
        return (
            <div className="payment-container">
                <div className="payment-card success-card">
                    <div className="success-icon">✓</div>
                    <h1 className="payment-title success-title">Thanh toán thành công!</h1>
                    <div className="success-message">
                        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                        <p>Lịch hẹn của bạn đã được xác nhận và sẽ được xử lý trong thời gian sớm nhất.</p>
                    </div>
                    <div className="appointment-summary">
                        <h3>Thông tin lịch hẹn:</h3>
                        <p><strong>Họ và tên:</strong> {appointment.fullName}</p>
                        <p><strong>Ngày hẹn:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                        <p><strong>Giờ lấy mẫu:</strong> {appointment.collectionTime.substring(11, 16)}</p>
                        <p><strong>Loại dịch vụ:</strong> {appointment.serviceType}</p>
                        <p><strong>Số tiền:</strong> {serviceDetails?.price}</p>
                    </div>
                    <div className="success-actions">
                        <button onClick={handleBackToHome} className="btn-home">
                            Quay lại trang chủ
                        </button>
                        <button onClick={() => navigate('/booking-history')} className="btn-history">
                            Xem lịch sử đặt lịch
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <div className="payment-card">
                <h1 className="payment-title">Xác nhận và Thanh toán</h1>

                <div className="appointment-details">
                    <h2>Chi tiết lịch hẹn</h2>
                    <p><strong>Họ và tên:</strong> {appointment.fullName}</p>
                    <p><strong>Ngày hẹn:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p><strong>Giờ lấy mẫu:</strong> {appointment.collectionTime.substring(11, 16)}</p>
                    <p><strong>Loại dịch vụ:</strong> {appointment.serviceType}</p>
                </div>

                {serviceDetails && (
                    <div className="service-details">
                        <h2>Chi tiết dịch vụ</h2>
                        <p><strong>Mô tả:</strong> {serviceDetails.description}</p>
                        <p className="price"><strong>Tổng tiền:</strong> {serviceDetails.price}</p>
                    </div>
                )}

                <div className="payment-methods">
                    <h2>Chọn phương thức thanh toán</h2>
                    <div className="method-option">
                        <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            value="cod"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="cod">Thanh toán khi đến lấy mẫu (COD)</label>
                    </div>
                    <div className="method-option">
                        <input
                            type="radio"
                            id="online"
                            name="paymentMethod"
                            value="online"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="online">Thanh toán trực tuyến (VNPAY, Momo, ...)</label>
                    </div>
                </div>

                <button onClick={handlePayment} className="btn-submit-payment">
                    Xác nhận và Thanh toán
                </button>
            </div>
        </div>
    );
};

export default Payment;
