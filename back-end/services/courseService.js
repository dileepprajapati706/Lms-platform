const Course = require("../models/Course");

// Create course (OWNER only)
const createCourse = async (data, userId) => {
  const course = await Course.create({
    ...data,
    createdBy: userId,
  });
  return course;
};

// Get all courses
const getAllCourses = async () => {
  return await Course.find().populate("createdBy", "name email role");
};

// Get course by ID
const getCourseById = async (id) => {
  const course = await Course.findById(id).populate(
    "createdBy",
    "name email role"
  );
  if (!course) {
    throw new Error("Course not found");
  }
  return course;
};

// Update course (OWNER only)
const updateCourse = async (id, data) => {
  const course = await Course.findById(id);
  if (!course) {
    throw new Error("Course not found");
  }

  if (data.title) course.title = data.title;
  if (data.description !== undefined) course.description = data.description;
  if (data.duration) course.duration = data.duration;
  if (data.mode) course.mode = data.mode;
  if (data.price !== undefined) course.price = data.price;
  if (data.bannerUrl) course.bannerUrl = data.bannerUrl;

  await course.save();
  return course;
};

// Delete course (OWNER only)
const deleteCourse = async (id) => {
  const course = await Course.findById(id);
  if (!course) {
    throw new Error("Course not found");
  }
  await Course.findByIdAndDelete(id);
  return { message: "Course deleted successfully" };
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};