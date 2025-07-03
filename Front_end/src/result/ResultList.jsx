import React, { useEffect, useState } from "react";
import { getResultList } from "./ResultsApi";

const ResultList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResultList()
      .then((res) => setResults(res.data))
      .catch((err) => setError("Lỗi khi lấy danh sách kết quả!"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Danh sách kết quả</h2>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày kết quả</th>
            <th>Trạng thái</th>
            <th>Người tạo</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="4">Không có dữ liệu</td>
            </tr>
          ) : (
            results.map((result) => (
              <tr key={result.resultId}>
                <td>{result.resultId}</td>
                <td>{result.resultDate}</td>
                <td>{result.status}</td>
                <td>{result.username}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultList;
