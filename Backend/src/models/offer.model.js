const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
    uppercase: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: 0,
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  image: {
    public_id: String,
    url: String,
  },
  validFrom: {
    type: Date,
    default: Date.now,
  },
  validUntil: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

offerSchema.virtual('isValid').get(function () {
  const now = new Date();
  if (!this.isActive) return false;
  if (this.validFrom && now < this.validFrom) return false;
  if (this.validUntil && now > this.validUntil) return false;
  return true;
});

offerSchema.set('toJSON', { virtuals: true });
offerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Offer', offerSchema);