import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Badge, Button, Row, Col, ListGroup } from "react-bootstrap";
import { FaArrowLeft, FaVideo, FaBook } from "react-icons/fa";
import { useSelector } from "react-redux";
import { courseAPI, lectureAPI, enrollmentAPI } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, lRes] = await Promise.all([
          courseAPI.getById(id),
          lectureAPI.getByCourse(id),
        ]);
        setCourse(cRes.data.data);
        setLectures(lRes.data.data || []);
      } catch (err) {
        toast.error("Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await enrollmentAPI.enroll({ courseId: id });
      toast.success("Enrolled successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) return <Loader />;
  if (!course) return <div className="text-center py-5">Course not found</div>;

  return (
    <div>
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-1" /> Back
      </Button>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row>
            <Col md={8}>
              <div className="d-flex gap-2 mb-2">
                <Badge bg={course.mode === "FREE" ? "success" : "warning"} className="fs-6">{course.mode}</Badge>
                {course.mode === "PAID" && <Badge bg="primary" className="fs-6">₹{course.price}</Badge>}
              </div>
              <h2 className="fw-bold">{course.title}</h2>
              <p className="text-muted">{course.description}</p>
              {course.duration && <p><strong>Duration:</strong> {course.duration}</p>}
              {course.createdBy && <p><strong>Created By:</strong> {course.createdBy.name}</p>}
              {user?.role === "LEARNER" && (
                <Button variant="success" size="lg" onClick={handleEnroll}>
                  <FaBook className="me-2" /> Enroll Now
                </Button>
              )}
            </Col>
            <Col md={4}>
              {course.bannerUrl && (
                <img src={course.bannerUrl} alt="banner" className="img-fluid rounded shadow" />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h4 className="fw-bold mb-3"><FaVideo className="me-2" /> Lectures ({lectures.length})</h4>
      {lectures.length === 0 ? (
        <p className="text-muted">No lectures available for this course.</p>
      ) : (
        <ListGroup>
          {lectures.map((l, i) => (
            <ListGroup.Item key={l._id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{i + 1}. {l.lectureTitle}</strong>
                <div className="small text-muted">
                  {l.duration && `Duration: ${l.duration} | `}
                  Mode: {l.lectureMode} | Type: {l.lectureType}
                </div>
              </div>
              <div className="d-flex gap-2">
                <Badge bg={l.lectureType === "FREE" ? "success" : "warning"}>{l.lectureType}</Badge>
                <Badge bg="info">{l.lectureMode}</Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default CourseDetail;