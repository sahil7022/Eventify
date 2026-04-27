const db = require("../config/db.config");

exports.sendNotice = async (req, res) => {
  const { message, eventId, type } = req.body;
  try {
    await db.query(
      "INSERT INTO notices (event_id, message, type, created_by) VALUES (?, ?, ?, ?)",
      [eventId, message, type || 'general', req.user.id]
    );
    res.status(201).json({ message: "Notice broadcasted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error broadcasting notice" });
  }
};

exports.getEventNotices = async (req, res) => {
  try {
    const [notices] = await db.query(
      "SELECT * FROM notices WHERE event_id = ? ORDER BY created_at DESC",
      [req.params.eventId]
    );
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notices" });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const [notices] = await db.query(
      "SELECT n.*, e.title as eventName FROM notices n JOIN events e ON n.event_id = e.id ORDER BY n.created_at DESC"
    );
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all notices" });
  }
};
