import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getConnectionObject } from "../src/config.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function login(request, response) {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ error: "Email and password are required" });
    }

    const conn = await getConnectionObject();
    const [rows] = await conn.query(
      `SELECT user_id, name, email, password_hash, role, status FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (!rows || rows.length === 0) {
      return response.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash || "");
    if (!match) {
      return response.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return response.status(200).json({
      token,
      user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).json({ error: "Failed to login" });
  }
}

export function verifyTokenMiddleware(request, response, next) {
  try {
    const authHeader = request.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return response.status(401).json({ error: "Missing Authorization token" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    request.user = decoded;
    next();
  } catch (error) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
}

export function verify(request, response) {
  // Reaches here only if verifyTokenMiddleware passed
  return response.status(200).json({ valid: true, user: request.user });
}


