import React, { useEffect, useState } from "react";
import { getResultList, getResultByAppointmentId } from "./ResultsApi";
import { getAllSampleTypes } from "../SampleManagement/SampleApi";
import "./ResultList.css";

const ResultList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentId, setAppointmentId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [sampleTypes, setSampleTypes] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    // Validation
    if (!appointmentId || appointmentId.trim() === "") {
      setResults([]);
      setError("Vui lòng nhập mã lịch hẹn để tra cứu!");
      setLoading(false);
      return;
    }
    if (!/^[0-9]+$/.test(appointmentId) || Number(appointmentId) <= 0) {
      setResults([]);
      setError("Mã lịch hẹn phải là số dương!");
      setLoading(false);
      return;
    }
    try {
      const rawToken = localStorage.getItem("token");
      const token =
        rawToken && rawToken !== "null" && rawToken !== "undefined"
          ? rawToken
          : null;
      const res = await getResultByAppointmentId(appointmentId, token);
      if (res.data) {
        setResults(Array.isArray(res.data) ? res.data : [res.data]);
      } else {
        setResults([]);
      }
    } catch {
      setError("Lỗi khi lấy danh sách kết quả!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    setUserRole(user ? user.role : "");
    // Lấy sample types
    const fetchSampleTypes = async () => {
      try {
        const rawToken = localStorage.getItem("token");
        const token =
          rawToken && rawToken !== "null" && rawToken !== "undefined"
            ? rawToken
            : null;
        const res = await getAllSampleTypes(token);
        setSampleTypes(res);
      } catch {
        setSampleTypes([]);
      }
    };
    fetchSampleTypes();
  }, []);

  useEffect(() => {
    handleSearch();
  }, []);

  // Hàm lấy tên mẫu từ sampleId
  const getSampleName = (sampleId) => {
    const found = sampleTypes.find((type) => type.id === sampleId);
    return found ? found.name : "Không có dữ liệu";
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="result-table-container">
      <h2>Danh sách kết quả</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Nhập mã lịch hẹn để tra cứu"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleSearch}>Tra cứu</button>
        {userRole === "staff" || userRole === "manager" ? (
          <button
            onClick={() => {
              setAppointmentId("");
              setError(null);
              setResults([]);
            }}
            style={{ marginLeft: 8 }}
          >
            Xem tất cả
          </button>
        ) : null}
      </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <table className="result-table">
        <thead>
          <tr>
            <th>Mã kết quả</th>
            <th>Ngày kết quả</th>
            <th>Trạng thái</th>
            <th>Kết luận</th>
            <th>Mã mẫu</th>
            <th>Tên mẫu</th>
            <th>Người cập nhật</th>
            <th>Mã lịch hẹn</th>
            <th>File kết quả</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="9">Không có dữ liệu</td>
            </tr>
          ) : (
            results.map((result, idx) => (
              <tr key={result.id || result.resultId || idx}>
                <td>{result.resultId}</td>
                <td>{result.resultDate}</td>
                <td>{result.status}</td>
                <td>{result.interpretation}</td>
                <td>
                  {Array.isArray(result.sampleId)
                    ? result.sampleId.join(", ")
                    : result.sampleId}
                </td>
                <td>{getSampleName(result.sampleId)}</td>
                <td>{result.username}</td>
                <td>{result.appointmentId}</td>
                <td>
                  {result.resultFile ? (
                    <a
                      href={`http://localhost:8080/api/results/download/${result.resultFile}`}
                      download
                    >
                      {result.resultFile}
                    </a>
                  ) : (
                    "Không có file"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultList;
