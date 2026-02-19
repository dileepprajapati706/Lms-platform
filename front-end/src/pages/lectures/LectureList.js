import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Badge, Card, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaVideo } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchLectures, fetchMyLectures } from "../../redux/slices/lectureSlice";
import { lectureAPI } from "../../services/api";
import Loader from "../../components/Loader";

const LectureList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: lectures, loading } = useSelector((state) => state.lectures);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const base = role === "OWNER" ? "/owner" : role === "TRAINER" ? "/trainer" : "/learner";

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (role === "OWNER") dispatch(fetchLectures());
    else if (role === "TRAINER") dispatch(fetchMyLectures());
  }, [dispatch, role]);

  const handleDelete = async () => {
    try {
      await lectureAPI.delete(deleteId);
      toast.success("Lecture deleted");
      setShowDelete(false);
      if (role === "OWNER") dispatch(fetchLectures());
      else dispatch(fetchMyLectures());
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0"><FaVideo className="me-2" /> Lectures</h3>
        {(role === "OWNER" || role === "TRAINER") && (
          <Link to={`${base}/lectures/add`}>
            <Button variant="primary"><FaPlus className="me-1" /> Add Lecture</Button>
          </Link>
        )}
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Course</th>
                <th>Mode</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No lectures found</td></tr>
              ) : (
                lectures.map((l, i) => (
                  <tr key={l._id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{l.lectureTitle}</td>
                    <td>{l.courseId?.title || "N/A"}</td>
                    <td><Badge bg="info">{l.lectureMode}</Badge></td>
                    <td><Badge bg={l.lectureType === "FREE" ? "success" : "warning"}>{l.lectureType}</Badge></td>
                    <td>{l.duration || "N/A"}</td>
                    <td>
                      {(role === "OWNER" || role === "TRAINER") && (
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate(`${base}/lectures/edit/${l._id}`)}>
                          <FaEdit />
                        </Button>
                      )}
                      {role === "OWNER" && (
                        <Button variant="outline-danger" size="sm" onClick={() => { setDeleteId(l._id); setShowDelete(true); }}>
                          <FaTrash />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this lecture?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LectureList;