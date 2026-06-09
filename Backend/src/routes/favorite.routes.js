const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/favorite.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, ctrl.getMyFavorites);
router.post('/:restaurantId', protect, ctrl.addFavorite);
router.delete('/:restaurantId', protect, ctrl.removeFavorite);

module.exports = router;