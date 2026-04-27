const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ----------email sender----
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.get("/", (req, res) => {
    res.send("eventify backend running");
});

app.get("/api/stats", (req, res) => {
    const stats = {};

    db.query("SELECT COUNT(*) AS users FROM users", (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        stats.users = result[0].users;

        db.query("SELECT COUNT(*) AS events FROM events", (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            stats.events = result[0].events;

            db.query("SELECT COUNT(DISTINCT department) AS departments FROM users", (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }

                stats.departments = result[0].departments;

                stats.onlineUsers = 1;

                res.json(stats);
            });
        });
    });
});

const PORT = 5000;

app.get("/api/test-db", (req, res) => {
  console.log("🔥 /api/test-db hit");

  db.query("SELECT 1 + 1 AS result", (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: err });
    }

    console.log("DB Query Success:", result);
    res.json({ success: true, result });
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// ------------------------

app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                collegeId: user.collegeId
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
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
    });
});


app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, phone, institution, department, year } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All required fields missing" });
  }

  try {
    // 🔒 Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // 🔹 Insert user
      const sql = `
        INSERT INTO users (name, email, password, phone, institution, department, year)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [name, email, hashedPassword, phone, institution, department, year],
        (err, result) => {
          if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({ message: err.message });
          }

          const userId = result.insertId;

          // 🔥 Create empty profile row (IMPORTANT)
          const profileSQL = `
            INSERT INTO user_profiles (user_id, name, college, dept)
            VALUES (?, ?, ?, ?)
          `;

          db.query(
            profileSQL,
            [userId, name, institution, department],
            (err) => {
              if (err) {
                console.error("Profile Error:", err);
              }

              res.json({
                message: "User registered successfully",
                userId
              });
            }
          );
        }
      );
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ----AuthenticatorAssertionResponse------

app.post("/api/auth/forgot-password", async (req, res) => {
    try {
        
        const { email } = req.body;

        const query = "SELECT * FROM users WHERE email = ?";

        db.query(query, [email], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Databse Error" });
            }
            if (results.length === 0) {
                return res.json({ message: "User not found" });
            }
            const resetToken = crypto.randomBytes(32).toString("hex");
            const expiry = new Date(Date.now()+15*60*1000);
            const updateQuery = `UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?`;

            db.query(updateQuery, [resetToken,expiry, email], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error saving token" });
                }
             const resetLink = `http://localhost:5173/reset?token=${resetToken}`;
              
                const mailOptions = {
                    from: "Samarthbg15@gmail.com",
                    to: email,
                    subject: "Reset Your Password - Eventify",
                    html: `
                         <h3>Password Reset Request</h3>
                         <p>Click the link below to reset your password:</p>
                         <a href="${resetLink}">${resetLink}</a>
                         <p>This link will expire in 15 minutes.</p>
                         `
                };
                transporter.sendMail(mailOptions,(error, info)=>{
                    if(error){
                        console.error(error);
                        return res.status(500).json({message: "Error sending email"});
                    }

                    res.json({message: "Reset Link sent to your gmail"});
                })
            });
        });

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ----------reset-password--------

app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        
        const query = `SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > NOW()`;

        db.query(query,[token], async (err,results)=>{
             if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database Error" });
            }
            if (results.length === 0) {
                return res.json({ message: "Invalid or expired token" });
            }

            const hashedPassword = await bcrypt.hash(password,10);

            const updateQuery = `UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?`;

            db.query(updateQuery,[hashedPassword,token],(err)=>{
                if(err){
                    console.error(err);
                    return res.status(500).json({message:"Error updating password"});
                }
                 res.json({ message: "Password updated successfully" });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// -------------verifying token =-------------

const verifyToken = (req,res,next)=>{
    const token = req.headers.authorization;

    if(!token) return res.status(401).json({message: "No token"});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch{
        res.status(401).json({message: "Inavlid Token"});
    }
};

const isAdmin = (req,res,next)=>{
    if(req.user.role !== "admin"){
        return res.status(403).json({message: "Access denied"});
    }
    next();
};

app.post("/api/events/create",verifyToken,isAdmin,(req,res)=>{

    const {title,description,event_date,location,departmentId}=req.body;

    const collegeId = req.user.collegeId;
    const createdBy = req.user.id;

    const sql = `
      INSERT INTO  EVENTS (title , description , event_date , location, collegeId, departmentId, created_by)
      VALUES(?,?,?,?,?,?,?)
      `;

      db.query(
        sql,
        [title,description,event_date,location,collegeId,departmentId || null, createdBy],
        (err, result)=>{
            if(err){
                 console.error(err);
            return res.status(500).json({ message: "Error creating event"});
            } 
            res.json({message: "Event created successfully"});
        }
      );
});



app.get("/api/events", (req, res) => {
  db.query("SELECT * FROM events", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/api/profile", verifyToken, (req, res) => {
  const { name, college, dept, mobile, bio, skills, goal, avatar } = req.body;
  const userId = req.user.id;

  const sql = `
    INSERT INTO user_profiles (user_id, name, college, dept, mobile, bio, skills, goal, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    name=?, college=?, dept=?, mobile=?, bio=?, skills=?, goal=?, avatar=?
  `;

  db.query(
    sql,
    [
      userId, name, college, dept, mobile, bio, skills, goal, avatar,
      name, college, dept, mobile, bio, skills, goal, avatar
    ],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Profile saved" });
    }
  );
});



app.get("/api/profile", verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM user_profiles WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0] || {});
    }
  );
});

app.get("/api/registrations", verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM registrations WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.post("/api/bookmark", verifyToken, (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  const check = "SELECT * FROM bookmarks WHERE user_id=? AND event_id=?";

  db.query(check, [userId, eventId], (err, result) => {
    if (result.length > 0) {
      return res.json({ message: "Already bookmarked" });
    }

    db.query(
      "INSERT INTO bookmarks (user_id, event_id) VALUES (?, ?)",
      [userId, eventId],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Bookmarked" });
      }
    );
  });
});

app.delete("/api/bookmark/:eventId", verifyToken, (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;

  db.query(
    "DELETE FROM bookmarks WHERE user_id=? AND event_id=?",
    [userId, eventId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Removed" });
    }
  );
});

app.get("/api/bookmarks", verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT event_id FROM bookmarks WHERE user_id=?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

app.get("/api/organizer/stats/:eventId", (req, res) => {
  const eventId = req.params.eventId;

  db.query(
    "SELECT COUNT(*) AS attendees FROM registrations WHERE event_id=? AND role='Participant'",
    [eventId],
    (err, result1) => {
      if (err) return res.status(500).json(err);

      const attendees = result1[0]?.attendees || 0;

      db.query(
        "SELECT COUNT(*) AS organizers FROM registrations WHERE event_id=? AND role='Organizer'",
        [eventId],
        (err, result2) => {
          if (err) return res.status(500).json(err);

          const organizers = result2[0]?.organizers || 0;

          res.json({
            attendeeCount: attendees,
            organizerCount: organizers,
            totalEngagement: attendees * 10,
            ticketSales: `₹${attendees * 200}`,
            engagementRate: `${Math.min(100, attendees * 5)}%`,
          });
        }
      );
    }
  );
});

app.get("/api/debug", (req, res) => {
  db.query("SHOW TABLES", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({
      message: "DB working",
      tables: result
    });
  });
});

