const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Route imports
const authRoutes = require("./src/routes/authRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const externalRoutes = require("./src/routes/externalRoutes");
const adminController = require("./src/controllers/adminController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve static files if any

// Home Route
app.get("/", (req, res) => {
  res.send("<h1>Eventify Backend API</h1><p>Running optimally...</p>");
});

// Stats (Publicly accessible as per original server.js)
app.get("/api/stats", adminController.getStats);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/external-events", externalRoutes);

// Legacy/Compatibility Root Routes (if frontend hits /api/login instead of /api/auth/login)
app.use("/api", authRoutes); 

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
