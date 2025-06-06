import React from "react";
import { Outlet } from "react-router";
import { motion } from "framer-motion";
import "./AppLayout.css";

function AppLayout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="app-layout-wrapper"
    >
      <div className="layout-navbar">Navbar</div>
      <div className="layout-content">
        <Outlet />
      </div>
    </motion.div>
  );
}

export default AppLayout;
