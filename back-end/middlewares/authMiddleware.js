const jwt = require("jsonwebtoken");
const InternalUser = require("../models/InternalUser");
const Learner = require("../models/Learner");
const sendResponse = require("../utils/responseHandler");

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendResponse(res, 401, false, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check userType to find correct user
    if (decoded.userType === "LEARNER") {
      const learner = await Learner.findById(decoded.id).select("-password");
      if (!learner) {
        return sendResponse(res, 401, false, "Learner not found");
      }
      req.user = learner;
      req.user.role = "LEARNER";
      req.user.userType = "LEARNER";
    } else {
      const internalUser = await InternalUser.findById(decoded.id).select(
        "-password"
      );
      if (!internalUser) {
        return sendResponse(res, 401, false, "User not found");
      }
      req.user = internalUser;
      req.user.userType = "INTERNAL";
    }

    next();
  } catch (error) {
    return sendResponse(res, 401, false, "Not authorized, token failed");
  }
};

module.exports = authMiddleware;