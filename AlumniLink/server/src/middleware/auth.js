
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { pool } from "../config/db.js";

// Find user from database
const findUser = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, role, batch,
    verify_status AS verifyStatus,
    reject_reason AS rejectReason,
    is_active AS isActive,
    created_at AS createdAt
    FROM users
    WHERE id = ?
    LIMIT 1`,
    [id]
  );

  return rows[0] || null;
};

// Authenticate user using JWT
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    let payload;

    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await findUser(payload.sub);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    user._id = user.id;
    user.toSafeJSON = () => user;

    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
