const MenuCategory = require("../models/menuCategory.model");
const MenuItem = require("../models/menuItem.model");
const Restaurant = require("../models/restaurant.model");

// ── Categories ────────────────────────────────────────────

exports.createCategory = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    const category = await MenuCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await MenuCategory.find({
      restaurant: req.params.restaurantId,
      isActive: true,
    }).sort("sortOrder");
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await MenuCategory.findById(req.params.id).populate(
      "restaurant",
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    if (category.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    const updated = await MenuCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await MenuCategory.findById(req.params.id).populate(
      "restaurant",
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    if (category.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    await MenuItem.deleteMany({ category: req.params.id });
    await category.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Category and its items deleted" });
  } catch (err) {
    next(err);
  }
};

// ── Items ─────────────────────────────────────────────────

exports.createItem = async (req, res, next) => {
  try {
    const category = await MenuCategory.findById(req.body.category).populate(
      "restaurant",
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    if (category.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    if (req.file) {
      req.body.image = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    req.body.restaurant = category.restaurant._id;
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    const { category, search, isVegetarian, minPrice, maxPrice, all } = req.query;
    const filter = { restaurant: req.params.restaurantId };
    // Customers only see available items; owners (all=true) see everything
    if (all !== "true") filter.isAvailable = true;

    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };
    if (isVegetarian === "true") filter.isVegetarian = true;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    const items = await MenuItem.find(filter)
      .populate("category", "name")
      .sort("name");
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("restaurant");
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    if (item.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    if (req.file) {
      req.body.image = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("restaurant");
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    if (item.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    await item.deleteOne();
    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (err) {
    next(err);
  }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("restaurant");
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    if (item.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    item.isAvailable = !item.isAvailable;
    await item.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, isAvailable: item.isAvailable });
  } catch (err) {
    next(err);
  }
};
