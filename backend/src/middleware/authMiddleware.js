const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

const isOrganizer = (req, res, next) => {
  if (req.user && (req.user.role === "organizer" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Organizer or Admin only." });
  }
};

module.exports = { verifyToken, isAdmin, isOrganizer };
