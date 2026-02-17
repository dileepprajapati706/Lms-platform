const lectureService = require("../services/lectureService");
const sendResponse = require("../utils/responseHandler");

const createLecture = async (req, res) => {
  try {
    const lecture = await lectureService.createLecture(req.body, req.user);
    return sendResponse(res, 201, true, "Lecture created successfully", lecture);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getAllLectures = async (req, res) => {
  try {
    const lectures = await lectureService.getAllLectures();
    return sendResponse(res, 200, true, "All lectures fetched", lectures);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getLecturesByCourse = async (req, res) => {
  try {
    const lectures = await lectureService.getLecturesByCourse(req.params.courseId);
    return sendResponse(res, 200, true, "Lectures fetched", lectures);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getMyLectures = async (req, res) => {
  try {
    const lectures = await lectureService.getLecturesByTrainer(req.user._id);
    return sendResponse(res, 200, true, "My lectures fetched", lectures);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getLectureById = async (req, res) => {
  try {
    const lecture = await lectureService.getLectureById(req.params.id);
    return sendResponse(res, 200, true, "Lecture fetched", lecture);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateLecture = async (req, res) => {
  try {
    const lecture = await lectureService.updateLecture(
      req.params.id,
      req.body,
      req.user
    );
    return sendResponse(res, 200, true, "Lecture updated successfully", lecture);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteLecture = async (req, res) => {
  try {
    const result = await lectureService.deleteLecture(req.params.id);
    return sendResponse(res, 200, true, result.message);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  createLecture,
  getAllLectures,
  getLecturesByCourse,
  getMyLectures,
  getLectureById,
  updateLecture,
  deleteLecture,
};