
import { query } from "../config/db.js";

// 1. List Alumni
export const listAlumni = async (req, res) => {
  try {
    const status =
      req.query.status && req.query.status !== "all"
        ? req.query.status
        : null;

    const rows = await query(
      `SELECT u.id, u.name, u.email, u.role, u.batch,
      u.verify_status AS verifyStatus,
      u.reject_reason AS rejectReason,
      u.is_active AS isActive,
      u.created_at AS createdAt,
      p.company, p.designation, p.linkedin,
      p.proof_note AS proofNote
      FROM users u
      LEFT JOIN alumni_profiles p ON p.user_id = u.id
      WHERE u.role = 'alumnus'
      ${status ? "AND u.verify_status = ?" : ""}
      ORDER BY u.created_at DESC`,
      status ? [status] : []
    );

    res.status(200).json({
      success: true,
      data: rows.map((u) => ({
        ...u,
        _id: u.id,
        profile: {
          company: u.company,
          designation: u.designation,
          linkedin: u.linkedin,
          proofNote: u.proofNote,
        },
      })),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alumni",
    });
  }
};


// 2. Verify Alumni
export const verifyAlumni = async (req, res) => {
  try {
    const { action, reason = "" } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be approve or reject",
      });
    }

    const result = await query(
      `UPDATE users
       SET verify_status = ?, reject_reason = ?
       WHERE id = ? AND role = 'alumnus'`,
      [
        action === "approve" ? "approved" : "rejected",
        action === "reject"
          ? reason || "Verification was not approved"
          : "",
        req.params.userId,
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    const [user] = await query(
      `SELECT id, name, email, role,
       verify_status AS verifyStatus,
       reject_reason AS rejectReason
       FROM users WHERE id = ?`,
      [req.params.userId]
    );

    res.status(200).json({
      success: true,
      message: `Alumni ${
        action === "approve" ? "approved" : "rejected"
      } successfully`,
      data: user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to verify alumni",
    });
  }
};


// 3. List Users
export const listUsers = async (req, res) => {
  try {
    const where = [];
    const params = [];

    if (req.query.role) {
      where.push("role = ?");
      params.push(req.query.role);
    }

    if (req.query.q) {
      where.push("(name LIKE ? OR email LIKE ?)");
      params.push(`%${req.query.q}%`, `%${req.query.q}%`);
    }

    const rows = await query(
      `SELECT id, name, email, role, batch,
       verify_status AS verifyStatus,
       is_active AS isActive,
       created_at AS createdAt
       FROM users
       ${where.length ? "WHERE " + where.join(" AND ") : ""}
       ORDER BY created_at DESC
       LIMIT 200`,
      params
    );

    res.status(200).json({
      success: true,
      data: rows.map((u) => ({
        ...u,
        _id: u.id,
      })),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
