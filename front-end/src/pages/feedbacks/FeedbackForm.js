import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FaSave, FaArrowLeft, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { feedbackAPI } from "../../services/api";
import { fetchCourses } from "../../redux/slices/courseSlice";
import Loader from "../../components/Loader";

const FeedbackForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: courses } = useSelector((state) => state.courses);

  const [formData, setFormData] = useState({
    courseId: "",
    rating: 5,
    comments: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      feedbackAPI.getById(id)
        .then((res) => {
          const f = res.data.data;
          setFormData({
            courseId: f.courseId?._id || "",
            rating: f.rating || 5,
            comments: f.comments || "",
          });
        })
        .catch(() => toast.error("Failed to fetch feedback"))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "rating" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await feedbackAPI.update(id, { rating: formData.rating, comments: formData.comments });
        toast.success("Feedback updated");
      } else {
        await feedbackAPI.create(formData);
        toast.success("Feedback submitted");
      }
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader />;

  return (
    <div>
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-1" /> Back
      </Button>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-warning text-dark fw-bold">
          <FaStar className="me-2" />
          {isEdit ? "Edit Feedback" : "Give Feedback"}
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {!isEdit && (
              <Form.Group className="mb-3">
                <Form.Label>Select Course *</Form.Label>
                <Form.Select name="courseId" value={formData.courseId} onChange={handleChange} required>
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Rating *</Form.Label>
              <div className="d-flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={30}
                    className="cursor-pointer"
                    style={{ cursor: "pointer" }}
                    color={(hoverRating || formData.rating) >= star ? "#f39c12" : "#ddd"}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setFormData({ ...formData, rating: star })}
                  />
                ))}
                <span className="ms-2 fw-bold text-muted">({formData.rating}/5)</span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="comments"
                placeholder="Write your feedback here..."
                value={formData.comments}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" variant="warning" className="fw-bold" disabled={loading}>
              <FaSave className="me-1" /> {loading ? "Saving..." : "Submit Feedback"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FeedbackForm;