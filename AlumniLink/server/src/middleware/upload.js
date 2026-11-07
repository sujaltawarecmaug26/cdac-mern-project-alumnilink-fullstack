
import multer from "multer";
import { LIMITS } from "../utils/constants.js";

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype !== "application/pdf") {
    const error = new Error("Only PDF resumes are allowed");
    error.statusCode = 400;

    return cb(error);
  }

  cb(null, true);
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: LIMITS.RESUME_MAX_BYTES,
  },
}).single("resume");
