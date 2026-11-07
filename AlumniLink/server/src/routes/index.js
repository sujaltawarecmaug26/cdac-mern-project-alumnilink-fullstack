import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import jobRoutes from "./job.routes.js";
import applicationRoutes from "./application.routes.js";
import adminRoutes from "./admin.routes.js";
import * as alumni from "../controllers/alumni.controller.js";

const router = Router();


router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      status: "ok",
    },
  });
});


router.get("/alumni/featured", alumni.featured);

// Other routes
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/admin", adminRoutes);

export default router;
