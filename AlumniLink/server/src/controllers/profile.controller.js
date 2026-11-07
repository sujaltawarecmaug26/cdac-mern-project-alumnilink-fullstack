
import { query } from "../config/db.js";
import { ROLES } from "../utils/constants.js";
import { uploadService } from "../services/uploadService.js";

// Get Own Profile
export const getMe = async (req, res) => {
  try {
    let rows;

    if (req.user.role === ROLES.STUDENT) {
      rows = await query(
        `SELECT id, headline, bio, skills, github, linkedin,
        resume_url AS resumeUrl, resume_name AS resumeName
        FROM student_profiles WHERE user_id = ?`,
        [req.user.id]
      );
    } else if (req.user.role === ROLES.ALUMNUS) {
      rows = await query(
        `SELECT id, company, designation,
        work_email AS workEmail,
        contact_phone AS contactPhone,
        linkedin, bio
        FROM alumni_profiles WHERE user_id = ?`,
        [req.user.id]
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "No profile for this role",
      });
    }

    const profile = rows[0] || null;

    if (profile && typeof profile.skills === "string") {
      profile.skills = JSON.parse(profile.skills);
    }

    return res.status(200).json({
      success: true,
      data: { profile },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};


// Update Student Profile
export const updateStudent = async (req, res) => {
  try {
    const b = req.body;

    const skills = [
      ...new Set((b.skills || []).map((s) => s.toLowerCase().trim())),
    ];

    await query(
      `INSERT INTO student_profiles
      (user_id, headline, bio, skills, github, linkedin)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      headline = VALUES(headline),
      bio = VALUES(bio),
      skills = VALUES(skills),
      github = VALUES(github),
      linkedin = VALUES(linkedin)`,
      [
        req.user.id,
        b.headline || "",
        b.bio || "",
        JSON.stringify(skills),
        b.github || "",
        b.linkedin || "",
      ]
    );

    const [profile] = await query(
      "SELECT * FROM student_profiles WHERE user_id = ?",
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      data: { profile },
      message: "Profile updated",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update student profile",
    });
  }
};


// Update Alumni Profile
export const updateAlumni = async (req, res) => {
  try {
    const b = req.body;

    await query(
      `UPDATE alumni_profiles
      SET company = ?, designation = ?, work_email = ?,
      contact_phone = ?, linkedin = ?, bio = ?
      WHERE user_id = ?`,
      [
        b.company,
        b.designation,
        b.workEmail || "",
        b.contactPhone || "",
        b.linkedin || "",
        b.bio || "",
        req.user.id,
      ]
    );

    const [profile] = await query(
      "SELECT * FROM alumni_profiles WHERE user_id = ?",
      [req.user.id]
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Alumni profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { profile },
      message: "Profile updated",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update alumni profile",
    });
  }
};


// Update the display name stored in the users table.
export const updateName = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ success: false, message: 'Name must be between 2 and 60 characters' });
    }
    await query('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id]);
    return res.status(200).json({ success: true, data: { name }, message: 'Name updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to update name' });
  }
};


// Upload Resume
export const uploadResume = async (req, res) => {
  try {
    const f = await uploadService.uploadResume(req.file, req.user.id);

    await query(
      `UPDATE student_profiles
      SET resume_url = ?, resume_public_id = ?, resume_name = ?
      WHERE user_id = ?`,
      [
        "/api/profile/resume/file",
        f.publicId,
        f.name,
        req.user.id,
      ]
    );

    return res.status(200).json({
      success: true,
      data: {
        resumeUrl: "/api/profile/resume/file",
        resumeName: f.name,
      },
      message: "Resume uploaded",
    });

  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to upload resume",
    });
  }
};


// View Own Resume
export const viewOwnResume = async (req, res) => {
  try {
    const [profile] = await query(
      `SELECT resume_public_id AS publicId,
      resume_name AS resumeName
      FROM student_profiles WHERE user_id = ?`,
      [req.user.id]
    );

    if (!profile?.publicId) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const buffer = await uploadService.readResume(profile.publicId);

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${String(profile.resumeName || "resume.pdf").replace(/["\\r\\n]/g, "")}"`
    );

    return res.send(buffer);

  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to view resume",
    });
  }
};
