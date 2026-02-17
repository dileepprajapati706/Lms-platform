const internalUserService = require("../services/internalUserService");
const sendResponse = require("../utils/responseHandler");

const getAllInternalUsers = async (req, res) => {
  try {
    const users = await internalUserService.getAllInternalUsers();
    return sendResponse(res, 200, true, "All internal users fetched", users);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getInternalUserById = async (req, res) => {
  try {
    const user = await internalUserService.getInternalUserById(req.params.id);
    return sendResponse(res, 200, true, "User fetched", user);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateInternalUser = async (req, res) => {
  try {
    const user = await internalUserService.updateInternalUser(
      req.params.id,
      req.body
    );
    return sendResponse(res, 200, true, "User updated successfully", user);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteInternalUser = async (req, res) => {
  try {
    const result = await internalUserService.deleteInternalUser(req.params.id);
    return sendResponse(res, 200, true, result.message);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  getAllInternalUsers,
  getInternalUserById,
  updateInternalUser,
  deleteInternalUser,
};