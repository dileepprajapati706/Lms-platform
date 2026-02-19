import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Badge, Card } from "react-bootstrap";
import { FaCreditCard } from "react-icons/fa";
import { fetchAllPayments, fetchMyPayments } from "../../redux/slices/paymentSlice";
import Loader from "../../components/Loader";

const PaymentList = () => {
  const dispatch = useDispatch();
  const { list: payments, loading } = useSelector((state) => state.payments);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  useEffect(() => {
    if (role === "OWNER") {
      dispatch(fetchAllPayments());
    } else if (role === "LEARNER") {
      dispatch(fetchMyPayments());
    }
  }, [dispatch, role]);

  if (loading) return <Loader />;

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <FaCreditCard className="me-2" />
        {role === "LEARNER" ? "My Payments" : "All Payments"}
      </h3>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                {role !== "LEARNER" && <th>Learner</th>}
                <th>Course</th>
                <th>Amount (₹)</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={role === "LEARNER" ? 7 : 8} className="text-center py-4 text-muted">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <tr key={p._id}>
                    <td>{i + 1}</td>
                    {role !== "LEARNER" && (
                      <td>
                        <div className="fw-semibold">{p.enrollmentId?.learnerId?.name || "N/A"}</div>
                        <small className="text-muted">{p.enrollmentId?.learnerId?.email}</small>
                      </td>
                    )}
                    <td className="fw-semibold">{p.enrollmentId?.courseId?.title || "N/A"}</td>
                    <td className="fw-bold text-success">₹{p.amount}</td>
                    <td>{p.paymentMode || "N/A"}</td>
                    <td>
                      <Badge bg={p.paymentStatus === "SUCCESS" ? "success" : "danger"}>
                        {p.paymentStatus}
                      </Badge>
                    </td>
                    <td>
                      <code className="small">{p.transactionId || "N/A"}</code>
                    </td>
                    <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PaymentList;