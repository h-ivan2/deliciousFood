const Order = require("../models/order.model");
const MenuItem = require("../models/menuItem.model");
const Restaurant = require("../models/restaurant.model");

// @desc    Place order
// @route   POST /api/v1/orders
// @access  Private (customer)
exports.placeOrder = async (req, res, next) => {
  try {
    const {
      restaurant: restaurantId,
      items,
      orderType,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
    } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.status !== "approved") {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    if (!restaurant.isOpen) {
      return res
        .status(400)
        .json({ success: false, message: "Restaurant is closed" });
    }

    // Build items from DB prices — never trust client-sent prices
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res
          .status(400)
          .json({
            success: false,
            message: `Item ${item.menuItem} is unavailable`,
          });
      }
      const price = menuItem.discountedPrice || menuItem.price;
      const itemSub = price * item.quantity;
      subtotal += itemSub;
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price,
        quantity: item.quantity,
        subtotal: itemSub,
      });
    }

    const deliveryFee = orderType === "delivery" ? restaurant.deliveryFee : 0;
    const tax = subtotal * 0.1;
    const totalAmount = subtotal + deliveryFee + tax;

    const order = await Order.create({
      customer: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      orderType,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(`restaurant_${restaurantId}`).emit("new_order", order);
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my orders
// @route   GET /api/v1/orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("restaurant", "name logo")
      .sort("-createdAt");
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant", "name logo address phone owner")
      .populate("customer", "name email phone");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const isCustomer =
      order.customer._id.toString() === req.user._id.toString();
    const isOwner =
      order.restaurant.owner &&
      order.restaurant.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCustomer && !isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PATCH /api/v1/orders/:id/status
// @access  Private (owner, admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("restaurant");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const isOwner =
      order.restaurant.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    order.status = status;
    await order.save({ validateBeforeSave: false });

    const io = req.app.get("io");
    if (io) {
      io.to(`user_${order.customer}`).emit("order_status_update", {
        orderId: order._id,
        status: order.status,
        orderNumber: order.orderNumber,
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel order
// @route   PATCH /api/v1/orders/:id/cancel
// @access  Private (customer)
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order.customer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    if (!["pending", "confirmed"].includes(order.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel at this stage" });
    }

    order.status = "cancelled";
    order.cancelReason = req.body.reason;
    await order.save({ validateBeforeSave: false });

    const io = req.app.get("io");
    if (io) {
      io.to(`restaurant_${order.restaurant}`).emit("order_cancelled", {
        orderId: order._id,
        orderNumber: order.orderNumber,
        reason: order.cancelReason,
      });
    }

    res.status(200).json({ success: true, message: "Order cancelled" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get restaurant orders (owner dashboard)
// @route   GET /api/v1/orders/restaurant/:restaurantId
// @access  Private (owner)
exports.getRestaurantOrders = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    const { status } = req.query;
    const filter = { restaurant: req.params.restaurantId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("customer", "name phone")
      .sort("-createdAt");

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// @desc    Owner dashboard stats for a restaurant
// @route   GET /api/v1/orders/restaurant/:restaurantId/stats
// @access  Private (owner, admin)
exports.getRestaurantStats = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    const restId = restaurant._id;
    const [totalOrders, pendingOrders, revenueAgg, customers] = await Promise.all([
      Order.countDocuments({ restaurant: restId }),
      Order.countDocuments({ restaurant: restId, status: { $in: ["pending", "confirmed", "preparing"] } }),
      Order.aggregate([
        { $match: { restaurant: restId, status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.distinct("customer", { restaurant: restId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        totalRevenue: revenueAgg[0]?.total || 0,
        totalCustomers: customers.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Customers who ordered from a restaurant (aggregated)
// @route   GET /api/v1/orders/restaurant/:restaurantId/customers
// @access  Private (owner, admin)
exports.getRestaurantCustomers = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("customer", "name email phone")
      .sort("-createdAt");

    // Aggregate per-customer totals
    const map = new Map();
    orders.forEach((o) => {
      if (!o.customer) return;
      const id = o.customer._id.toString();
      const existing = map.get(id) || {
        _id: id,
        name: o.customer.name,
        email: o.customer.email,
        phone: o.customer.phone,
        totalOrders: 0,
        totalSpent: 0,
        lastOrder: o.createdAt,
      };
      existing.totalOrders += 1;
      existing.totalSpent += o.totalAmount || 0;
      if (o.createdAt > existing.lastOrder) existing.lastOrder = o.createdAt;
      map.set(id, existing);
    });

    const data = Array.from(map.values());
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};
