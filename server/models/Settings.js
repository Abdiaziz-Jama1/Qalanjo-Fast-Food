const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'Qalanjo Fast Food' },
  tagline: { type: String, default: 'Fast food, served fresh' },
  logo: { url: String, public_id: String },
  banner: { url: String, public_id: String },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  openingHours: [{
    day: String,
    open: String,
    close: String,
    isClosed: { type: Boolean, default: false },
  }],
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  deliveryFee: { type: Number, default: 3000 },
  taxRate: { type: Number, default: 0.18 },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
