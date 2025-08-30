const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // your MySQL username
  password: "root",      // your MySQL password
  database: "rural_app"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// Middleware: JWT Authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ================= AUTH ROUTES =================

// Register
app.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, phone],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ User registered successfully" });
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", { expiresIn: "1h" });
      res.json({ message: "✅ Login successful", token });
    } else {
      res.status(401).json({ message: "❌ Invalid credentials" });
    }
  });
});

// ================= USER ROUTES =================

// Profile
app.get("/profile", authenticateToken, (req, res) => {
  db.query("SELECT id, name, email, phone FROM users WHERE id = ?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

// ================= PRODUCT ROUTES =================

// Get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ================= BOOKINGS ROUTES =================

// Create booking
app.post("/bookings", authenticateToken, (req, res) => {
  const { product_id, quantity } = req.body;

  db.query(
    "INSERT INTO bookings (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [req.user.id, product_id, quantity],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Booking created successfully" });
    }
  );
});

// Get user bookings
app.get("/bookings", authenticateToken, (req, res) => {
  db.query("SELECT * FROM bookings WHERE user_id = ?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ================= SERVER START =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.get("/api/services", (req, res) => {
  db.query("SELECT * FROM services", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
// Create a booking
app.post("/api/bookings", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  db.query(
    "INSERT INTO bookings (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [user_id, product_id, quantity],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Booking created successfully", bookingId: result.insertId });
    }
  );
});

// Get all bookings for a user
app.get("/api/bookings/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT b.id, p.name AS product, b.quantity, b.created_at FROM bookings b JOIN products p ON b.product_id = p.id WHERE b.user_id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});
