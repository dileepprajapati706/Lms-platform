const Payment = require("../models/Payment");
const Enrollment = require("../models/Enrollment");

// Create payment
const createPayment = async (data) => {
  const payment = await Payment.create(data);
  return payment;
};

// Get all payments (OWNER)
const getAllPayments = async () => {
  return await Payment.find().populate({
    path: "enrollmentId",
    populate: [
      { path: "learnerId", select: "name email" },
      { path: "courseId", select: "title" },
    ],
  });
};

// Get payments by learner (LEARNER view self payments)
const getPaymentsByLearner = async (learnerId) => {
  // First get all enrollments of this learner
  const enrollments = await Enrollment.find({ learnerId });
  const enrollmentIds = enrollments.map((e) => e._id);

  return await Payment.find({ enrollmentId: { $in: enrollmentIds } }).populate({
    path: "enrollmentId",
    populate: [
      { path: "learnerId", select: "name email" },
      { path: "courseId", select: "title" },
    ],
  });
};

// Get payment by ID
const getPaymentById = async (id) => {
  const payment = await Payment.findById(id).populate({
    path: "enrollmentId",
    populate: [
      { path: "learnerId", select: "name email" },
      { path: "courseId", select: "title" },
    ],
  });
  if (!payment) {
    throw new Error("Payment not found");
  }
  return payment;
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentsByLearner,
  getPaymentById,
};