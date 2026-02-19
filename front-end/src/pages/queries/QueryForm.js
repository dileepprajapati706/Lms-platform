import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaSave, FaArrowLeft, FaQuestionCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { queryAPI } from "../../services/api";
import { fetchCourses } from "../../redux/slices/courseSlice";
import Loader from "../../components/Loader";

const QueryForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: courses } = useSelector((state) => state.courses);

  const [formData, setFormData] = useState({
    courseId: "",
    question: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      queryAPI.getById(id)
        .then((res) => {
          const q = res.data.data;
          setFormData({
            courseId: q.courseId?._id || "",
            question: q.question || "",
          });
        })
        .catch(() => toast.error("Failed to fetch query"))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await queryAPI.update(id, { question: formData.question });
        toast.success("Query updated");
      } else {
        await queryAPI.create(formData);
        toast.success("Query submitted");
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
        <Card.Header className="bg-primary text-white fw-bold">
          <FaQuestionCircle className="me-2" />
          {isEdit ? "Edit Query" : "Ask a Question"}
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
              <Form.Label>Your Question *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="question"
                placeholder="Type your question here..."
                value={formData.question}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="fw-bold" disabled={loading}>
              <FaSave className="me-1" /> {loading ? "Saving..." : isEdit ? "Update Query" : "Submit Query"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default QueryForm;