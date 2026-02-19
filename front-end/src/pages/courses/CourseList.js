import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaBook, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchCourses } from "../../redux/slices/courseSlice";
import { courseAPI, enrollmentAPI } from "../../services/api";
import Loader from "../../components/Loader";

const CourseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: courses, loading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const base = role === "OWNER" ? "/owner" : role === "TRAINER" ? "/trainer" : "/learner";

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseAPI.delete(id);
        toast.success("Course deleted");
        dispatch(fetchCourses());
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollmentAPI.enroll({ courseId });
      toast.success("Enrolled successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0"><FaBook className="me-2" /> Courses</h3>
        {role === "OWNER" && (
          <Link to={`${base}/courses/add`}>
            <Button variant="primary"><FaPlus className="me-1" /> Add Course</Button>
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <FaBook size={60} className="mb-3 opacity-25" />
          <h5>No courses found</h5>
        </div>
      ) : (
        <Row className="g-4">
          {courses.map((c) => (
            <Col md={4} key={c._id}>
              <Card className="border-0 shadow-sm h-100">
                {c.bannerUrl && (
                  <Card.Img variant="top" src={c.bannerUrl} style={{ height: "180px", objectFit: "cover" }} />
                )}
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <Badge bg={c.mode === "FREE" ? "success" : "warning"}>{c.mode}</Badge>
                    {c.mode === "PAID" && <span className="fw-bold text-primary">₹{c.price}</span>}
                  </div>
                  <Card.Title className="fw-bold">{c.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {c.description ? c.description.substring(0, 100) + "..." : "No description"}
                  </Card.Text>
                  {c.duration && <small className="text-muted">Duration: {c.duration}</small>}
                </Card.Body>
                <Card.Footer className="bg-white border-0 pb-3 px-3 d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => navigate(`${base}/courses/${c._id}`)}>
                    <FaEye className="me-1" /> View
                  </Button>
                  {role === "OWNER" && (
                    <>
                      <Button variant="outline-warning" size="sm" onClick={() => navigate(`${base}/courses/edit/${c._id}`)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(c._id)}>
                        <FaTrash />
                      </Button>
                    </>
                  )}
                  {role === "LEARNER" && (
                    <Button variant="success" size="sm" onClick={() => handleEnroll(c._id)}>
                      Enroll Now
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CourseList;