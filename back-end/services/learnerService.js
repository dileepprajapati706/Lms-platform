const bcrypt = require("bcryptjs");
const Learner = require("../models/Learner");

// Get all learners (OWNER only)
const getAllLearners = async () => {
  return await Learner.find().select("-password");
};

// Get learner by ID
const getLearnerById = async (id) => {
  const learner = await Learner.findById(id).select("-password");
  if (!learner) {
    throw new Error("Learner not found");
  }
  return learner;
};

// Update learner (self update or OWNER update)
const updateLearner = async (id, data, requestUser) => {
  const learner = await Learner.findById(id);
  if (!learner) {
    throw new Error("Learner not found");
  }

  // If learner is updating self, only allow certain fields
  if (requestUser.role === "LEARNER") {
    if (requestUser._id.toString() !== id) {
      throw new Error("You can only update your own profile");
    }
  }

  if (data.name) learner.name = data.name;
  if (data.email) learner.email = data.email;
  if (data.phone) learner.phone = data.phone;
  if (data.studentType) learner.studentType = data.studentType;
  if (data.branchName !== undefined) learner.branchName = data.branchName;
  if (data.status !== undefined && requestUser.role === "OWNER") {
    learner.status = data.status;
  }

  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    learner.password = await bcrypt.hash(data.password, salt);
  }

  // Validate branchName
  if (learner.studentType === "internal" && !learner.branchName) {
    throw new Error("Branch name is required for internal students");
  }

  await learner.save();
  const updatedLearner = learner.toObject();
  delete updatedLearner.password;
  return updatedLearner;
};

// Delete learner (OWNER only)
const deleteLearner = async (id) => {
  const learner = await Learner.findById(id);
  if (!learner) {
    throw new Error("Learner not found");
  }
  await Learner.findByIdAndDelete(id);
  return { message: "Learner deleted successfully" };
};

module.exports = {
  getAllLearners,
  getLearnerById,
  updateLearner,
  deleteLearner,
};