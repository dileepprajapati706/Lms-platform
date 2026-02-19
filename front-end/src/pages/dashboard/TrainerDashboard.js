import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaBook, FaVideo, FaClipboardList, FaStar, FaQuestionCircle } from "react-icons/fa";
import { courseAPI, lectureAPI, feedbackAPI, queryAPI } from "../../services/api";

const TrainerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    courses: 0, myLectures: 0, feedbacks: 0, queries: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [co, le, fb, qu] = await Promise.all([
          courseAPI.getAll(),
          lectureAPI.getMyLectures(),
          feedbackAPI.getAll(),
          queryAPI.getAll(),
        ]);
        setStats({
          courses: co.data.data?.length || 0,
          myLectures: le.data.data?.length || 0,
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
    { title: "Total Courses", count: stats.courses, icon: <FaBook size={30} />, bg: "warning" },
    { title: "My Lectures", count: stats.myLectures, icon: <FaVideo size={30} />, bg: "info" },
    { title: "Feedbacks", count: stats.feedbacks, icon: <FaStar size={30} />, bg: "success" },
    { title: "Queries", count: stats.queries, icon: <FaQuestionCircle size={30} />, bg: "danger" },
  ];

  return (
    <div>
      <h3 className="fw-bold mb-1">Trainer Dashboard</h3>
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

export default TrainerDashboard;