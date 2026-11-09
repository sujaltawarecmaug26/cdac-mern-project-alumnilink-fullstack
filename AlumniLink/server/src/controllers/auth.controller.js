
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { pool } from "../config/db.js";
import { ROLES, VERIFY_STATUS } from "../utils/constants.js";
import { mailService } from "../services/mailService.js";
import { isValidEmail, isValidPassword } from "../utils/validation.js";

// Safe user data
const safe = (u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    batch: u.batch,
    verifyStatus: u.verifyStatus,
    rejectReason: u.rejectReason,
    isActive: !!u.isActive,
    createdAt: u.createdAt
});

// Generate JWT token
const tokenFor = (u) =>
    jwt.sign(
        {
            sub: String(u.id),
            role: u.role,
            verifyStatus: u.verifyStatus
        },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    );


// 1. Register
export const register = async (req, res) => {
    let conn;

    try {
        const {
            name,
            email,
            password,
            role,
            batch,
            linkedin,
            company,
            designation,
            proofNote
        } = req.body;

        if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 60) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 60 characters"
            });
        }

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        if (!password || !isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters and one number"
            });
        }

        if (![ROLES.STUDENT, ROLES.ALUMNUS].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        if (!batch || !String(batch).trim()) {
            return res.status(400).json({
                success: false,
                message: "Batch is required"
            });
        }

        if (role === ROLES.ALUMNUS && (!company || !designation)) {
            return res.status(400).json({
                success: false,
                message: "Company and designation are required"
            });
        }

        const e = email.toLowerCase().trim();

        const [exists] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [e]
        );

        if (exists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const verifyStatus =
            role === ROLES.ALUMNUS
                ? VERIFY_STATUS.PENDING
                : VERIFY_STATUS.APPROVED;

        conn = await pool.getConnection();

        let id;

        try {
            await conn.beginTransaction();

            const [result] = await conn.execute(
                `INSERT INTO users
                (name, email, password_hash, role, batch, verify_status)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    name.trim(),
                    e,
                    await bcrypt.hash(password, 10),
                    role,
                    batch,
                    verifyStatus
                ]
            );

            id = result.insertId;

            if (role === ROLES.STUDENT) {
                await conn.execute(
                    "INSERT INTO student_profiles (user_id, linkedin) VALUES (?, ?)",
                    [id, linkedin || ""]
                );
            } else {
                await conn.execute(
                    `INSERT INTO alumni_profiles
                    (user_id, company, designation, linkedin, proof_note)
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        id,
                        company || "TBD",
                        designation || "TBD",
                        linkedin || "",
                        proofNote || ""
                    ]
                );
            }

            await conn.commit();

        } catch (error) {
            await conn.rollback();

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            throw error;

        } finally {
            conn.release();
            conn = null;
        }

        const [rows] = await pool.query(
            `SELECT
                id,
                name,
                email,
                role,
                batch,
                verify_status AS verifyStatus,
                reject_reason AS rejectReason,
                is_active AS isActive,
                created_at AS createdAt
             FROM users
             WHERE id = ?`,
            [id]
        );

        const user = rows[0];

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
            data: {
                user: safe(user),
                token: tokenFor(user)
            }
        });

    } catch (error) {
        if (conn) {
            conn.release();
        }

        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !isValidEmail(email) || !password) {
            return res.status(400).json({
                success: false,
                message: "Valid email and password are required"
            });
        }

        const [rows] = await pool.query(
            `SELECT
                id,
                name,
                email,
                role,
                batch,
                verify_status AS verifyStatus,
                reject_reason AS rejectReason,
                is_active AS isActive,
                created_at AS createdAt,
                password_hash AS passwordHash
             FROM users
             WHERE email = ?`,
            [email.toLowerCase().trim()]
        );

        const user = rows[0];

        if (
            !user ||
            !(await bcrypt.compare(password, user.passwordHash))
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is inactive"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                user: safe(user),
                token: tokenFor(user)
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};


// 3. Get Logged-in User
export const me = async (req, res) => {
    try {
        let profile = null;

        if (req.user.role === ROLES.STUDENT) {
            const [rows] = await pool.query(
                `SELECT
                    id,
                    headline,
                    bio,
                    skills,
                    github,
                    linkedin,
                    resume_url AS resumeUrl,
                    resume_name AS resumeName
                 FROM student_profiles
                 WHERE user_id = ?`,
                [req.user.id]
            );

            profile = rows[0] || null;

            if (profile && typeof profile.skills === "string") {
                profile.skills = JSON.parse(profile.skills);
            }

        } else if (req.user.role === ROLES.ALUMNUS) {
            const [rows] = await pool.query(
                `SELECT
                    id,
                    company,
                    designation,
                    work_email AS workEmail,
                    contact_phone AS contactPhone,
                    linkedin,
                    bio,
                    proof_note AS proofNote
                 FROM alumni_profiles
                 WHERE user_id = ?`,
                [req.user.id]
            );

            profile = rows[0] || null;
        }

        return res.status(200).json({
            success: true,
            data: {
                user: req.user.toSafeJSON(),
                profile
            }
        });

    } catch (error) {
        console.error("Get User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user details"
        });
    }
};


// 4. Change Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !isValidPassword(newPassword || "")) {
            return res.status(400).json({
                success: false,
                message: "Current password and a valid new password are required"
            });
        }

        const [rows] = await pool.query(
            "SELECT password_hash AS passwordHash FROM users WHERE id = ?",
            [req.user.id]
        );

        const user = rows[0];

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        await pool.query(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [
                await bcrypt.hash(newPassword, 10),
                req.user.id
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Password updated",
            data: null
        });

    } catch (error) {
        console.error("Change Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update password"
        });
    }
};


// 5. Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        const [rows] = await pool.query(
            "SELECT id, name, email FROM users WHERE email = ?",
            [email.toLowerCase().trim()]
        );

        const user = rows[0];

        if (user) {
            const token = crypto.randomBytes(32).toString("hex");

            const hash = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

            await pool.query(
                `UPDATE users
                 SET reset_token_hash = ?,
                     reset_token_expires = DATE_ADD(NOW(), INTERVAL 30 MINUTE)
                 WHERE id = ?`,
                [hash, user.id]
            );

            await mailService.passwordReset({
                user,
                resetUrl: `${env.clientUrl}/reset-password?token=${token}`
            });
        }

        return res.status(200).json({
            success: true,
            data: null,
            message: "If that email exists, a reset link was sent"
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process password reset request"
        });
    }
};


// 6. Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !isValidPassword(newPassword || "")) {
            return res.status(400).json({
                success: false,
                message: "Token and a valid new password are required"
            });
        }

        const hash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const [rows] = await pool.query(
            `SELECT id
             FROM users
             WHERE reset_token_hash = ?
             AND reset_token_expires > NOW()`,
            [hash]
        );

        const user = rows[0];

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        await pool.query(
            `UPDATE users
             SET password_hash = ?,
                 reset_token_hash = NULL,
                 reset_token_expires = NULL
             WHERE id = ?`,
            [
                await bcrypt.hash(newPassword, 10),
                user.id
            ]
        );

        return res.status(200).json({
            success: true,
            data: null,
            message: "Password reset successful"
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reset password"
        });
    }
};
