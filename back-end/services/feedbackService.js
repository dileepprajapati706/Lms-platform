const Feedback = require("../models/Feedback");

// Create feedback (LEARNER only)
const createFeedback = async (data, learnerId) => {
  const existingFeedback = await Feedback.findOne({
    courseId: data.courseId,
    learnerId,
  });
  if (existingFeedback) {
    throw new Error("You have already given feedback for this course");
  }

  const feedback = await Feedback.create({
    ...data,
    learnerId,
  });
  return feedback;
};

// Get all feedbacks (OWNER, TRAINER)
const getAllFeedbacks = async () => {
  return await Feedback.find()
    .populate("courseId", "title")
    .populate("learnerId", "name email");
};

// Get feedbacks by course
const getFeedbacksByCourse = async (courseId) => {
  return await Feedback.find({ courseId })
    .populate("courseId", "title")
    .populate("learnerId", "name email");
};

// Get feedbacks by learner (LEARNER view self feedbacks)
const getFeedbacksByLearner = async (learnerId) => {
  return await Feedback.find({ learnerId })
    .populate("courseId", "title")
    .populate("learnerId", "name email");
};

// Get feedback by ID
const getFeedbackById = async (id) => {
  const feedback = await Feedback.findById(id)
    .populate("courseId", "title")
    .populate("learnerId", "name email");
  if (!feedback) {
    throw new Error("Feedback not found");
  }
  return feedback;
};

// Update feedback (LEARNER self only)
const updateFeedback = async (id, data, learnerId) => {
  const feedback = await Feedback.findById(id);
  if (!feedback) {
    throw new Error("Feedback not found");
  }

  if (feedback.learnerId.toString() !== learnerId.toString()) {
    throw new Error("You can only update your own feedback");
  }

  if (data.rating) feedback.rating = data.rating;
  if (data.comments !== undefined) feedback.comments = data.comments;

  await feedback.save();
  return feedback;
};

// Delete feedback (LEARNER self only)
const deleteFeedback = async (id, learnerId) => {
  const feedback = await Feedback.findById(id);
  if (!feedback) {
    throw new Error("Feedback not found");
  }

  if (feedback.learnerId.toString() !== learnerId.toString()) {
    throw new Error("You can only delete your own feedback");
  }

  await Feedback.findByIdAndDelete(id);
  return { message: "Feedback deleted successfully" };
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getFeedbacksByCourse,
  getFeedbacksByLearner,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};