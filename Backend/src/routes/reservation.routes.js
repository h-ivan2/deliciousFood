const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reservation.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), ctrl.createReservation);
router.get('/my', protect, ctrl.getMyReservations);
router.patch('/:id/status', protect, authorize('owner', 'admin'), ctrl.updateReservationStatus);
router.patch('/:id/cancel', protect, authorize('customer'), ctrl.cancelReservation);

module.exports = router;