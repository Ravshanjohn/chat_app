import express from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resendVerificationEmail,
  resetPassword,
  signup,
  updateProfile,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword); 
router.post("/reset-password/:token", resetPassword);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
