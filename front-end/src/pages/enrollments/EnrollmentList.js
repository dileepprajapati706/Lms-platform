import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Badge, Card, Button, Modal } from "react-bootstrap";
import { FaClipboardList, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchAllEnrollments, fetchMyEnrollments } from "../../redux/slices/enrollmentSlice";
import { enrollmentAPI } from "../../services/api";
import Loader from "../../components/Loader";

const EnrollmentList = () => {
  const dispatch = useDispatch();
  const { list: enrollments, loading } = useSelector((state) => state.enrollments);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Edit Modal
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ paymentStatus: "FREE" });

  useEffect(() => {
    if (role === "OWNER") {
      dispatch(fetchAllEnrollments());
    } else if (role === "LEARNER") {
      dispatch(fetchMyEnrollments());
    } else if (role === "TRAINER") {
      dispatch(fetchAllEnrollments());
    }
  }, [dispatch, role]);

  const handleDelete = async () => {
    try {
      await enrollmentAPI.delete(deleteId);
      toast.success("Enrollment deleted");
      setShowDelete(false);
      dispatch(fetchAllEnrollments());
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openEdit = (enrollment) => {
    setEditId(enrollment._id);
    setEditData({ paymentStatus: enrollment.paymentStatus || "FREE" });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    try {
      await enrollmentAPI.update(editId, editData);
      toast.success("Enrollment updated");
      setShowEdit(false);
      dispatch(fetchAllEnrollments());
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <FaClipboardList className="me-2" />
        {role === "LEARNER" ? "My Enrollments" : "All Enrollments"}
      </h3>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                {role !== "LEARNER" && <th>Learner</th>}
                <th>Course</th>
                <th>Payment Status</th>
                <th>Enrolled At</th>
                {role === "OWNER" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={role === "OWNER" ? 6 : 5} className="text-center py-4 text-muted">
                    No enrollments found
                  </td>
                </tr>
              ) : (
                enrollments.map((e, i) => (
                  <tr key={e._id}>
                    <td>{i + 1}</td>
                    {role !== "LEARNER" && (
                      <td>
                        <div className="fw-semibold">{e.learnerId?.name || "N/A"}</div>
                        <small className="text-muted">{e.learnerId?.email}</small>
                      </td>
                    )}
                    <td className="fw-semibold">{e.courseId?.title || "N/A"}</td>
                    <td>
                      <Badge bg={e.paymentStatus === "PAID" ? "success" : "info"}>
                        {e.paymentStatus}
                      </Badge>
                    </td>
                    <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                    {role === "OWNER" && (
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEdit(e)}>
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => { setDeleteId(e._id); setShowDelete(true); }}>
                          <FaTrash />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Enrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label fw-semibold">Payment Status</label>
            <select
              className="form-select"
              value={editData.paymentStatus}
              onChange={(e) => setEditData({ ...editData, paymentStatus: e.target.value })}
            >
              <option value="FREE">FREE</option>
              <option value="PAID">PAID</option>
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
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this enrollment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EnrollmentList;