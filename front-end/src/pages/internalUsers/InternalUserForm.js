import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { internalUserAPI, authAPI } from "../../services/api";
import Loader from "../../components/Loader";

const InternalUserForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "TRAINER", phone: "", status: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      internalUserAPI.getById(id)
        .then((res) => {
          const u = res.data.data;
          setFormData({
            name: u.name || "",
            email: u.email || "",
            password: "",
            role: u.role || "TRAINER",
            phone: u.phone || "",
            status: u.status || 0,
          });
        })
        .catch(() => toast.error("Failed to fetch user"))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "status" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await internalUserAPI.update(id, payload);
        toast.success("User updated successfully");
      } else {
        await authAPI.registerInternal(formData);
        toast.success("User created successfully");
      }
      navigate("/owner/internal-users");
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
          {isEdit ? "Edit Internal User" : "Add Internal User"}
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isEdit} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{isEdit ? "New Password (leave blank to keep)" : "Password *"}</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required={!isEdit} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role *</Form.Label>
                  <Form.Select name="role" value={formData.role} onChange={handleChange}>
                    <option value="TRAINER">TRAINER</option>
                    <option value="OWNER">OWNER</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    <option value={0}>Inactive</option>
                    <option value={1}>Active</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" disabled={loading}>
              <FaSave className="me-1" /> {loading ? "Saving..." : "Save"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InternalUserForm;