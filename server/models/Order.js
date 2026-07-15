const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: String,
    phone: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['mobile_money', 'pay_at_door'],
    required: true,
  },
  paymentDetails: {
    provider: { type: String, enum: ['airtel', 'mtn', null], default: null },
    transactionId: String,
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: String,
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
