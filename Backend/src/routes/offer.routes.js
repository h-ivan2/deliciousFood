const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/offer.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', ctrl.getActiveOffers);
router.get('/my', protect, authorize('owner', 'admin'), ctrl.getMyOffers);
router.get('/restaurant/:restaurantId', ctrl.getRestaurantOffers);
router.post('/', protect, authorize('owner', 'admin'), ctrl.createOffer);
router.put('/:id', protect, authorize('owner', 'admin'), ctrl.updateOffer);
router.delete('/:id', protect, authorize('owner', 'admin'), ctrl.deleteOffer);

module.exports = router;