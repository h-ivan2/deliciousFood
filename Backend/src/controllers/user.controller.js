const User = require('../models/user.model');

// ── GET /api/v1/users  (admin only) ─────────────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/users/:id ────────────────────────────────────────────────────
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/v1/users/:id  (admin only) ──────────────────────────────────────
exports.updateUser = async (req, res, next) => {
  try {
    // Don't allow password changes through this route
    const { password, ...safeFields } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      safeFields,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/v1/users/:id  (admin only) ───────────────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};