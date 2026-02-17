const bcrypt = require("bcryptjs");
const InternalUser = require("../models/InternalUser");
const Learner = require("../models/Learner");
const generateToken = require("../utils/generateToken");

// ==================== INTERNAL USER REGISTER ====================
const registerInternalUser = async (data) => {
  const { name, email, password, role, phone } = data;

  // Check if user already exists
  const existingUser = await InternalUser.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await InternalUser.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
  });

  const token = generateToken(user._id, user.role, "INTERNAL");

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    status: user.status,
    token,
  };
};

// ==================== INTERNAL USER LOGIN ====================
const loginInternalUser = async (data) => {
  const { email, password } = data;

  const user = await InternalUser.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id, user.role, "INTERNAL");

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    status: user.status,
    token,
  };
};

// ==================== LEARNER REGISTER ====================
const registerLearner = async (data) => {
  const { name, email, password, phone, studentType, branchName } = data;

  // Check if learner already exists
  const existingLearner = await Learner.findOne({ email });
  if (existingLearner) {
    throw new Error("Email already registered");
  }

  // Validate branchName for internal students
  if (studentType === "internal" && !branchName) {
    throw new Error("Branch name is required for internal students");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const learner = await Learner.create({
    name,
    email,
    password: hashedPassword,
    phone,
    studentType,
    branchName: studentType === "internal" ? branchName : undefined,
  });

  const token = generateToken(learner._id, "LEARNER", "LEARNER");

  return {
    _id: learner._id,
    name: learner.name,
    email: learner.email,
    phone: learner.phone,
    studentType: learner.studentType,
    branchName: learner.branchName,
    status: learner.status,
    token,
  };
};

// ==================== LEARNER LOGIN ====================
const loginLearner = async (data) => {
  const { email, password } = data;

  const learner = await Learner.findOne({ email });
  if (!learner) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, learner.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(learner._id, "LEARNER", "LEARNER");

  return {
    _id: learner._id,
    name: learner.name,
    email: learner.email,
    phone: learner.phone,
    studentType: learner.studentType,
    branchName: learner.branchName,
    status: learner.status,
    token,
  };
};

module.exports = {
  registerInternalUser,
  loginInternalUser,
  registerLearner,
  loginLearner,
};