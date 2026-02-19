import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Nav } from "react-bootstrap";
import {
  FaTachometerAlt, FaUsersCog, FaUserGraduate, FaBook,
  FaVideo, FaClipboardList, FaCreditCard, FaStar,
  FaQuestionCircle, FaUser
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const base = role === "OWNER" ? "/owner" : role === "TRAINER" ? "/trainer" : "/learner";

  const getMenuItems = () => {
    if (role === "OWNER") {
      return [
        { path: `${base}/dashboard`, icon: <FaTachometerAlt />, label: "Dashboard" },
        { path: `${base}/internal-users`, icon: <FaUsersCog />, label: "Internal Users" },
        { path: `${base}/learners`, icon: <FaUserGraduate />, label: "Learners" },
        { path: `${base}/courses`, icon: <FaBook />, label: "Courses" },
        { path: `${base}/lectures`, icon: <FaVideo />, label: "Lectures" },
        { path: `${base}/enrollments`, icon: <FaClipboardList />, label: "Enrollments" },
        { path: `${base}/payments`, icon: <FaCreditCard />, label: "Payments" },
        { path: `${base}/feedbacks`, icon: <FaStar />, label: "Feedbacks" },
        { path: `${base}/queries`, icon: <FaQuestionCircle />, label: "Queries" },
      ];
    }
    if (role === "TRAINER") {
      return [
        { path: `${base}/dashboard`, icon: <FaTachometerAlt />, label: "Dashboard" },
        { path: `${base}/courses`, icon: <FaBook />, label: "Courses" },
        { path: `${base}/lectures`, icon: <FaVideo />, label: "My Lectures" },
        { path: `${base}/enrollments`, icon: <FaClipboardList />, label: "Enrollments" },
        { path: `${base}/feedbacks`, icon: <FaStar />, label: "Feedbacks" },
        { path: `${base}/queries`, icon: <FaQuestionCircle />, label: "Queries" },
      ];
    }
    if (role === "LEARNER") {
      return [
        { path: `${base}/dashboard`, icon: <FaTachometerAlt />, label: "Dashboard" },
        { path: `${base}/profile`, icon: <FaUser />, label: "My Profile" },
        { path: `${base}/courses`, icon: <FaBook />, label: "All Courses" },
        { path: `${base}/my-enrollments`, icon: <FaClipboardList />, label: "My Enrollments" },
        { path: `${base}/my-payments`, icon: <FaCreditCard />, label: "My Payments" },
        { path: `${base}/feedbacks`, icon: <FaStar />, label: "My Feedbacks" },
        { path: `${base}/queries`, icon: <FaQuestionCircle />, label: "My Queries" },
      ];
    }
    return [];
  };

  return (
    <div
      className="bg-dark text-white d-flex flex-column"
      style={{
        width: "250px",
        height: "calc(100vh - 56px)",
        position: "fixed",
        top: "56px",
        left: 0,
        overflowY: "auto",
      }}
    >
      <div className="text-center py-4 border-bottom border-secondary">
        <FaUserGraduate size={40} className="text-warning mb-2" />
        <h6 className="mb-0">{user?.name}</h6>
        <small className="text-muted">{user?.email}</small>
      </div>
      <Nav className="flex-column p-3 gap-1">
        {getMenuItems().map((item, i) => (
          <Nav.Link
            as={NavLink}
            to={item.path}
            key={i}
            className="text-white d-flex align-items-center gap-2 rounded px-3 py-2"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#f39c12" : "transparent",
              color: isActive ? "#1a1a2e" : "#ccc",
              fontWeight: isActive ? "600" : "400",
            })}
          >
            {item.icon} {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;