const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const Order = require("../models/order.model");

exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search)
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];

    const users = await User.find(filter).sort("-createdAt");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const allowed = ["name", "role", "isActive"];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete yourself" });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getPendingRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ status: "pending" })
      .populate("owner", "name email")
      .sort("-createdAt");
    res
      .status(200)
      .json({ success: true, count: restaurants.length, data: restaurants });
  } catch (err) {
    next(err);
  }
};

exports.approveRestaurant = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    if (!["approved", "rejected", "suspended"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true },
    ).populate("owner", "name email");

    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/restaurants?status=approved|pending|rejected|suspended
exports.getRestaurants = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const restaurants = await Restaurant.find(filter)
      .populate("owner", "name email")
      .sort("-createdAt");
    res
      .status(200)
      .json({ success: true, count: restaurants.length, data: restaurants });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/restaurants/:id
exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner",
      "name email",
    );
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/admin/restaurants/:id
exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).populate("owner", "name email");
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/admin/restaurants/:id
exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    res.status(200).json({ success: true, message: "Restaurant deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getPlatformStats = async (req, res, next) => {
  try {
    const [totalUsers, totalOwners, totalCustomers, totalRestaurants, totalOrders, revenue] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "owner" }),
        User.countDocuments({ role: "customer" }),
        Restaurant.countDocuments({ status: "approved" }),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { status: "delivered" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalCustomers,
        totalRestaurants,
        totalOrders,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
