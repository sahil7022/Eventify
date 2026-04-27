const db = require("../config/db.config");

exports.submitRequest = async (req, res) => {
  const { collegeName, eventName, eventDetails, websiteLink } = req.body;
  try {
    await db.query(
      "INSERT INTO external_event_requests (college_name, event_name, event_details, website_link) VALUES (?, ?, ?, ?)",
      [collegeName, eventName, eventDetails, websiteLink]
    );
    res.status(201).json({ message: "External event request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting request" });
  }
};

exports.handleRequest = async (req, res) => {
  const { status } = req.body;
  try {
    await db.query("UPDATE external_event_requests SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Error handling request" });
  }
};
