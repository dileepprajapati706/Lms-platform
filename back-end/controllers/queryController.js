const queryService = require("../services/queryService");
const sendResponse = require("../utils/responseHandler");

const createQuery = async (req, res) => {
  try {
    const query = await queryService.createQuery(req.body, req.user._id);
    return sendResponse(res, 201, true, "Query submitted successfully", query);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getAllQueries = async (req, res) => {
  try {
    const queries = await queryService.getAllQueries();
    return sendResponse(res, 200, true, "All queries fetched", queries);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getMyQueries = async (req, res) => {
  try {
    const queries = await queryService.getQueriesByLearner(req.user._id);
    return sendResponse(res, 200, true, "My queries fetched", queries);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getQueriesByCourse = async (req, res) => {
  try {
    const queries = await queryService.getQueriesByCourse(req.params.courseId);
    return sendResponse(res, 200, true, "Queries fetched", queries);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getQueryById = async (req, res) => {
  try {
    const query = await queryService.getQueryById(req.params.id);
    return sendResponse(res, 200, true, "Query fetched", query);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateQuery = async (req, res) => {
  try {
    const query = await queryService.updateQuery(
      req.params.id,
      req.body,
      req.user
    );
    return sendResponse(res, 200, true, "Query updated successfully", query);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteQuery = async (req, res) => {
  try {
    const result = await queryService.deleteQuery(req.params.id, req.user._id);
    return sendResponse(res, 200, true, result.message);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  createQuery,
  getAllQueries,
  getMyQueries,
  getQueriesByCourse,
  getQueryById,
  updateQuery,
  deleteQuery,
};