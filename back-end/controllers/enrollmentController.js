const enrollmentService = require("../services/enrollmentService");
const sendResponse = require("../utils/responseHandler");

const enrollInCourse = async (req, res) => {
  try {
    const enrollment = await enrollmentService.enrollLearner(
      req.body,
      req.user._id
    );
    return sendResponse(res, 201, true, "Enrolled successfully", enrollment);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    return sendResponse(res, 200, true, "All enrollments fetched", enrollments);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getEnrollmentsByLearner(
      req.user._id
    );
    return sendResponse(
      res,
      200,
      true,
      "My enrollments fetched",
      enrollments
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getEnrollmentsByCourse = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getEnrollmentsByCourse(
      req.params.courseId
    );
    return sendResponse(
      res,
      200,
      true,
      "Enrollments by course fetched",
      enrollments
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await enrollmentService.getEnrollmentById(req.params.id);
    return sendResponse(res, 200, true, "Enrollment fetched", enrollment);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await enrollmentService.updateEnrollment(
      req.params.id,
      req.body
    );
    return sendResponse(
      res,
      200,
      true,
      "Enrollment updated successfully",
      enrollment
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const result = await enrollmentService.deleteEnrollment(req.params.id);
    return sendResponse(res, 200, true, result.message);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  enrollInCourse,
  getAllEnrollments,
  getMyEnrollments,
  getEnrollmentsByCourse,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};