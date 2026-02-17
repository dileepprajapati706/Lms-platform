const bcrypt = require("bcryptjs");
const InternalUser = require("../models/InternalUser");

// Get all internal users (OWNER only)
const getAllInternalUsers = async () => {
  return await InternalUser.find().select("-password");
};

// Get single internal user by ID
const getInternalUserById = async (id) => {
  const user = await InternalUser.findById(id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Update internal user (OWNER only)
const updateInternalUser = async (id, data) => {
  const user = await InternalUser.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  if (data.name) user.name = data.name;
  if (data.email) user.email = data.email;
  if (data.phone) user.phone = data.phone;
  if (data.role) user.role = data.role;
  if (data.status !== undefined) user.status = data.status;

  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(data.password, salt);
  }

  await user.save();
  const updatedUser = user.toObject();
  delete updatedUser.password;
  return updatedUser;
};

// Delete internal user (OWNER only)
const deleteInternalUser = async (id) => {
  const user = await InternalUser.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  await InternalUser.findByIdAndDelete(id);
  return { message: "User deleted successfully" };
};

module.exports = {
  getAllInternalUsers,
  getInternalUserById,
  updateInternalUser,
  deleteInternalUser,
};