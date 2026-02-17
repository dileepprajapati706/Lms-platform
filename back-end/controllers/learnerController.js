const learnerService = require("../services/learnerService");
const sendResponse = require("../utils/responseHandler");

const getAllLearners = async (req, res) => {
  try {
    const learners = await learnerService.getAllLearners();
    return sendResponse(res, 200, true, "All learners fetched", learners);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getLearnerById = async (req, res) => {
  try {
    const learner = await learnerService.getLearnerById(req.params.id);
    return sendResponse(res, 200, true, "Learner fetched", learner);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

// Get self profile (LEARNER)
const getSelfProfile = async (req, res) => {
  try {
    const learner = await learnerService.getLearnerById(req.user._id);
    return sendResponse(res, 200, true, "Profile fetched", learner);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateLearner = async (req, res) => {
  try {
    const learner = await learnerService.updateLearner(
      req.params.id,
      req.body,
      req.user
    );
    return sendResponse(res, 200, true, "Learner updated successfully", learner);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

// Update self (LEARNER)
const updateSelf = async (req, res) => {
  try {
    const learner = await learnerService.updateLearner(
      req.user._id,
      req.body,
      req.user
    );
    return sendResponse(res, 200, true, "Profile updated successfully", learner);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteLearner = async (req, res) => {
  try {
    const result = await learnerService.deleteLearner(req.params.id);
    return sendResponse(res, 200, true, result.message);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  getAllLearners,
  getLearnerById,
  getSelfProfile,
  updateLearner,
  updateSelf,
  deleteLearner,
};