import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Nếu không có user, chuyển hướng về trang đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role.toLowerCase(); // Chuyển vai trò về chữ thường

  // Kiểm tra xem vai trò của user có nằm trong danh sách được phép hay không
  if (allowedRoles && allowedRoles.includes(userRole)) {
    return children;
  }

  // Nếu vai trò không được phép, có thể chuyển hướng về trang lỗi hoặc trang chủ
  return (
    <Navigate to="/auth-notification" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
