const express = require("express");
const router = express.Router();
const externalEventController = require("../controllers/externalEventController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Public submission
router.post("/request", externalEventController.submitRequest);

// Admin handling
router.patch("/:id", verifyToken, isAdmin, externalEventController.handleRequest);

module.exports = router;
