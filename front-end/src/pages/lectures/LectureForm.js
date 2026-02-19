import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { lectureAPI } from "../../services/api";
import { fetchCourses } from "../../redux/slices/courseSlice";
import Loader from "../../components/Loader";

const LectureForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: courses } = useSelector((state) => state.courses);

  const [formData, setFormData] = useState({
    courseId: "", lectureTitle: "", duration: "", lectureMode: "VIDEO",
    lectureType: "FREE", content: "", mediaUrl: "", lectureBannerUrl: "",
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
      lectureAPI.getById(id)
        .then((res) => {
          const l = res.data.data;
          setFormData({
            courseId: l.courseId?._id || "", lectureTitle: l.lectureTitle || "",
            duration: l.duration || "", lectureMode: l.lectureMode || "VIDEO",
            lectureType: l.lectureType || "FREE", content: l.content || "",
            mediaUrl: l.mediaUrl || "", lectureBannerUrl: l.lectureBannerUrl || "",
          });
        })
        .catch(() => toast.error("Failed to fetch lecture"))
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
        await lectureAPI.update(id, formData);
        toast.success("Lecture updated");
      } else {
        await lectureAPI.create(formData);
        toast.success("Lecture created");
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
        <Card.Header className="bg-dark text-white fw-bold">
          {isEdit ? "Edit Lecture" : "Add Lecture"}
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course *</Form.Label>
                  <Form.Select name="courseId" value={formData.courseId} onChange={handleChange} required>
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Title *</Form.Label>
                  <Form.Control type="text" name="lectureTitle" value={formData.lectureTitle} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Mode *</Form.Label>
                  <Form.Select name="lectureMode" value={formData.lectureMode} onChange={handleChange}>
                    <option value="VIDEO">VIDEO</option>
                    <option value="AUDIO">AUDIO</option>
                    <option value="TEXT">TEXT</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Lecture Type *</Form.Label>
                  <Form.Select name="lectureType" value={formData.lectureType} onChange={handleChange}>
                    <option value="FREE">FREE</option>
                    <option value="PAID">PAID</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control type="text" name="duration" placeholder="e.g. 45 min" value={formData.duration} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            {formData.lectureMode === "TEXT" && (
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control as="textarea" rows={5} name="content" placeholder="Enter text content here..." value={formData.content} onChange={handleChange} />
              </Form.Group>
            )}

            {(formData.lectureMode === "VIDEO" || formData.lectureMode === "AUDIO") && (
              <Form.Group className="mb-3">
                <Form.Label>Media URL</Form.Label>
                <Form.Control type="text" name="mediaUrl" placeholder="Enter video/audio URL" value={formData.mediaUrl} onChange={handleChange} />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Lecture Banner URL</Form.Label>
              <Form.Control type="text" name="lectureBannerUrl" placeholder="Enter banner image URL" value={formData.lectureBannerUrl} onChange={handleChange} />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={loading}>
              <FaSave className="me-1" /> {loading ? "Saving..." : "Save Lecture"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LectureForm;