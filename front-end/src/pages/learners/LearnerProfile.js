import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Alert, Badge } from "react-bootstrap";
import { FaUser, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { learnerAPI } from "../../services/api";
import { updateUser } from "../../redux/slices/authSlice";
import Loader from "../../components/Loader";

const LearnerProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "",
    studentType: "external", branchName: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await learnerAPI.getProfile();
        const p = res.data.data;
        setFormData({
          name: p.name || "", email: p.email || "", phone: p.phone || "",
          password: "", studentType: p.studentType || "external", branchName: p.branchName || "",
        });
      } catch (err) {
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      if (payload.studentType === "external") delete payload.branchName;

      const res = await learnerAPI.updateProfile(payload);
      dispatch(updateUser(res.data.data));
      toast.success("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h3 className="fw-bold mb-4"><FaUser className="me-2" /> My Profile</h3>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-success text-white fw-bold d-flex justify-content-between">
          <span>Profile Information</span>
          <Badge bg="light" text="dark">{user?.studentType} Student</Badge>
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} disabled />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password (leave blank to keep)</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student Type</Form.Label>
                  <Form.Select name="studentType" value={formData.studentType} onChange={handleChange}>
                    <option value="external">External</option>
                    <option value="internal">Internal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {formData.studentType === "internal" && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Branch Name</Form.Label>
                    <Form.Control type="text" name="branchName" value={formData.branchName} onChange={handleChange} />
                  </Form.Group>
                </Col>
              )}
            </Row>
            <Button type="submit" variant="success" disabled={saving}>
              <FaSave className="me-1" /> {saving ? "Saving..." : "Update Profile"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LearnerProfile;