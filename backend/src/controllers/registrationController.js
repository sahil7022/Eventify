const db = require("../config/db.config");

exports.registerForEvent = async (req, res) => {
  const { eventId, team_name, role } = req.body;
  const userId = req.user.id;

  try {
    const [existing] = await db.query("SELECT * FROM registrations WHERE user_id = ? AND event_id = ?", [userId, eventId]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    await db.query(
      "INSERT INTO registrations (user_id, event_id, team_name, role) VALUES (?, ?, ?, ?)",
      [userId, eventId, team_name || null, role || "Participant"]
    );
    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering for event" });
  }
};

exports.getUserRegistrations = async (req, res) => {
  try {
    const [registrations] = await db.query(`
      SELECT r.*, e.title, e.event_date, e.location 
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = ?
    `, [req.user.id]);
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registrations" });
  }
};

exports.getEventParticipants = async (req, res) => {
  try {
    const [participants] = await db.query(`
      SELECT r.team_name, r.role, u.name, u.email 
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ?
    `, [req.params.eventId]);
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching participants" });
  }
};
