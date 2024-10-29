import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationCode,
  resendResetCode,
  validateResetToken,
  verifyOTP,
} from "../controllers/userControllers.js";
import isAuth from "../middlewares/Auth.js";
import { singleUpload, multipleUpload } from "../middlewares/Multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update")
  .post(isAuth, multipleUpload, updateProfile)
  .put(isAuth, updateProfile);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/resend-verification-code").post(resendVerificationCode);
router.route("/resend-reset-code").post(resendResetCode);
router.route("/validate-reset-token").post(validateResetToken);
router.route("/verify-otp").post(verifyOTP);

export default router;
