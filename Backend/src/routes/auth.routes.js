const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registration, login, and profile
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: secret123
 *               role:
 *                 type: string
 *                 enum: [customer, owner]
 *                 example: customer
 *     responses:
 *       201:
 *         description: Account created, JWT returned
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
router.post('/register', authCtrl.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and receive a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful, JWT returned
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authCtrl.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Not authenticated
 */
router.get('/me', protect, authCtrl.getMe);
router.put('/me', protect, authCtrl.updateMe);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password/:token', authCtrl.resetPassword);
router.put('/update-password', protect, authCtrl.updatePassword);
router.get('/wallet', protect, authCtrl.getWallet);
router.post('/wallet/topup', protect, authCtrl.topUpWallet);

module.exports = router;