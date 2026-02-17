const express = require("express");
const router = express.Router();
const internalUserController = require("../controllers/internalUserController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All routes require auth + OWNER role
router.use(authMiddleware);
router.use(roleMiddleware("OWNER"));

// GET /api/internal-users - Get all internal users
router.get("/", internalUserController.getAllInternalUsers);

// GET /api/internal-users/:id - Get single internal user
router.get("/:id", internalUserController.getInternalUserById);

// PUT /api/internal-users/:id - Update internal user
router.put("/:id", internalUserController.updateInternalUser);

// DELETE /api/internal-users/:id - Delete internal user
router.delete("/:id", internalUserController.deleteInternalUser);

module.exports = router;