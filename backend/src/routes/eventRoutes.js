const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const registrationController = require("../controllers/registrationController");
const broadcastController = require("../controllers/broadcastController");
const { verifyToken, isOrganizer } = require("../middleware/authMiddleware");

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.post("/", verifyToken, isOrganizer, eventController.createEvent);
router.put("/:id", verifyToken, isOrganizer, eventController.updateEvent);
router.delete("/:id", verifyToken, isOrganizer, eventController.deleteEvent);

// Sub-events
router.get("/:eventId/sub-events", eventController.getSubEvents);
router.post("/:eventId/sub-events", verifyToken, isOrganizer, eventController.createSubEvent);

// Registrations
router.post("/register", verifyToken, registrationController.registerForEvent);
router.get("/user/registrations", verifyToken, registrationController.getUserRegistrations);
router.get("/:eventId/participants", verifyToken, isOrganizer, registrationController.getEventParticipants);

// Bookmarks
router.get("/user/bookmarks", verifyToken, eventController.getBookmarks);
router.post("/bookmark", verifyToken, eventController.addBookmark);
router.delete("/bookmark/:eventId", verifyToken, eventController.removeBookmark);

// Notices
router.get("/:eventId/notices", broadcastController.getEventNotices);
router.post("/notice", verifyToken, isOrganizer, broadcastController.sendNotice);

module.exports = router;
