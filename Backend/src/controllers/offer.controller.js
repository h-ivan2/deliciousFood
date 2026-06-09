const Offer = require('../models/offer.model');
const Restaurant = require('../models/restaurant.model');

// @desc    Get all active offers (public - customer Offers page)
// @route   GET /api/v1/offers
// @access  Public
exports.getActiveOffers = async (req, res, next) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      $or: [{ validUntil: null }, { validUntil: { $gte: now } }],
      $and: [{ $or: [{ validFrom: null }, { validFrom: { $lte: now } }] }],
    })
      .populate('restaurant', 'name logo coverImage cuisine address rating')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: offers.length, data: offers });
  } catch (err) {
    next(err);
  }
};

// @desc    Get offers for one restaurant
// @route   GET /api/v1/offers/restaurant/:restaurantId
// @access  Public
exports.getRestaurantOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ restaurant: req.params.restaurantId })
      .sort('-createdAt');
    res.status(200).json({ success: true, count: offers.length, data: offers });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my offers (owner — across all their restaurants)
// @route   GET /api/v1/offers/my
// @access  Private (owner)
exports.getMyOffers = async (req, res, next) => {
  try {
    const myRestaurants = await Restaurant.find({ owner: req.user._id }).select('_id');
    const ids = myRestaurants.map((r) => r._id);

    const offers = await Offer.find({ restaurant: { $in: ids } })
      .populate('restaurant', 'name logo')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: offers.length, data: offers });
  } catch (err) {
    next(err);
  }
};

// @desc    Create an offer
// @route   POST /api/v1/offers
// @access  Private (owner)
exports.createOffer = async (req, res, next) => {
  try {
    const { restaurant: restaurantId } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: 'Restaurant not found' });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }

    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an offer
// @route   PUT /api/v1/offers/:id
// @access  Private (owner, admin)
exports.updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('restaurant', 'owner');
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    if (
      offer.restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }

    const updated = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete an offer
// @route   DELETE /api/v1/offers/:id
// @access  Private (owner, admin)
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('restaurant', 'owner');
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    if (
      offer.restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }

    await offer.deleteOne();
    res.status(200).json({ success: true, message: 'Offer deleted' });
  } catch (err) {
    next(err);
  }
};
