import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  FaUsersCog, FaUserGraduate, FaBook, FaVideo,
  FaClipboardList, FaCreditCard, FaStar, FaQuestionCircle
} from "react-icons/fa";
import { internalUserAPI, learnerAPI, courseAPI, lectureAPI, enrollmentAPI, paymentAPI, feedbackAPI, queryAPI } from "../../services/api";

const OwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    internalUsers: 0, learners: 0, courses: 0, lectures: 0,
    enrollments: 0, payments: 0, feedbacks: 0, queries: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [iu, lr, co, le, en, pa, fb, qu] = await Promise.all([
          internalUserAPI.getAll(),
          learnerAPI.getAll(),
          courseAPI.getAll(),
          lectureAPI.getAll(),
          enrollmentAPI.getAll(),
          paymentAPI.getAll(),
          feedbackAPI.getAll(),
          queryAPI.getAll(),
        ]);
        setStats({
          internalUsers: iu.data.data?.length || 0,
          learners: lr.data.data?.length || 0,
          courses: co.data.data?.length || 0,
          lectures: le.data.data?.length || 0,
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
    { title: "Internal Users", count: stats.internalUsers, icon: <FaUsersCog size={30} />, bg: "primary" },
    { title: "Learners", count: stats.learners, icon: <FaUserGraduate size={30} />, bg: "success" },
    { title: "Courses", count: stats.courses, icon: <FaBook size={30} />, bg: "warning" },
    { title: "Lectures", count: stats.lectures, icon: <FaVideo size={30} />, bg: "info" },
    { title: "Enrollments", count: stats.enrollments, icon: <FaClipboardList size={30} />, bg: "danger" },
    { title: "Payments", count: stats.payments, icon: <FaCreditCard size={30} />, bg: "dark" },
    { title: "Feedbacks", count: stats.feedbacks, icon: <FaStar size={30} />, bg: "secondary" },
    { title: "Queries", count: stats.queries, icon: <FaQuestionCircle size={30} />, bg: "primary" },
  ];

  return (
    <div>
      <h3 className="fw-bold mb-1">Owner Dashboard</h3>
      <p className="text-muted mb-4">Welcome back, {user?.name}!</p>
      <Row className="g-4">
        {cards.map((c, i) => (
          <Col md={3} key={i}>
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

export default OwnerDashboard;