import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div
        style={{
          marginLeft: "250px",
          marginTop: "56px",
          padding: "30px",
          minHeight: "calc(100vh - 56px)",
          backgroundColor: "#f5f7fa",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;