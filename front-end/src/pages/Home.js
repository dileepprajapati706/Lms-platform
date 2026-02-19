import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaGraduationCap, FaBook, FaVideo, FaCertificate,
  FaHeadset, FaUserShield, FaChalkboardTeacher, FaUserGraduate
} from "react-icons/fa";

const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">
          <FaGraduationCap className="me-2 text-warning" /> LMS Platform
        </span>
        <div className="ms-auto d-flex gap-2">
          <Link to="/login" className="btn btn-outline-light btn-sm">Staff Login</Link>
          <Link to="/learner/login" className="btn btn-outline-light btn-sm">Student Login</Link>
          <Link to="/learner/register" className="btn btn-warning btn-sm fw-bold">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h1 className="display-4 fw-bold">
                Welcome to <span className="text-warning">LMS Platform</span>
              </h1>
              <p className="lead text-secondary mt-3">
                Your one-stop destination for quality education. Learn from the best trainers,
                access courses anytime, and upgrade your skills.
              </p>
              <div className="mt-4 d-flex gap-3">
                <Link to="/learner/register">
                  <Button variant="warning" size="lg" className="fw-bold">
                    <FaUserGraduate className="me-2" /> Get Started
                  </Button>
                </Link>
                <Link to="/learner/login">
                  <Button variant="outline-light" size="lg">Login</Button>
                </Link>
              </div>
            </Col>
            <Col md={5} className="text-center">
              <FaGraduationCap size={200} className="text-warning opacity-25" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-5">Why Choose Us?</h2>
        <Row className="g-4">
          {[
            { icon: <FaBook size={40} />, title: "Quality Courses", desc: "Access high-quality courses created by expert trainers" },
            { icon: <FaVideo size={40} />, title: "Video Lectures", desc: "Learn with video, audio, and text-based lectures" },
            { icon: <FaCertificate size={40} />, title: "Free & Paid", desc: "Choose from both free and premium courses" },
            { icon: <FaHeadset size={40} />, title: "Query Support", desc: "Ask questions and get replies from trainers" },
          ].map((f, i) => (
            <Col md={3} key={i}>
              <Card className="text-center border-0 shadow-sm h-100 p-4">
                <div className="text-primary mb-3">{f.icon}</div>
                <Card.Title className="fw-bold">{f.title}</Card.Title>
                <Card.Text className="text-muted">{f.desc}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Login As Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Login As</h2>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Link to="/login" className="text-decoration-none">
                <Card className="text-center border-0 shadow h-100 p-4" style={{ borderTop: "4px solid #dc3545" }}>
                  <FaUserShield size={50} className="text-danger mx-auto mb-3" />
                  <Card.Title className="fw-bold">Owner / Admin</Card.Title>
                  <Card.Text className="text-muted">Full control over the platform</Card.Text>
                </Card>
              </Link>
            </Col>
            <Col md={4}>
              <Link to="/login" className="text-decoration-none">
                <Card className="text-center border-0 shadow h-100 p-4" style={{ borderTop: "4px solid #0dcaf0" }}>
                  <FaChalkboardTeacher size={50} className="text-info mx-auto mb-3" />
                  <Card.Title className="fw-bold">Trainer / Staff</Card.Title>
                  <Card.Text className="text-muted">Create & manage lectures</Card.Text>
                </Card>
              </Link>
            </Col>
            <Col md={4}>
              <Link to="/learner/login" className="text-decoration-none">
                <Card className="text-center border-0 shadow h-100 p-4" style={{ borderTop: "4px solid #198754" }}>
                  <FaUserGraduate size={50} className="text-success mx-auto mb-3" />
                  <Card.Title className="fw-bold">Learner / Student</Card.Title>
                  <Card.Text className="text-muted">Buy & consume courses</Card.Text>
                </Card>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">&copy; 2025 LMS Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;