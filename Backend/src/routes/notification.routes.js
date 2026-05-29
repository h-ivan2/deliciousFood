const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, ctrl.getNotifications);
router.patch('/read-all', protect, ctrl.markAllRead);
router.patch('/:id/read', protect, ctrl.markOneRead);

module.exports = router;