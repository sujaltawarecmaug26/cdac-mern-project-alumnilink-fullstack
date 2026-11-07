
import { query } from "../config/db.js";

export const featured = async (req, res) => {
  try {
    const rows = await query(
      `SELECT u.id, u.name, u.batch,
       p.company, p.designation
       FROM users u
       JOIN alumni_profiles p ON p.user_id = u.id
       WHERE u.role = 'alumnus'
       AND u.verify_status = 'approved'
       AND u.is_active = 1
       ORDER BY u.created_at DESC
       LIMIT 6`
    );

    res.status(200).json({
      success: true,
      data: rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch featured alumni",
    });
  }
};
