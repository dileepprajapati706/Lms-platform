const QueryModel = require("../models/Query");

// Create query (LEARNER only)
const createQuery = async (data, learnerId) => {
  const query = await QueryModel.create({
    ...data,
    learnerId,
  });
  return query;
};

// Get all queries (OWNER, TRAINER)
const getAllQueries = async () => {
  return await QueryModel.find()
    .populate("courseId", "title")
    .populate("learnerId", "name email");
};

// Get queries by learner (LEARNER self)
const getQueriesByLearner = async (learnerId) => {
  return await QueryModel.find({ learnerId })
    .populate("courseId", "title")
    .populate("learnerId", "name email");
};

// Get queries by course
const getQueriesByCourse = async (courseId) => {
  return await QueryModel.find({ courseId })
    .populate("courseId", "title")
    .populate("learnerId", "name email");
};

// Get query by ID
const getQueryById = async (id) => {
  const query = await QueryModel.findById(id)
    .populate("courseId", "title")
    .populate("learnerId", "name email");
  if (!query) {
    throw new Error("Query not found");
  }
  return query;
};

// Update query (LEARNER update own question, OWNER/TRAINER reply)
const updateQuery = async (id, data, user) => {
  const query = await QueryModel.findById(id);
  if (!query) {
    throw new Error("Query not found");
  }

  if (user.role === "LEARNER") {
    if (query.learnerId.toString() !== user._id.toString()) {
      throw new Error("You can only update your own queries");
    }
    if (data.question) query.question = data.question;
  }

  // OWNER or TRAINER can reply
  if (user.role === "OWNER" || user.role === "TRAINER") {
    if (data.reply !== undefined) query.reply = data.reply;
    if (data.status) query.status = data.status;
  }

  await query.save();
  return query;
};

// Delete query (LEARNER self only)
const deleteQuery = async (id, learnerId) => {
  const query = await QueryModel.findById(id);
  if (!query) {
    throw new Error("Query not found");
  }

  if (query.learnerId.toString() !== learnerId.toString()) {
    throw new Error("You can only delete your own queries");
  }

  await QueryModel.findByIdAndDelete(id);
  return { message: "Query deleted successfully" };
};

module.exports = {
  createQuery,
  getAllQueries,
  getQueriesByLearner,
  getQueriesByCourse,
  getQueryById,
  updateQuery,
  deleteQuery,
};