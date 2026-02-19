import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Card, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaUsersCog } from "react-icons/fa";
import { toast } from "react-toastify";
import { internalUserAPI } from "../../services/api";
import Loader from "../../components/Loader";

const InternalUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await internalUserAPI.getAll();
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    try {
      await internalUserAPI.delete(deleteId);
      toast.success("User deleted successfully");
      setShowDelete(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">
          <FaUsersCog className="me-2" /> Internal Users
        </h3>
        <Link to="/owner/internal-users/add">
          <Button variant="primary">
            <FaPlus className="me-1" /> Add User
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No users found</td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <Badge bg={u.role === "OWNER" ? "danger" : "info"}>{u.role}</Badge>
                    </td>
                    <td>{u.phone || "N/A"}</td>
                    <td>
                      <Badge bg={u.status === 1 ? "success" : "secondary"}>
                        {u.status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/owner/internal-users/edit/${u._id}`)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => { setDeleteId(u._id); setShowDelete(true); }}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InternalUserList;