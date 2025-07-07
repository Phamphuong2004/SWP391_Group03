import React, { useEffect } from "react";
import AppRoutes from "./route/AppRoutes";
import Notification from "./Notification/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./component/ThemeContext";
import ManagerDashboard from "./Dashboard/ManagerDashboard";
import Navbar from "./component/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatBox from "./component/ChatBox";

function LayoutWithNavbar() {
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    document.body.classList.toggle("dark-theme", isDark);
  }, []);
  return (
    <>
      {/* <Navbar /> */}
      <AppRoutes />
      <ToastContainer position="top-center" autoClose={2000} />
      <Notification />
      <ChatBox />
    </>
  );
}

export default function Main() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/*" element={<LayoutWithNavbar />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
