const Favorite = require('../models/favorite.model');
const Restaurant = require('../models/restaurant.model');



exports.getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('restaurant')
      .sort('-createdAt');

    // Filter out favorites whose restaurant was deleted
    const data = favorites
      .filter((f) => f.restaurant)
      .map((f) => ({
        _id: f._id,
        restaurant: f.restaurant,
        createdAt: f.createdAt,
      }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a restaurant to favorites
// @route   POST /api/v1/favorites/:restaurantId
// @access  Private (customer)
exports.addFavorite = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: 'Restaurant not found' });
    }

    const existing = await Favorite.findOne({
      user: req.user._id,
      restaurant: restaurantId,
    });
    if (existing) {
      return res
        .status(200)
        .json({ success: true, message: 'Already in favorites', data: existing });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      restaurant: restaurantId,
    });

    res.status(201).json({ success: true, data: favorite });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove a restaurant from favorites
// @route   DELETE /api/v1/favorites/:restaurantId
// @access  Private (customer)
exports.removeFavorite = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      restaurant: restaurantId,
    });

    if (!favorite) {
      return res
        .status(404)
        .json({ success: false, message: 'Favorite not found' });
    }

    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (err) {
    next(err);
  }
};