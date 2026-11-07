
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Project root/uploads/resumes
const uploadsDir = path.resolve(__dirname, "../../uploads/resumes");

// Create custom error with status code
function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/** Validate PDF magic bytes */
function assertPdfBuffer(buffer) {
  if (!buffer || buffer.slice(0, 4).toString("utf8") !== "%PDF") {
    throw createError(400, "File is not a valid PDF");
  }
}

export const uploadService = {
  async uploadResume(file, userId) {
    if (!file) {
      throw createError(400, "Resume file is required");
    }

    assertPdfBuffer(file.buffer);

    // Create directory if it doesn't exist
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const filename = `resume_${userId}_${Date.now()}.pdf`;

    const filepath = path.join(uploadsDir, filename);

    // Save PDF locally
    await fs.writeFile(filepath, file.buffer);

    return {
      url: "/api/profile/resume/file",
      publicId: filename,
      name: file.originalname,
    };
  },

  async readResume(publicId) {
    if (!publicId) {
      throw createError(404, "Resume not found");
    }

    // Prevent directory traversal
    const safeName = path.basename(publicId);

    try {
      return await fs.readFile(path.join(uploadsDir, safeName));
    } catch (error) {
      if (error.code === "ENOENT") {
        throw createError(404, "Resume file is no longer available");
      }

      throw error;
    }
  },
};
