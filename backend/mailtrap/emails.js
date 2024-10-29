import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    // ใช้ Promise.race เพื่อกำหนดเวลาหมดเวลา
    const sendPromise = mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    const timeoutPromise = new Promise(
      (_, reject) =>
        setTimeout(() => reject(new Error("Send email timeout")), 10000) // 10 วินาที timeout
    );

    const response = await Promise.race([sendPromise, timeoutPromise]);
    console.log("Email queued for sending", response);
    return { success: true, message: "Email queued for sending" };
  } catch (error) {
    console.error("Error queueing verification email:", error);
    return { success: false, message: "Error queueing email" };
  }
};

export const sendWelcomeEmail = async (email, fullname) => {
  const recipient = [{ email }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome THE TRAINEE.",
      html: WELCOME_EMAIL_TEMPLATE.replace("{fullname}", fullname),
      category: "Welcome Email",
    });
    console.log("Welcome email sent successfully", res);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendResetPasswordEmail = async (email, resetOTP) => {
  const recipient = [{ email }];
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetOTP}", resetOTP),
      category: "Password Reset",
    });
    console.log("Reset password email sent successfully", res);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const sendResetPasswordSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset TEST",
    });
    console.log("Reset password success email sent successfully", res);
  } catch (error) {
    console.error("Error sending reset password success email:", error);
  }
};
