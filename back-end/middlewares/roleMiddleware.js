const sendResponse = require("../utils/responseHandler");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, "Not authorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        "Access denied. You do not have permission."
      );
    }

    next();
  };
};

module.exports = roleMiddleware;