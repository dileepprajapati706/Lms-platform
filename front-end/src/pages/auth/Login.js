import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaGraduationCap, FaSignInAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";
import { loginSuccess } from "../../redux/slices/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await authAPI.loginInternal(formData);
      const { token, ...userData } = res.data.data;
      dispatch(loginSuccess({ user: userData, token }));
      toast.success("Login successful!");
      if (userData.role === "OWNER") navigate("/owner/dashboard");
      else navigate("/trainer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="shadow border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <FaGraduationCap size={50} className="text-warning" />
                  <h3 className="mt-2 fw-bold">Staff Login</h3>
                  <p className="text-muted">Owner / Trainer Login</p>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="warning" className="w-100 fw-bold" disabled={loading}>
                    <FaSignInAlt className="me-2" />
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
                <div className="text-center mt-3">
                  <Link to="/register" className="text-decoration-none">Don't have an account? Register</Link>
                </div>
                <div className="text-center mt-2">
                  <Link to="/learner/login" className="text-decoration-none text-success">Student? Login here</Link>
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

export default Login;