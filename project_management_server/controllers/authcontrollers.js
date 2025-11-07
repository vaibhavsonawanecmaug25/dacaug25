// controllers/authcontrollers.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getConnectionObject } from "../src/config.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// -------- SIGNUP --------
export async function signup(req, res) {
  try {
    const conn = await getConnectionObject();
    const { name, email, password, confirmPassword, role } = req.body;

    console.log("📩 Signup received:", req.body); // 👈 add this line

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [exists] = await conn.query("SELECT user_id FROM users WHERE email = ?", [normalizedEmail]);
    if (exists.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await conn.query(
      "INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, 'Active')",
      [name, normalizedEmail, password_hash, role || "Developer"]
    );

    console.log("✅ User inserted:", result); // 👈 add this line

    res.status(201).json({ message: "Signup successful", user_id: result.insertId });
  } catch (err) {
    console.error("❌ Signup Error:", err); // 👈 important log
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
}


// -------- LOGIN --------
export async function login(req, res) {
  try {
    const conn = await getConnectionObject();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await conn.query("SELECT * FROM users WHERE email = ?", [normalizedEmail]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    if (!user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.status && user.status !== "Active") {
      return res.status(403).json({ error: "Account is not active. Contact administrator." });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Login failed", details: err.message });
  }
}

// -------- VERIFY token route --------
export async function verify(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access token required" });

    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ message: "Token valid", user: decoded });
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// -------- middleware to protect routes --------
export function verifyTokenMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
