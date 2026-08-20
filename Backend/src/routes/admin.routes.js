const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', ctrl.getAllUsers);
router.put('/users/:id', ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);
router.get('/restaurants/pending', ctrl.getPendingRestaurants);
router.patch('/restaurants/:id/approval', ctrl.approveRestaurant);
router.get('/restaurants', ctrl.getRestaurants);
router.get('/restaurants/:id', ctrl.getRestaurantById);
router.put('/restaurants/:id', ctrl.updateRestaurant);
router.delete('/restaurants/:id', ctrl.deleteRestaurant);
router.get('/orders', ctrl.getAllOrders);
router.get('/stats', ctrl.getPlatformStats);

module.exports = router;