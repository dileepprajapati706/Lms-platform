import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Badge, Card, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaQuestionCircle, FaPlus, FaEdit, FaTrash, FaReply } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchAllQueries, fetchMyQueries } from "../../redux/slices/querySlice";
import { queryAPI } from "../../services/api";
import Loader from "../../components/Loader";

const QueryList = () => {
  const dispatch = useDispatch();
  const { list: queries, loading } = useSelector((state) => state.queries);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const base = role === "OWNER" ? "/owner" : role === "TRAINER" ? "/trainer" : "/learner";

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Reply Modal (OWNER/TRAINER)
  const [showReply, setShowReply] = useState(false);
  const [replyId, setReplyId] = useState(null);
  const [replyData, setReplyData] = useState({ reply: "", status: "OPEN" });
  const [replyQuestion, setReplyQuestion] = useState("");

  useEffect(() => {
    if (role === "LEARNER") {
      dispatch(fetchMyQueries());
    } else {
      dispatch(fetchAllQueries());
    }
  }, [dispatch, role]);

  const handleDelete = async () => {
    try {
      await queryAPI.delete(deleteId);
      toast.success("Query deleted");
      setShowDelete(false);
      dispatch(fetchMyQueries());
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const openReply = (query) => {
    setReplyId(query._id);
    setReplyQuestion(query.question);
    setReplyData({
      reply: query.reply || "",
      status: query.status || "OPEN",
    });
    setShowReply(true);
  };

  const handleReply = async () => {
    try {
      await queryAPI.update(replyId, replyData);
      toast.success("Reply sent successfully");
      setShowReply(false);
      dispatch(fetchAllQueries());
    } catch (err) {
      toast.error(err.response?.data?.message || "Reply failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">
          <FaQuestionCircle className="me-2 text-primary" />
          {role === "LEARNER" ? "My Queries" : "All Queries"}
        </h3>
        {role === "LEARNER" && (
          <Link to={`${base}/queries/add`}>
            <Button variant="primary">
              <FaPlus className="me-1" /> Ask Question
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
                <th>Question</th>
                <th>Reply</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.length === 0 ? (
                <tr>
                  <td colSpan={role === "LEARNER" ? 7 : 8} className="text-center py-4 text-muted">
                    No queries found
                  </td>
                </tr>
              ) : (
                queries.map((q, i) => (
                  <tr key={q._id}>
                    <td>{i + 1}</td>
                    {role !== "LEARNER" && (
                      <td>
                        <div className="fw-semibold">{q.learnerId?.name || "N/A"}</div>
                        <small className="text-muted">{q.learnerId?.email}</small>
                      </td>
                    )}
                    <td className="fw-semibold">{q.courseId?.title || "N/A"}</td>
                    <td>
                      <span className="small">
                        {q.question.length > 40 ? q.question.substring(0, 40) + "..." : q.question}
                      </span>
                    </td>
                    <td>
                      {q.reply ? (
                        <span className="small text-success">
                          {q.reply.length > 40 ? q.reply.substring(0, 40) + "..." : q.reply}
                        </span>
                      ) : (
                        <span className="small text-muted">No reply yet</span>
                      )}
                    </td>
                    <td>
                      <Badge bg={q.status === "OPEN" ? "warning" : "success"}>
                        {q.status}
                      </Badge>
                    </td>
                    <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td>
                      {/* OWNER/TRAINER can reply */}
                      {(role === "OWNER" || role === "TRAINER") && (
                        <Button variant="outline-success" size="sm" className="me-2" onClick={() => openReply(q)}>
                          <FaReply />
                        </Button>
                      )}

                      {/* LEARNER can edit & delete */}
                      {role === "LEARNER" && (
                        <>
                          <Link to={`${base}/queries/edit/${q._id}`}>
                            <Button variant="outline-primary" size="sm" className="me-2">
                              <FaEdit />
                            </Button>
                          </Link>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => { setDeleteId(q._id); setShowDelete(true); }}
                          >
                            <FaTrash />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Reply Modal (OWNER/TRAINER) */}
      <Modal show={showReply} onHide={() => setShowReply(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title><FaReply className="me-2" /> Reply to Query</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 p-3 bg-light rounded">
            <strong>Question:</strong>
            <p className="mb-0 mt-1">{replyQuestion}</p>
          </div>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Your Reply</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={replyData.reply}
              onChange={(e) => setReplyData({ ...replyData, reply: e.target.value })}
              placeholder="Type your reply here..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Status</Form.Label>
            <Form.Select
              value={replyData.status}
              onChange={(e) => setReplyData({ ...replyData, status: e.target.value })}
            >
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReply(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleReply}>
            <FaReply className="me-1" /> Send Reply
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal (LEARNER) */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this query?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QueryList;