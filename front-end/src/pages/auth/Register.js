import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaGraduationCap, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";
import { loginSuccess } from "../../redux/slices/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "TRAINER", phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.registerInternal(formData);
      const { token, ...userData } = res.data.data;
      dispatch(loginSuccess({ user: userData, token }));
      toast.success("Registration successful!");
      if (userData.role === "OWNER") navigate("/owner/dashboard");
      else navigate("/trainer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <FaGraduationCap size={50} className="text-warning" />
                  <h3 className="mt-2 fw-bold">Staff Registration</h3>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Role *</Form.Label>
                    <Form.Select name="role" value={formData.role} onChange={handleChange}>
                      <option value="TRAINER">TRAINER</option>
                      <option value="OWNER">OWNER</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" name="phone" placeholder="Enter phone" value={formData.phone} onChange={handleChange} />
                  </Form.Group>
                  <Button type="submit" variant="warning" className="w-100 fw-bold" disabled={loading}>
                    <FaUserPlus className="me-2" />
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </Form>
                <div className="text-center mt-3">
                  <Link to="/login" className="text-decoration-none">Already have an account? Login</Link>
                </div>
                <div className="text-center mt-2">
                  <Link to="/" className="text-decoration-none text-muted">← Back to Home</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;