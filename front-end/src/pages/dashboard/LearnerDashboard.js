import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaBook, FaClipboardList, FaCreditCard, FaStar, FaQuestionCircle } from "react-icons/fa";
import { courseAPI, enrollmentAPI, paymentAPI, feedbackAPI, queryAPI } from "../../services/api";

const LearnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    courses: 0, enrollments: 0, payments: 0, feedbacks: 0, queries: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [co, en, pa, fb, qu] = await Promise.all([
          courseAPI.getAll(),
          enrollmentAPI.getMy(),
          paymentAPI.getMy(),
          feedbackAPI.getMy(),
          queryAPI.getMy(),
        ]);
        setStats({
          courses: co.data.data?.length || 0,
          enrollments: en.data.data?.length || 0,
          payments: pa.data.data?.length || 0,
          feedbacks: fb.data.data?.length || 0,
          queries: qu.data.data?.length || 0,
        });
      } catch (err) {
        console.log("Error fetching stats");
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Available Courses", count: stats.courses, icon: <FaBook size={30} />, bg: "warning" },
    { title: "My Enrollments", count: stats.enrollments, icon: <FaClipboardList size={30} />, bg: "success" },
    { title: "My Payments", count: stats.payments, icon: <FaCreditCard size={30} />, bg: "info" },
    { title: "My Feedbacks", count: stats.feedbacks, icon: <FaStar size={30} />, bg: "danger" },
    { title: "My Queries", count: stats.queries, icon: <FaQuestionCircle size={30} />, bg: "primary" },
  ];

  return (
    <div>
      <h3 className="fw-bold mb-1">Learner Dashboard</h3>
      <p className="text-muted mb-4">Welcome back, {user?.name}!</p>
      <Row className="g-4">
        {cards.map((c, i) => (
          <Col md={4} key={i}>
            <Card className={`border-0 shadow-sm text-white bg-${c.bg}`}>
              <Card.Body className="d-flex justify-content-between align-items-center p-4">
                <div>
                  <h6 className="mb-1 opacity-75">{c.title}</h6>
                  <h2 className="fw-bold mb-0">{c.count}</h2>
                </div>
                <div className="opacity-50">{c.icon}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LearnerDashboard;