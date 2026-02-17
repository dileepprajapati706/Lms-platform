const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Payment = require("../models/Payment");

// Enroll learner in course
const enrollLearner = async (data, learnerId) => {
  const { courseId, paymentMode, transactionId, amount } = data;

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    learnerId,
    courseId,
  });
  if (existingEnrollment) {
    throw new Error("Already enrolled in this course");
  }

  let paymentStatus = "FREE";
  let paymentId = null;

  if (course.mode === "PAID") {
    paymentStatus = "PAID";

    // Create enrollment first (without paymentId)
    const enrollment = await Enrollment.create({
      learnerId,
      courseId,
      paymentStatus,
    });

    // Create payment
    const payment = await Payment.create({
      enrollmentId: enrollment._id,
      amount: amount || course.price,
      paymentMode: paymentMode || "ONLINE",
      paymentStatus: "SUCCESS",
      transactionId: transactionId || `TXN_${Date.now()}`,
    });

    // Update enrollment with paymentId
    enrollment.paymentId = payment._id;
    await enrollment.save();

    return await Enrollment.findById(enrollment._id)
      .populate("learnerId", "name email")
      .populate("courseId", "title mode price")
      .populate("paymentId");
  } else {
    // FREE course
    const enrollment = await Enrollment.create({
      learnerId,
      courseId,
      paymentStatus,
    });

    return await Enrollment.findById(enrollment._id)
      .populate("learnerId", "name email")
      .populate("courseId", "title mode price");
  }
};

// Get all enrollments (OWNER)
const getAllEnrollments = async () => {
  return await Enrollment.find()
    .populate("learnerId", "name email phone studentType")
    .populate("courseId", "title mode price")
    .populate("paymentId");
};

// Get enrollments by learner (LEARNER view purchased courses)
const getEnrollmentsByLearner = async (learnerId) => {
  return await Enrollment.find({ learnerId })
    .populate("courseId", "title description mode price bannerUrl duration")
    .populate("paymentId");
};

// Get enrollments by course (TRAINER view enrollments on their courses)
const getEnrollmentsByCourse = async (courseId) => {
  return await Enrollment.find({ courseId })
    .populate("learnerId", "name email phone studentType")
    .populate("courseId", "title mode price")
    .populate("paymentId");
};

// Get enrollment by ID
const getEnrollmentById = async (id) => {
  const enrollment = await Enrollment.findById(id)
    .populate("learnerId", "name email phone studentType")
    .populate("courseId", "title mode price")
    .populate("paymentId");
  if (!enrollment) {
    throw new Error("Enrollment not found");
  }
  return enrollment;
};

// Update enrollment (OWNER only)
const updateEnrollment = async (id, data) => {
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  if (data.paymentStatus) enrollment.paymentStatus = data.paymentStatus;
  if (data.paymentId) enrollment.paymentId = data.paymentId;

  await enrollment.save();
  return await Enrollment.findById(id)
    .populate("learnerId", "name email")
    .populate("courseId", "title mode price")
    .populate("paymentId");
};

// Delete enrollment (OWNER only)
const deleteEnrollment = async (id) => {
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) {
    throw new Error("Enrollment not found");
  }
  await Enrollment.findByIdAndDelete(id);
  return { message: "Enrollment deleted successfully" };
};

module.exports = {
  enrollLearner,
  getAllEnrollments,
  getEnrollmentsByLearner,
  getEnrollmentsByCourse,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};