// make a function (Logic)
const userModel = require('../models/userModel')
const logActivity = require("../middleware/activity");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path')
const fs = require('fs')

// 1. Creating user function
const createUser = async (req, res) => {
  const { fullName, phone, email, password } = req.body;

  if (!fullName || !phone || !email || !password) {
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  try {
    const otp = await generateOtp();

    let user = await userModel.findOne({ email });

    if (user) {
      // User already exists - resend OTP
      user.otp = otp;
      await user.save();

      await sendOtpEmail(email, otp);

      // ✅ log activity (existing user - resend OTP)
      await logActivity({
        req,
        userId: user._id,
        action: "RESEND_OTP_EXISTING_USER",
        details: { email: user.email },
      });

      return res.json({
        success: true,
        message: "User already exists. New OTP sent to email.",
      });
    }

    // New user creation
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new userModel({
      fullName,
      phone,
      email,
      password: hashedPassword,
      otp,
    });

    await user.save();
    await sendOtpEmail(email, otp);

    // ✅ log activity (new user)
    await logActivity({
      req,
      userId: user._id,
      action: "USER_REGISTER",
      details: {
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
      },
    });

    return res.json({
      success: true,
      message: "User created successfully. OTP sent to email.",
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if account is locked
    if (user.isLocked && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000); // in minutes

      // 🔒 Log locked account login attempt
      await logActivity({
        req,
        userId: user._id,
        action: "LOGIN_ATTEMPT_WHILE_LOCKED",
        details: { email: user.email, lockUntil: user.lockUntil },
      });

      return res.status(403).json({
        success: false,
        message: `Account locked. Try again in ${remainingTime} minute(s).`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedLoginAttempts += 1;

      // 🔐 Account lock after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();

        // 🔒 Log account lock
        await logActivity({
          req,
          userId: user._id,
          action: "ACCOUNT_LOCKED",
          details: { email: user.email, reason: "Too many failed attempts" },
        });

        return res.status(403).json({
          success: false,
          message: "Account locked due to 5 failed login attempts. Try again in 15 minutes.",
        });
      }

      const remainingAttempts = 5 - user.failedLoginAttempts;
      await user.save();

      // ❌ Log failed login
      await logActivity({
        req,
        userId: user._id,
        action: "FAILED_LOGIN",
        details: { email: user.email, remainingAttempts },
      });

      return res.status(401).json({
        success: false,
        message: `Invalid credentials. ${remainingAttempts} attempt(s) left.`,
      });
    }

    // ✅ Reset on success
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Log successful login
    await logActivity({
      req,
      userId: user._id,
      action: "LOGIN_SUCCESS",
      details: { email: user.email },
    });

    return res.status(200).json({
      success: true,
      token,
      userData: user,
      message: "Login successful",
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};






const getUser = async (req, res) => {
    const user = req.user;
    const existedUser = await userModel.findById(user.id)

    if (!existedUser) {
        return res.status(400).json({
            success: false,
            message: 'User was not found.'
        })
    }
    return res.status(201).json({
        success: true,
        message: 'User details has been fetched.',
        user: existedUser
    })
}

const updateUser = async (req, res) => {
    console.log('User ID from token:', req.user?.id);
    console.log('Raw request body:', req.body);

    try {
        // your existing image upload and cleanup logic...

        const updateParams = { ...req.body };
        delete updateParams.password;
        delete updateParams.email;

        const finalUpdateParams = removeNullUndefinedWithReduce(updateParams);
        console.log('Final update parameters:', finalUpdateParams);

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: req.user.id },
            finalUpdateParams,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'User has been updated.',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        return res.status(400).json({
            success: false,
            message: 'Bad Request',
            error: error.message,
        });
    }
};


const changePassword = async (req, res) => {
    const user = req.user;
    const { oldPassword, newPassword } = req.body
    try {
        // Find the user by ID
        const existedUser = await userModel.findById(user.id);
        if (!existedUser) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist.'
            })
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, existedUser.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect Old Password!'
            })
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        existedUser.password = hashedPassword;
        await existedUser.save();

        return res.status(201).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        })
    };
}



function removeNullUndefinedWithReduce(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
            acc[key] = typeof value === 'object' ? removeNullUndefinedWithReduce(value) : value;
        }
        return acc;
    }, {});
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(201).json({
            success: true,
            users: users,
            message: 'Users has been fetched.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        })

    }
}

const deleteUser = async (req, res) => {
    const existingUser = await userModel.findById(req.params.id)
    if (!existingUser) {
        return res.status(404).json({
            success: false,
            message: 'User does not exist.'
        })
    }

    const oldImagePath = path.join(__dirname, `../public/users/${existingUser.imageUrl}`)

    if (fs.existsSync(oldImagePath)) {
        // delete from file system
        fs.unlinkSync(oldImagePath)
    }

    try {
        await userModel.findOneAndDelete({ _id: req.params.id })
        return res.status(201).json({
            success: true,
            message: "User has been deleted."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}


const sendOtpEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or another SMTP provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Your App Name" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Your OTP Code',
        html: `<p>Hello,</p><p>Your OTP is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP Email sent');
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        throw error;
    }
};

const generateOtp = async (length = 6) => {
    const characters = '0123456789'; // OTP will only contain numbers
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }

    return otp;
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required."
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        // Optional: Clear OTP after successful verification
        user.otp = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully."
        });

    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Step 1: Request Password Reset (Send OTP)
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const otp = await generateOtp();
        user.otp = otp;
        await user.save();

        await sendOtpEmail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent to email for password reset."
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Step 2: Reset Password using OTP
const resetPasswordWithOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Email, OTP and new password are required." });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        // Check if newPassword is same as current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be the same as the current password."
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password and clear OTP
        user.password = hashedPassword;
        user.otp = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// exporting 
module.exports = {
    createUser,
    loginUser,
    getUser,
    updateUser,
    changePassword,
    getUsers,
    deleteUser,
    verifyOtp,
    forgotPassword,
    resetPasswordWithOtp,
}

