const Lecture = require("../models/Lecture");

// Create lecture (OWNER full CRUD, TRAINER create own)
const createLecture = async (data, user) => {
  // Validate that either trainerId or ownerId exists
  const lectureData = { ...data };

  if (user.role === "TRAINER") {
    lectureData.trainerId = user._id;
  } else if (user.role === "OWNER") {
    lectureData.ownerId = user._id;
  }

  const lecture = await Lecture.create(lectureData);
  return lecture;
};

// Get all lectures (OWNER)
const getAllLectures = async () => {
  return await Lecture.find()
    .populate("courseId", "title")
    .populate("trainerId", "name email")
    .populate("ownerId", "name email");
};

// Get lectures by course ID
const getLecturesByCourse = async (courseId) => {
  return await Lecture.find({ courseId })
    .populate("courseId", "title")
    .populate("trainerId", "name email")
    .populate("ownerId", "name email");
};

// Get lectures by trainer (TRAINER view self lectures)
const getLecturesByTrainer = async (trainerId) => {
  return await Lecture.find({ trainerId })
    .populate("courseId", "title")
    .populate("trainerId", "name email")
    .populate("ownerId", "name email");
};

// Get lecture by ID
const getLectureById = async (id) => {
  const lecture = await Lecture.findById(id)
    .populate("courseId", "title")
    .populate("trainerId", "name email")
    .populate("ownerId", "name email");
  if (!lecture) {
    throw new Error("Lecture not found");
  }
  return lecture;
};

// Update lecture
const updateLecture = async (id, data, user) => {
  const lecture = await Lecture.findById(id);
  if (!lecture) {
    throw new Error("Lecture not found");
  }

  // TRAINER can only edit their own lectures
  if (user.role === "TRAINER") {
    if (lecture.trainerId && lecture.trainerId.toString() !== user._id.toString()) {
      throw new Error("You can only edit your own lectures");
    }
  }

  if (data.lectureTitle) lecture.lectureTitle = data.lectureTitle;
  if (data.duration) lecture.duration = data.duration;
  if (data.lectureMode) lecture.lectureMode = data.lectureMode;
  if (data.lectureType) lecture.lectureType = data.lectureType;
  if (data.content !== undefined) lecture.content = data.content;
  if (data.mediaUrl) lecture.mediaUrl = data.mediaUrl;
  if (data.lectureBannerUrl) lecture.lectureBannerUrl = data.lectureBannerUrl;
  if (data.courseId) lecture.courseId = data.courseId;

  await lecture.save();
  return lecture;
};

// Delete lecture (OWNER only)
const deleteLecture = async (id) => {
  const lecture = await Lecture.findById(id);
  if (!lecture) {
    throw new Error("Lecture not found");
  }
  await Lecture.findByIdAndDelete(id);
  return { message: "Lecture deleted successfully" };
};

module.exports = {
  createLecture,
  getAllLectures,
  getLecturesByCourse,
  getLecturesByTrainer,
  getLectureById,
  updateLecture,
  deleteLecture,
};