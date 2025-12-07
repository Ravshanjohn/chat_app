import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationAttempts: {
      type: Number,
      default: 0,
    },
    lastVerificationEmailSentAt: {
      type: Date,
      default: null,
    },

    verificationAttemptsResetAt: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordAttempts: {
      type: Number,
      default: 0,
    },
    resetPasswordAttemptsResetAt: {
      type: Date,
      default: null,
    },
    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },
    lastResetPasswordEmailSentAt: {
      type: Date,
      default: null,
    },

    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
