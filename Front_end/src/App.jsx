import React, { useEffect } from "react";
import AppRoutes from "./route/AppRoutes";
import Notification from "./Notification/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./component/ThemeContext";

function App() {
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    document.body.classList.toggle("dark-theme", isDark);
  }, []);

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Notification />
      <AppRoutes />
    </>
  );
}

export default function Main() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
