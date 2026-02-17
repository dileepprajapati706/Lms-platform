const feedbackService = require("../services/feedbackService");
const sendResponse = require("../utils/responseHandler");

const createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.createFeedback(
      req.body,
      req.user._id
    );
    return sendResponse(
      res,
      201,
      true,
      "Feedback submitted successfully",
      feedback
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();
    return sendResponse(res, 200, true, "All feedbacks fetched", feedbacks);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getFeedbacksByCourse = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getFeedbacksByCourse(
      req.params.courseId
    );
    return sendResponse(res, 200, true, "Feedbacks fetched", feedbacks);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getFeedbacksByLearner(
      req.user._id
    );
    return sendResponse(res, 200, true, "My feedbacks fetched", feedbacks);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const feedback = await feedbackService.getFeedbackById(req.params.id);
    return sendResponse(res, 200, true, "Feedback fetched", feedback);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.updateFeedback(
      req.params.id,
      req.body,
      req.user._id
    );
    return sendResponse(
      res,
      200,
      true,
      "Feedback updated successfully",
      feedback
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const result = await feedbackService.deleteFeedback(
      req.params.id,
      req.user._id
    );
    return sendResponse(res, 200, true, result.message);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getFeedbacksByCourse,
  getMyFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};