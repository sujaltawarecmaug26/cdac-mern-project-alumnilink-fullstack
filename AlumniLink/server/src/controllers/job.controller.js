
import { query, pool } from "../config/db.js";
import { uploadService } from "../services/uploadService.js";

// Get job by ID
const jobById = async (id) => {
  const [job] = await query(
    `SELECT j.*, u.name AS alumniName, u.batch AS alumniBatch,
    u.verify_status AS alumniVerifyStatus, u.is_active AS alumniActive
    FROM jobs j
    JOIN users u ON u.id = j.alumni_id
    WHERE j.id = ?`,
    [id]
  );

  return job || null;
};

// Format job data
const shapeJob = async (job) => ({
  ...job,
  _id: job.id,
  createdAt: job.created_at,
  updatedAt: job.updated_at,
  skills: (
    await query("SELECT skill FROM job_skills WHERE job_id = ?", [job.id])
  ).map((item) => item.skill),
  alumniId: {
    id: job.alumni_id,
    name: job.alumniName,
    batch: job.alumniBatch,
    verifyStatus: job.alumniVerifyStatus,
  },
});

// Get all open jobs
export const list = async (req, res) => {
  try {
    if (
      req.user.role === "alumnus" &&
      req.user.verifyStatus !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message: "Alumni verification is required",
      });
    }

    const q = String(req.query.q || "").slice(0, 100);
    const loc = String(req.query.location || "").slice(0, 100);

    const rows = await query(
      `SELECT j.*, u.name AS alumniName, u.batch AS alumniBatch,
      u.verify_status AS alumniVerifyStatus, u.is_active AS alumniActive
      FROM jobs j
      JOIN users u ON u.id = j.alumni_id
      WHERE j.status = 'open'
      AND u.verify_status = 'approved'
      AND u.is_active = 1
      AND (? = '' OR CONCAT(j.title, ' ', j.company, ' ', j.description) LIKE ?)
      AND (? = '' OR j.location LIKE ?)
      ORDER BY j.created_at DESC
      LIMIT 100`,
      [q, `%${q}%`, loc, `%${loc}%`]
    );

    const jobs = await Promise.all(rows.map(shapeJob));

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// Get single job
export const getOne = async (req, res) => {
  try {
    const job = await jobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const owner = Number(job.alumni_id) === Number(req.user.id);

    if (
      (job.alumniVerifyStatus !== "approved" || !job.alumniActive) &&
      !owner &&
      req.user.role !== "admin"
    ) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      job.status !== "open" &&
      !owner &&
      req.user.role !== "admin"
    ) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    let application = null;

    if (req.user.role === "student") {
      const [result] = await query(
        "SELECT id, status FROM applications WHERE job_id = ? AND student_id = ?",
        [job.id, req.user.id]
      );

      application = result || null;
    }

    const [profile] = await query(
      "SELECT company, designation, linkedin, bio FROM alumni_profiles WHERE user_id = ?",
      [job.alumni_id]
    );

    return res.status(200).json({
      success: true,
      data: {
        job: await shapeJob(job),
        alumniProfile: profile || null,
        application,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job details",
    });
  }
};

// Get jobs posted by logged-in alumnus
export const mine = async (req, res) => {
  try {
    const rows = await query(
      `SELECT j.*,
      (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applicationCount
      FROM jobs j
      WHERE alumni_id = ?
      ORDER BY created_at DESC`,
      [req.user.id]
    );

    const jobs = await Promise.all(
      rows.map(async (job) => ({
        ...job,
        _id: job.id,
        createdAt: job.created_at,
        skills: (
          await query("SELECT skill FROM job_skills WHERE job_id = ?", [
            job.id,
          ])
        ).map((item) => item.skill),
      }))
    );

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your jobs",
    });
  }
};

