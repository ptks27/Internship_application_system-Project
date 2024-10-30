import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    // Check if phone number exists
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({
        message: "User already exists with this phone number.",
        success: false,
      });
    }

    const file = req.file;

    const fileUri = getDataUri(file);

    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const userCount = await User.countDocuments();

    const newUser = await User.create({
      user_id: userCount + 1,
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      verificationToken,
      verificationExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
      isVerified: false,
    });

    await sendVerificationEmail(newUser.email, verificationToken);

    return res.status(201).json({
      message: "Account created successfully. Please verify your email.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationExpiresAt: { $gt: new Date() },
      isVerified: false,
    });

    if (!user) {
      // ตรวจสอบว่ามีผู้ใช้ที่มีโทเค็นนี้แต่หมดอายุแล้วหรือไม่
      const expiredUser = await User.findOne({ verificationToken: code });
      if (expiredUser) {
        // สร้างโทเค็นใหม่และส่งอีเมลใหม่
        const newVerificationToken = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        expiredUser.verificationToken = newVerificationToken;
        expiredUser.verificationExpiresAt = new Date(
          Date.now() + 10 * 60 * 1000
        ); // 10 นาทีจากตอนนี้
        await expiredUser.save();

        // ส่งอีเมลยืนยันใหม่
        await sendVerificationEmail(expiredUser.email, newVerificationToken);

        return res.status(400).json({
          message:
            "Verification code has expired. A new code has been sent to your email.",
          success: false,
        });
      }

      return res.status(400).json({
        message: "Invalid verification code",
        success: false,
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.fullname);

    return res.status(200).json({
      message: "Email verified successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    const resetToken = crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()
      .slice(0, 7);
    const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // ส่งอีเมลด้วย OTP แทนลิงก์
    try {
      await sendResetPasswordEmail(user.email, resetToken);
      return res.status(200).json({
        message: "Password reset OTP sent successfully.",
        success: true,
      });
    } catch (emailError) {
      console.error("Error sending reset password email:", emailError);
      return res.status(500).json({
        message: "Error sending reset password email. Please try again later.",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    // อัพเดทรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetPasswordSuccessEmail(user.email);

    return res.status(200).json({
      message: "Password reset successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "FILL_INFORMATION_COMPLETELY",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "INCORRECT_EMAIL_OR_PASSWORD",
        success: false,
      });
    }

    if (!user.isVerified) {
      // ส่งรหัสยืนยันใหม่
      const newVerificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      user.verificationToken = newVerificationToken;
      user.verificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      await sendVerificationEmail(user.email, newVerificationToken);

      return res.status(403).json({
        message: "VERIFY_EMAIL_BEFORE_LOGIN",
        success: false,
        requireVerification: true,
        email: user.email,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "INCORRECT_EMAIL_OR_PASSWORD",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "ACCOUNT_NOT_EXIST_WITH_ROLE",
        success: false,
      });
    }

    const tokenData = {
      userId: user.user_id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      userId: user.user_id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// User logout
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "loggedOutSuccess",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "errorLoggingOut",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.files?.file?.[0];
    const profilePhoto = req.files?.profilePhoto?.[0];

    let userId = Number(req.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
        success: false,
      });
    }

    let user = await User.findOne({ user_id: userId });

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    // Check if phone number is being changed and if it's already in use
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const existingPhone = await User.findOne({ phoneNumber });
      if (existingPhone) {
        return res.status(400).json({
          message: "This phone number is already in use.",
          success: false,
        });
      }
    }

    // Update fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      if (cloudResponse) {
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = file.originalname;
      }
    }

    if (profilePhoto) {
      const profilePhotoUri = getDataUri(profilePhoto);
      const cloudResponse = await cloudinary.uploader.upload(
        profilePhotoUri.content
      );
      if (cloudResponse) {
        user.profile.profilePhoto = cloudResponse.secure_url;
      }
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// เพิ่มฟังก์ชันใหม่สำหรับการส่งรหัสยืนยันอีกครั้ง
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: false });

    if (!user) {
      return res.status(400).json({
        message: "User not found or already verified.",
        success: false,
      });
    }

    const newVerificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.verificationToken = newVerificationToken;
    user.verificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    await sendVerificationEmail(user.email, newVerificationToken);

    return res.status(200).json({
      message: "New verification code sent successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const resendResetCode = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid reset token.",
        success: false,
      });
    }

    const newResetToken = crypto.randomBytes(20).toString("hex");
    const newResetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    user.resetPasswordToken = newResetToken;
    user.resetPasswordExpiresAt = newResetTokenExpiresAt;

    await user.save();

    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password?token=${newResetToken}`
    );

    return res.status(200).json({
      message: "New reset link sent successfully.",
      success: true,
      newToken: newResetToken,
      expiresAt: newResetTokenExpiresAt.getTime(), // Send expiration time as timestamp
    });
  } catch (error) {
    console.error("Error resending reset code:", error);
    return res.status(500).json({
      message: "Failed to resend reset link. Please try again later.",
      success: false,
    });
  }
};

export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid reset token.",
        valid: false,
      });
    }

    // Check if token is expired
    if (user.resetPasswordExpiresAt < new Date()) {
      return res.status(400).json({
        message: "Reset token has expired.",
        valid: false,
        expired: true,
      });
    }

    return res.status(200).json({
      message: "Valid reset token.",
      valid: true,
      expiresAt: user.resetPasswordExpiresAt.getTime(), // Send expiration time as timestamp
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      valid: false,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
