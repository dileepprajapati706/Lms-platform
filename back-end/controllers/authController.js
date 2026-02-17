const authService = require("../services/authService");
const sendResponse = require("../utils/responseHandler");

// Register Internal User (OWNER/TRAINER)
const registerInternalUser = async (req, res) => {
  try {
    const result = await authService.registerInternalUser(req.body);
    return sendResponse(res, 201, true, "Registration successful", result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

// Login Internal User
const loginInternalUser = async (req, res) => {
  try {
    const result = await authService.loginInternalUser(req.body);
    return sendResponse(res, 200, true, "Login successful", result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

// Register Learner
const registerLearner = async (req, res) => {
  try {
    const result = await authService.registerLearner(req.body);
    return sendResponse(res, 201, true, "Learner registration successful", result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

// Login Learner
const loginLearner = async (req, res) => {
  try {
    const result = await authService.loginLearner(req.body);
    return sendResponse(res, 200, true, "Login successful", result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  registerInternalUser,
  loginInternalUser,
  registerLearner,
  loginLearner,
};