import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ServiceTracking.css';

const ServiceTracking = () => {
    const { serviceId } = useParams();
    const [trackingData, setTrackingData] = useState({
        serviceId: '',
        serviceType: '',
        status: '',
        currentStep: 0,
        steps: [],
        submittedDate: '',
        estimatedCompletionDate: '',
        documents: [],
        notes: [],
        lastUpdated: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate fetching tracking data
        const fetchTrackingData = async () => {
            try {
                // In a real application, this would be an API call
                const response = await fetch(`/api/service-tracking/${serviceId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tracking data');
                }
                const data = await response.json();
                setTrackingData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrackingData();
    }, [serviceId]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return '#2ecc71';
            case 'in progress':
                return '#3498db';
            case 'pending':
                return '#f1c40f';
            case 'cancelled':
                return '#e74c3c';
            default:
                return '#95a5a6';
        }
    };

    if (loading) {
        return (
            <div className="tracking-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tracking-container">
                <div className="error-message">
                    <h3>Lỗi</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tracking-container">
            <div className="tracking-header">
                <h1>Theo dõi dịch vụ</h1>
                <div className="service-info">
                    <h2>{trackingData.serviceType}</h2>
                    <div className="status-badge" style={{ backgroundColor: getStatusColor(trackingData.status) }}>
                        {trackingData.status}
                    </div>
                </div>
            </div>

            <div className="tracking-content">
                <div className="tracking-timeline">
                    <h3>Tiến trình xử lý</h3>
                    <div className="timeline">
                        {trackingData.steps.map((step, index) => (
                            <div key={index} className={`timeline-item ${index <= trackingData.currentStep ? 'completed' : ''}`}>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h4>{step.title}</h4>
                                    <p>{step.description}</p>
                                    {step.completedDate && (
                                        <span className="completion-date">
                                            Hoàn thành: {new Date(step.completedDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="timeline-progress">
                        <div
                            className="progress-bar"
                            style={{ width: `${(trackingData.currentStep / (trackingData.steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="tracking-details">
                    <div className="detail-section">
                        <h3>Thông tin chung</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Mã dịch vụ:</label>
                                <span>{trackingData.serviceId}</span>
                            </div>
                            <div className="detail-item">
                                <label>Ngày nộp:</label>
                                <span>{new Date(trackingData.submittedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                                <label>Dự kiến hoàn thành:</label>
                                <span>{new Date(trackingData.estimatedCompletionDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                                <label>Cập nhật lần cuối:</label>
                                <span>{new Date(trackingData.lastUpdated).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Tài liệu đã nộp</h3>
                        <div className="documents-list">
                            {trackingData.documents.map((doc, index) => (
                                <div key={index} className="document-item">
                                    <i className="document-icon">📄</i>
                                    <div className="document-info">
                                        <span className="document-name">{doc.name}</span>
                                        <span className="document-status">{doc.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Ghi chú</h3>
                        <div className="notes-list">
                            {trackingData.notes.map((note, index) => (
                                <div key={index} className="note-item">
                                    <div className="note-header">
                                        <span className="note-date">
                                            {new Date(note.date).toLocaleString()}
                                        </span>
                                        <span className="note-author">{note.author}</span>
                                    </div>
                                    <p className="note-content">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceTracking; 