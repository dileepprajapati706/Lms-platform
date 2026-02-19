import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Badge, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaStar, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchAllFeedbacks, fetchMyFeedbacks } from "../../redux/slices/feedbackSlice";
import { feedbackAPI } from "../../services/api";
import Loader from "../../components/Loader";

const FeedbackList = () => {
  const dispatch = useDispatch();
  const { list: feedbacks, loading } = useSelector((state) => state.feedbacks);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const base = role === "OWNER" ? "/owner" : role === "TRAINER" ? "/trainer" : "/learner";

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (role === "LEARNER") {
      dispatch(fetchMyFeedbacks());
    } else {
      dispatch(fetchAllFeedbacks());
    }
  }, [dispatch, role]);

  const handleDelete = async () => {
    try {
      await feedbackAPI.delete(deleteId);
      toast.success("Feedback deleted");
      setShowDelete(false);
      dispatch(fetchMyFeedbacks());
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? "text-warning" : "text-muted"} size={14} />
    ));
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">
          <FaStar className="me-2 text-warning" />
          {role === "LEARNER" ? "My Feedbacks" : "All Feedbacks"}
        </h3>
        {role === "LEARNER" && (
          <Link to={`${base}/feedbacks/add`}>
            <Button variant="primary">
              <FaPlus className="me-1" /> Give Feedback
            </Button>
          </Link>
        )}
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                {role !== "LEARNER" && <th>Learner</th>}
                <th>Course</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Date</th>
                {role === "LEARNER" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={role === "LEARNER" ? 6 : 6} className="text-center py-4 text-muted">
                    No feedbacks found
                  </td>
                </tr>
              ) : (
                feedbacks.map((f, i) => (
                  <tr key={f._id}>
                    <td>{i + 1}</td>
                    {role !== "LEARNER" && (
                      <td>
                        <div className="fw-semibold">{f.learnerId?.name || "N/A"}</div>
                        <small className="text-muted">{f.learnerId?.email}</small>
                      </td>
                    )}
                    <td className="fw-semibold">{f.courseId?.title || "N/A"}</td>
                    <td>
                      <div className="d-flex gap-1">{renderStars(f.rating)}</div>
                      <small className="text-muted">({f.rating}/5)</small>
                    </td>
                    <td>
                      <span className="text-muted small">
                        {f.comments ? (f.comments.length > 50 ? f.comments.substring(0, 50) + "..." : f.comments) : "No comments"}
                      </span>
                    </td>
                    <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                    {role === "LEARNER" && (
                      <td>
                        <Link to={`${base}/feedbacks/edit/${f._id}`}>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => { setDeleteId(f._id); setShowDelete(true); }}
                        >
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

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this feedback?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FeedbackList;