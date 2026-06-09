const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), ctrl.placeOrder);
router.get('/', protect, ctrl.getMyOrders);
router.get('/restaurant/:restaurantId', protect, authorize('owner', 'admin'), ctrl.getRestaurantOrders);
router.get('/restaurant/:restaurantId/stats', protect, authorize('owner', 'admin'), ctrl.getRestaurantStats);
router.get('/restaurant/:restaurantId/customers', protect, authorize('owner', 'admin'), ctrl.getRestaurantCustomers);
router.get('/:id', protect, ctrl.getOrder);
router.patch('/:id/status', protect, authorize('owner', 'admin'), ctrl.updateStatus);
router.patch('/:id/cancel', protect, authorize('customer'), ctrl.cancelOrder);

module.exports = router;