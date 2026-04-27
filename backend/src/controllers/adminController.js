const db = require("../config/db.config");

exports.getStats = async (req, res) => {
  try {
    const [userCount] = await db.query("SELECT COUNT(*) as users FROM users");
    const [eventCount] = await db.query("SELECT COUNT(*) as events FROM events");
    const [deptCount] = await db.query("SELECT COUNT(DISTINCT department) as depts FROM users");

    res.json({
      totalUsers: userCount[0].users,
      totalEvents: eventCount[0].events,
      departments: deptCount[0].depts,
      activeSessions: 12, // Placeholder
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, role, institution, department FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, req.params.userId]);
    res.json({ message: "User role updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role" });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const [apps] = await db.query(`
      SELECT oa.*, u.name as userName, e.title as eventName 
      FROM organizer_applications oa
      JOIN users u ON oa.user_id = u.id
      JOIN events e ON oa.event_id = e.id
      WHERE oa.status = 'pending'
    `);
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};

exports.handleApplication = async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  try {
    await db.query("UPDATE organizer_applications SET status = ? WHERE id = ?", [status, req.params.appId]);
    if (status === 'approved') {
       // Optionally update user role to organizer for that specific event scope
       // This would require a more complex role system, for now just update status
    }
    res.json({ message: `Application ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Error handling application" });
  }
};

exports.getExternalRequests = async (req, res) => {
  try {
    const [requests] = await db.query("SELECT * FROM external_event_requests WHERE status = 'pending'");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching external requests" });
  }
};
