const db = require("../config/db.config");

exports.getAllEvents = async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM events ORDER BY event_date DESC");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM events WHERE id = ?", [req.params.id]);
    if (events.length === 0) return res.status(404).json({ message: "Event not found" });
    res.json(events[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event details" });
  }
};

exports.createEvent = async (req, res) => {
  const { title, description, event_date, location, departmentId, banner_url } = req.body;
  const collegeId = req.user.collegeId;
  const createdBy = req.user.id;

  try {
    const [result] = await db.query(
      "INSERT INTO events (title, description, event_date, location, collegeId, departmentId, created_by, banner_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description, event_date, location, collegeId, departmentId || null, createdBy, banner_url || null]
    );
    res.status(201).json({ message: "Event created successfully", eventId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
  }
};

exports.updateEvent = async (req, res) => {
  const { title, description, event_date, location, banner_url } = req.body;
  try {
    await db.query(
      "UPDATE events SET title=?, description=?, event_date=?, location=?, banner_url=? WHERE id=?",
      [title, description, event_date, location, banner_url, req.params.id]
    );
    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await db.query("DELETE FROM events WHERE id=?", [req.params.id]);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
};

// Sub-events
exports.getSubEvents = async (req, res) => {
  try {
    const [subEvents] = await db.query("SELECT * FROM sub_events WHERE event_id = ?", [req.params.eventId]);
    res.json(subEvents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sub-events" });
  }
};

exports.createSubEvent = async (req, res) => {
  const { title, description, time, location } = req.body;
  const eventId = req.params.eventId;
  try {
    const [result] = await db.query(
      "INSERT INTO sub_events (event_id, title, description, time, location) VALUES (?, ?, ?, ?, ?)",
      [eventId, title, description, time, location]
    );
    res.status(201).json({ message: "Sub-event created", id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error creating sub-event" });
  }
};

// Bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const [bookmarks] = await db.query("SELECT event_id FROM bookmarks WHERE user_id = ?", [req.user.id]);
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookmarks" });
  }
};

exports.addBookmark = async (req, res) => {
  const { eventId } = req.body;
  try {
    await db.query("INSERT IGNORE INTO bookmarks (user_id, event_id) VALUES (?, ?)", [req.user.id, eventId]);
    res.json({ message: "Bookmarked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error bookmarking event" });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    await db.query("DELETE FROM bookmarks WHERE user_id = ? AND event_id = ?", [req.user.id, req.params.eventId]);
    res.json({ message: "Bookmark removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing bookmark" });
  }
};
