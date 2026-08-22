const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const crypto = require("crypto");

// ── Helper: sign a JWT and send it ──────────────────────────────────────────
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

  // Remove password from the response object
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: user,
  });
};

// ── POST /api/v1/auth/register ───────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, paymentMethod } = req.body;

    // Prevent anyone from self-registering as admin
    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "You cannot register as an admin",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const userData = { name, email, password, role };
    if (paymentMethod && paymentMethod.cardNumber) {
      const raw = paymentMethod.cardNumber.replace(/\s/g, '');
      userData.paymentMethod = {
        ...paymentMethod,
        cardNumber: '**** **** **** ' + raw.slice(-4),
      };
      userData.hasPaymentMethod = true;
    }

    const user = await User.create(userData);
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/auth/login ──────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Explicitly select password (it's select:false in the schema)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account deactivated",
      });
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/auth/me ──────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// Forgot password

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // Return 200 even if email doesn't exist to prevent email enumeration/discovery
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link was sent",
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`;
    res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetUrl,
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/v1/auth/me  (update own profile) ────────────────────────────────
exports.updateMe = async (req, res, next) => {
  try {
    // Whitelist the fields a user is allowed to change about themselves
    const allowed = ["name", "phone", "avatar", "paymentMethod"];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    // Set hasPaymentMethod flag when payment details are provided
    if (updates.paymentMethod && updates.paymentMethod.cardNumber) {
      // Mask card number — store only last 4 digits
      const raw = updates.paymentMethod.cardNumber.replace(/\s/g, '');
      updates.paymentMethod.cardNumber = '**** **** **** ' + raw.slice(-4);
      updates.hasPaymentMethod = true;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
