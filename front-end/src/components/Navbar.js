import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar as BSNavbar, Container, Nav, Badge, Button } from "react-bootstrap";
import { FaGraduationCap, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getBadgeVariant = () => {
    switch (user?.role) {
      case "OWNER": return "danger";
      case "TRAINER": return "info";
      case "LEARNER": return "success";
      default: return "secondary";
    }
  };

  return (
    <BSNavbar bg="dark" variant="dark" fixed="top" className="shadow" style={{ zIndex: 1050 }}>
      <Container fluid>
        <BSNavbar.Brand className="fw-bold">
          <FaGraduationCap className="me-2 text-warning" size={24} />
          LMS Platform
        </BSNavbar.Brand>
        <Nav className="ms-auto d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2 text-white">
            <FaUserCircle size={20} />
            <span className="fw-semibold">{user?.name}</span>
            <Badge bg={getBadgeVariant()}>{user?.role}</Badge>
          </div>
          <Button variant="outline-danger" size="sm" onClick={handleLogout}>
            <FaSignOutAlt className="me-1" /> Logout
          </Button>
        </Nav>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;