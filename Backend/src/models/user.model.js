const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Recommended: prevents duplicate email registrations
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['customer', 'owner', 'admin'],
        default: 'customer',
    },
    phone: {
        type: String,
        trim: true,
    },
    avatar: {
        public_id: String,
        url:       String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    paymentMethod: {
        cardNumber: { type: String, trim: true },
        cardHolder: { type: String, trim: true },
        expiryDate: { type: String, trim: true },
        cardType: { type: String, enum: ['visa', 'mastercard', 'amex', ''], default: '' },
    },
    hasPaymentMethod: {
        type: Boolean,
        default: false,
    },
    walletBalance: {
        type: Number,
        default: 0,
        min: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

// ─── FIXED PRE-SAVE HOOK (Removed callback 'next' parameters) ───────
userSchema.pre('save', async function () {
    // If the password hasn't been modified, just exit the function early
    if (!this.isModified('password')) return;

    // Hash the modified password cleanly using async/await syntax
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);  
};

userSchema.methods.getSignedToken = function(){
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

userSchema.methods.getResetPasswordToken = function(){
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
