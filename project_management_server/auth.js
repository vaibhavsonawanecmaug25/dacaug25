import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../src/config.js";
import { SECRET_KEY } from "../src/config.js";
import authMiddleware from "../middleware/middleware.js";

const router = express.Router();

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].role },
      SECRET_KEY,
      { expiresIn: "1h" } // token expires in 1 hour
    );

    res.json({
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong while logging in" });
  }
});

// ✅ SIGNUP ROUTE (optional if you already have one)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
      name,
      email,
      hashedPassword,
      role || "User",
    ]);

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ✅ VERIFY ROUTE (this is what your frontend calls)
router.get("/verify", authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default router;
