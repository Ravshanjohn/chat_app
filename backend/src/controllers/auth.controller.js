// @ts-nocheck
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../lib/cloudinary.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // **Create user first**
    const now = new Date();
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpiresAt: now.getTime() + 24 * 60 * 60 * 1000,
      verificationAttempts: 0, // Start at 0, will be incremented when email is sent
      lastVerificationEmailSentAt: null,
      verificationAttemptsResetAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });

    await newUser.save();

    // **Then send email in the background**
    sendVerificationEmail(email, verificationToken)
      .then(async (isSent) => {
        if (isSent) {
          console.log(`Verification email sent to ${email}`);
          // Update user with email sent status
          newUser.lastVerificationEmailSentAt = new Date();
          newUser.verificationAttempts = 1;
          await newUser.save();
        } else {
          console.error(`Failed to send verification email to ${email}`);
        }
      })
      .catch((error) => {
        console.error(`Error in background email sending: ${error.message}`);
      });

    // Respond immediately
    return res.status(201).json({
      success: true,
      message: "Verification email sent. Please verify your email.",
    });

  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  let count = 1;
  try {
    // Find user with valid code
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: new Date() } // not expired
    });
  

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }
    

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    await user.save();
    // Send welcome email
    await sendWelcomeEmail(user.email, user.fullName);

    // Respond with safe user info
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error("Error in verifyEmail:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error", count });
  }
};

export const resendVerificationEmail = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (user.isVerified) {
			return res.status(400).json({ success: false, message: "Email is already verified" });
		}

		const now = new Date();

		// Reset attempts if the reset period has passed
		if (user.verificationAttemptsResetAt && user.verificationAttemptsResetAt < now) {
			user.verificationAttempts = 0;
			user.verificationAttemptsResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
		}

		// Check for 1-minute gap
		if (user.lastVerificationEmailSentAt) {
			const timeDiff = now.getTime() - user.lastVerificationEmailSentAt.getTime();
			if (timeDiff < 60 * 1000) {
				// 1 minute
				return res.status(429).json({ success: false, message: "Please wait a minute before resending." });
			}
		}

		// Check for max 3 attempts per day
		if (user.verificationAttempts >= 3) {
			return res
				.status(429)
				.json({ success: false, message: "You have reached the maximum number of verification attempts for today. Try again after 24 hours." });
		};

		// Generate new token and send email
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
		const isSent = await sendVerificationEmail(email, verificationToken);

		if (!isSent) {
			return res.status(500).json({ success: false, message: "Error sending verification email" });
		}

		// Update user
		user.verificationToken = verificationToken;
		user.verificationTokenExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
		user.lastVerificationEmailSentAt = now;
		user.verificationAttempts += 1;

		await user.save();

		return res.status(200).json({ success: true, message: "Verification email sent successfully." });
	} catch (error) {
		console.error("Error in resendVerificationEmail:", error.message);
		return res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("-password -verificationToken -verificationTokenExpiresAt -isVerified -verificationAttempts -lastVerificationEmailSentAt -verificationAttemptsResetAt -resetPasswordToken -resetPasswordExpiresAt ");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    };

    const userWithPassword = await User.findOne({ email }).select("+password");
    const isPasswordCorrect = await bcrypt.compare(password, userWithPassword.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    };

    generateToken(user._id, res);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user:{
        ...user._doc
      }
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  };
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  };
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Always respond the same for privacy
    if (!user) {
      return res.status(200).json({ success: true, message: "If the email exists, a reset link will be sent." });
    }

    const now = new Date();

    // Reset 24h window if expired
    if (!user.resetPasswordAttemptsResetAt || user.resetPasswordAttemptsResetAt < now) {
      user.resetPasswordAttempts = 0;
      user.resetPasswordAttemptsResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    // 1-minute cooldown
    if (user.lastResetPasswordEmailSentAt) {
      const diffMs = now.getTime() - user.lastResetPasswordEmailSentAt.getTime();
      if (diffMs < 60 * 1000) {
        return res.status(429).json({ success: false, message: "Please wait 1 minute before trying again." });
      }
    }

    // Enforce max attempts 2 per 24h
    if (user.resetPasswordAttempts >= 2) {
      return res.status(429).json({
        success: false,
        message: "Too many reset attempts. Try again after 24 hours."
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    user.resetPasswordAttempts += 1; // increment attempts
    user.lastResetPasswordEmailSentAt = now;

    await user.save();

    // send email
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetURL);

    return res.status(200).json({
      success: true,
      message: "If the email exists, a reset link will be sent."
    });

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword} = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    });;

    // Check user and token validity
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    };
    
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    };

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    
    await user.save();

    // Send confirmation email
    await sendResetSuccessEmail(user.email);
    
    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword controller", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  };
};  

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ success: false, message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      resource_type: "auto",
      folder: "chat_app_profiles",
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("error in update profile:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    const user = req.user.toObject();

    const hiddenFields = [
      "password",
      "lastVerificationEmailSentAt",
      "verificationAttemptsResetAt",
      "verificationAttempts",
      "resetPasswordToken",
      "resetPasswordAttempts",
      "resetPasswordAttemptsResetAt",
      "resetPasswordExpiresAt",
      "verificationToken",
      "verificationTokenExpiresAt",
      "lastResetPasswordEmailSentAt",
      "__v",
      "createdAt",
      "updatedAt"
    ];

    hiddenFields.forEach(f => delete user[f]);

    return res.status(200).json(user);

  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  };
};