// Create job
export const create = async (req, res) => {
  if (
    req.user.role !== "alumnus" ||
    req.user.verifyStatus !== "approved"
  ) {
    return res.status(403).json({
      success: false,
      message: "Only verified alumni can post jobs",
    });
  }

  const b = req.body;

  let conn;

  try {
    conn = await pool.getConnection();

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO jobs
      (alumni_id, company, title, description, location, experience,
      job_url, deadline, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open')`,
      [
        req.user.id,
        b.company,
        b.title,
        b.description,
        b.location,
        b.experience,
        b.jobUrl || "",
        b.deadline || null,
      ]
    );

    const id = result.insertId;

    for (const skill of b.skills || []) {
      await conn.execute(
        "INSERT INTO job_skills(job_id, skill) VALUES(?, ?)",
        [id, skill]
      );
    }

    await conn.commit();

    const job = await jobById(id);

    return res.status(201).json({
      success: true,
      data: job,
      message: "Job posted successfully",
    });
  } catch (error) {
    if (conn) {
      await conn.rollback();
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to post job",
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

// Update job
export const update = async (req, res) => {
  try {
    const job = await jobById(req.params.id);

    if (
      !job ||
      Number(job.alumni_id) !== Number(req.user.id)
    ) {
      return res.status(404).json({
        success: false,
        message: "Job not found or not owned",
      });
    }

    if (job.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Closed jobs cannot be edited",
      });
    }

    const b = { ...job, ...req.body };

    await query(
      `UPDATE jobs
      SET company = ?, title = ?, description = ?, location = ?,
      experience = ?, job_url = ?, deadline = ?
      WHERE id = ?`,
      [
        b.company,
        b.title,
        b.description,
        b.location,
        b.experience,
        b.jobUrl || "",
        b.deadline || null,
        job.id,
      ]
    );

    if (req.body.skills) {
      await query("DELETE FROM job_skills WHERE job_id = ?", [job.id]);

      for (const skill of req.body.skills) {
        await query(
          "INSERT INTO job_skills(job_id, skill) VALUES(?, ?)",
          [job.id, skill]
        );
      }
    }

    const updatedJob = await jobById(job.id);

    return res.status(200).json({
      success: true,
      data: updatedJob,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};

// Close job
export const close = async (req, res) => {
  try {
    const result = await query(
      "UPDATE jobs SET status = 'closed' WHERE id = ? AND alumni_id = ?",
      [req.params.id, req.user.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Job not found or not owned",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: Number(req.params.id),
        status: "closed",
      },
      message: "Job closed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to close job",
    });
  }
};

// Apply for job
export const apply = async (req, res) => {
  try {
    const [job] = await query(
      "SELECT id FROM jobs WHERE id = ? AND status = 'open'",
      [req.params.id]
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "This job is not available",
      });
    }

    const [profile] = await query(
      `SELECT resume_url AS resumeUrl,
      resume_public_id AS resumePublicId,
      resume_name AS resumeName
      FROM student_profiles WHERE user_id = ?`,
      [req.user.id]
    );

    if (!profile?.resumeUrl || !profile?.resumePublicId) {
      return res.status(400).json({
        success: false,
        message: "Upload your PDF resume before applying",
      });
    }

    const result = await query(
      `INSERT INTO applications
      (student_id, job_id, resume_url, resume_public_id, resume_name, note, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        req.user.id,
        job.id,
        profile.resumeUrl,
        profile.resumePublicId,
        profile.resumeName || "Resume.pdf",
        req.body.note || "",
      ]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        _id: result.insertId,
        status: "pending",
      },
      message: "Application submitted",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to apply for job",
    });
  }
};

// Get applications submitted by student
export const myApplications = async (req, res) => {
  try {
    const rows = await query(
      `SELECT a.*, j.id AS j_id, j.title AS j_title,
      j.company AS j_company, j.location AS j_location,
      j.status AS j_status, j.deadline AS j_deadline
      FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE a.student_id = ?
      ORDER BY a.created_at DESC`,
      [req.user.id]
    );

    const applications = rows.map((a) => ({
      _id: a.id,
      id: a.id,
      status: a.status,
      note: a.note,
      createdAt: a.created_at,
      reviewedAt: a.reviewed_at,
      jobId: {
        _id: a.j_id,
        title: a.j_title,
        company: a.j_company,
        location: a.j_location,
        status: a.j_status,
        deadline: a.j_deadline,
      },
    }));

    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// Get applications received by alumnus
export const inbox = async (req, res) => {
  try {
    if (req.user.verifyStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Alumni verification is required",
      });
    }

    const jobs = await query(
      "SELECT id, title, company FROM jobs WHERE alumni_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    let sql = `
      SELECT a.*, u.name AS studentName, u.email AS studentEmail,
      u.batch AS studentBatch, j.title AS jobTitle, j.company AS jobCompany
      FROM applications a
      JOIN users u ON u.id = a.student_id
      JOIN jobs j ON j.id = a.job_id
      WHERE j.alumni_id = ?
    `;

    const params = [req.user.id];

    if (req.query.jobId) {
      sql += " AND j.id = ?";
      params.push(req.query.jobId);
    }

    if (req.query.status) {
      sql += " AND a.status = ?";
      params.push(req.query.status);
    }

    sql += " ORDER BY a.created_at DESC";

    const rows = await query(sql, params);

    const applications = rows.map((a) => ({
      _id: a.id,
      id: a.id,
      status: a.status,
      note: a.note,
      createdAt: a.created_at,
      resumeName: a.resume_name,
      studentId: {
        _id: a.student_id,
        name: a.studentName,
        email: a.studentEmail,
        batch: a.studentBatch,
      },
      jobId: {
        _id: a.job_id,
        title: a.jobTitle,
        company: a.jobCompany,
      },
    }));

    return res.status(200).json({
      success: true,
      data: applications,
      meta: {
        jobs: jobs.map((job) => ({
          ...job,
          _id: job.id,
        })),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch application inbox",
    });
  }
};

// Approve or reject application
export const decide = async (req, res) => {
  try {
    if (req.user.verifyStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Alumni verification required",
      });
    }

    const [application] = await query(
      `SELECT a.id, a.status, j.alumni_id
      FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE a.id = ?`,
      [req.params.id]
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (Number(application.alumni_id) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You can only review applications for your own jobs",
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Application already reviewed",
      });
    }

    await query(
      `UPDATE applications
      SET status = ?, decision_note = ?, reviewed_at = NOW()
      WHERE id = ?`,
      [req.body.status, req.body.decisionNote || "", application.id]
    );

    const [updatedApplication] = await query(
      "SELECT * FROM applications WHERE id = ?",
      [application.id]
    );

    return res.status(200).json({
      success: true,
      data: updatedApplication,
      message: `Application ${req.body.status}`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

// View application resume
export const resume = async (req, res) => {
  try {
    const [application] = await query(
      `SELECT a.*, j.alumni_id
      FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE a.id = ?`,
      [req.params.id]
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      Number(application.student_id) !== Number(req.user.id) &&
      Number(application.alumni_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const file = await uploadService.readResume(
      application.resume_public_id
    );

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${String(application.resume_name || "resume.pdf").replace(/["\\r\\n]/g, "")}"`
    );

    return res.send(file);
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to view resume",
    });
  }
};

// Get alumni contact after application approval
export const contact = async (req, res) => {
  try {
    const [application] = await query(
      `SELECT a.student_id, a.status, j.alumni_id
      FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE a.id = ?`,
      [req.params.id]
    );

    if (
      !application ||
      Number(application.student_id) !== Number(req.user.id)
    ) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Contact details available only after approval",
      });
    }

    const [profile] = await query(
      `SELECT u.name, p.work_email AS email, p.contact_phone AS phone,
      p.linkedin, p.company, p.designation
      FROM alumni_profiles p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ?`,
      [application.alumni_id]
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Alumni contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch alumni contact",
    });
  }
};
