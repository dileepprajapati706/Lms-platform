const courseService = require("../services/courseService");
const sendResponse = require("../utils/responseHandler");

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body, req.user._id);
    return sendResponse(res, 201, true, "Course created successfully", course);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    return sendResponse(res, 200, true, "All courses fetched", courses);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    return sendResponse(res, 200, true, "Course fetched", course);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    return sendResponse(res, 200, true, "Course updated successfully", course);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const result = await courseService.deleteCourse(req.params.id);
    return sendResponse(res, 200, true, result.message);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};