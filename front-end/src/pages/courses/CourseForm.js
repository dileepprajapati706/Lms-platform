import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { courseAPI } from "../../services/api";
import Loader from "../../components/Loader";

const CourseForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "", description: "", duration: "", mode: "FREE", price: 0, bannerUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      courseAPI.getById(id)
        .then((res) => {
          const c = res.data.data;
          setFormData({
            title: c.title || "", description: c.description || "", duration: c.duration || "",
            mode: c.mode || "FREE", price: c.price || 0, bannerUrl: c.bannerUrl || "",
          });
        })
        .catch(() => toast.error("Failed to fetch course"))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "price" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await courseAPI.update(id, formData);
        toast.success("Course updated");
      } else {
        await courseAPI.create(formData);
        toast.success("Course created");
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
          {isEdit ? "Edit Course" : "Add Course"}
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control type="text" name="duration" placeholder="e.g. 30 hours" value={formData.duration} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Mode *</Form.Label>
                  <Form.Select name="mode" value={formData.mode} onChange={handleChange}>
                    <option value="FREE">FREE</option>
                    <option value="PAID">PAID</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {formData.mode === "PAID" && (
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price (₹)</Form.Label>
                    <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} />
                  </Form.Group>
                </Col>
              )}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Banner URL</Form.Label>
                  <Form.Control type="text" name="bannerUrl" value={formData.bannerUrl} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" disabled={loading}>
              <FaSave className="me-1" /> {loading ? "Saving..." : "Save Course"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseForm;