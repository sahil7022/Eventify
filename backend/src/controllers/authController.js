const db = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const { name, email, password, phone, institution, department, year } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All required fields missing" });
  }

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, phone, institution, department, year) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, institution, department, year]
    );

    const userId = result.insertId;
    await db.query(
      "INSERT INTO user_profiles (user_id, name, college, dept, mobile) VALUES (?, ?, ?, ?, ?)",
      [userId, name, institution, department, phone]
    );

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, collegeId: user.collegeId },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await db.query("UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?", [resetToken, expiry, email]);

    const resetLink = `http://localhost:5173/reset?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password - Eventify",
      html: `<h3>Password Reset Request</h3><p>Click <a href="${resetLink}">here</a> to reset your password. Valid for 15 mins.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in forgot password flow" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > NOW()", [token]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?", [hashedPassword, token]);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [profiles] = await db.query("SELECT * FROM user_profiles WHERE user_id = ?", [req.user.id]);
    res.json(profiles[0] || {});
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, college, dept, mobile, bio, skills, goal, avatar } = req.body;
  const userId = req.user.id;

  try {
    const sql = `
      INSERT INTO user_profiles (user_id, name, college, dept, mobile, bio, skills, goal, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      name=?, college=?, dept=?, mobile=?, bio=?, skills=?, goal=?, avatar=?
    `;
    await db.query(sql, [
      userId, name, college, dept, mobile, bio, skills, goal, avatar,
      name, college, dept, mobile, bio, skills, goal, avatar
    ]);
    res.json({ message: "Profile saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving profile" });
  }
};
