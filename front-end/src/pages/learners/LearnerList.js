import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Card, Modal } from "react-bootstrap";
import { FaTrash, FaEdit, FaUserGraduate } from "react-icons/fa";
import { toast } from "react-toastify";
import { learnerAPI } from "../../services/api";
import Loader from "../../components/Loader";

const LearnerList = () => {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Edit state
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "", status: 0 });
  const [editId, setEditId] = useState(null);

  const fetchLearners = async () => {
    try {
      const res = await learnerAPI.getAll();
      setLearners(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch learners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  const handleDelete = async () => {
    try {
      await learnerAPI.delete(deleteId);
      toast.success("Learner deleted");
      setShowDelete(false);
      fetchLearners();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openEdit = (l) => {
    setEditId(l._id);
    setEditData({ name: l.name, phone: l.phone || "", status: l.status });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    try {
      await learnerAPI.update(editId, editData);
      toast.success("Learner updated");
      setShowEdit(false);
      fetchLearners();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <FaUserGraduate className="me-2" /> All Learners
      </h3>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {learners.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No learners found</td></tr>
              ) : (
                learners.map((l, i) => (
                  <tr key={l._id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{l.name}</td>
                    <td>{l.email}</td>
                    <td>{l.phone || "N/A"}</td>
                    <td>
                      <Badge bg={l.studentType === "internal" ? "primary" : "warning"}>
                        {l.studentType}
                      </Badge>
                    </td>
                    <td>{l.branchName || "N/A"}</td>
                    <td>
                      <Badge bg={l.status === 1 ? "success" : "secondary"}>
                        {l.status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(l)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => { setDeleteId(l._id); setShowDelete(true); }}>
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

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Learner</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input className="form-control" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select className="form-select" value={editData.status} onChange={(e) => setEditData({ ...editData, status: Number(e.target.value) })}>
              <option value={0}>Inactive</option>
              <option value={1}>Active</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this learner?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LearnerList;