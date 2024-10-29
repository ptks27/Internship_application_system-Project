import mongoose from "mongoose";
import moment from "moment-timezone";
import mongooseSequence from "mongoose-sequence"; // Import the plugin
import { type } from "os";

const AutoIncrement = mongooseSequence(mongoose); // Initialize the auto-increment plugin

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      unique: true, // Ensuring the user_id is unique
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "agent"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, // URL to resume file
      resumeOriginalName: { type: String },
      company: { type: Number, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    notifications: [{
      type: Number,
      ref: 'Notification'
    }],
  },
  { timestamps: true }
);

// Apply the auto-increment plugin to the userSchema for the `user_id` field
userSchema.plugin(AutoIncrement, { inc_field: "user_id" });

// Method to convert timestamps to local timezone
userSchema.methods.toLocalTime = function () {
  return {
    createdAt: moment(this.createdAt).tz("Asia/Bangkok").format(),
    updatedAt: moment(this.updatedAt).tz("Asia/Bangkok").format(),
  };
};

export const User = mongoose.model("User", userSchema);
