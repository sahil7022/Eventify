const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.use(verifyToken, isAdmin);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getAllUsers);
router.patch("/users/:userId/role", adminController.updateUserRole);
router.get("/applications", adminController.getApplications);
router.patch("/applications/:appId", adminController.handleApplication);
router.get("/external-requests", adminController.getExternalRequests);

module.exports = router;
