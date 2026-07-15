const Order = require('../models/Order');
const Food = require('../models/Food');

const ALLOWED_ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentDetails, notes } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    if (!['mobile_money', 'pay_at_door'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    let subtotal = 0;
    const verifiedItems = [];
    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food || !food.isAvailable) {
        return res.status(400).json({ message: `Item "${item.name}" is not available` });
      }
      const price = food.discountPrice > 0 ? food.discountPrice : food.price;
      const qty = Math.max(1, Math.min(100, parseInt(item.quantity) || 1));
      subtotal += price * qty;
      verifiedItems.push({ food: food._id, name: food.name, price, quantity: qty, image: food.images?.[0]?.url || '' });
    }

    const settings = (await require('../models/Settings').findOne()) || {};
    const deliveryFee = settings.deliveryFee || 3000;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      shippingAddress,
      paymentMethod,
      paymentDetails: paymentMethod === 'mobile_money' ? {
        provider: paymentDetails?.provider,
        status: 'pending',
      } : { status: 'pending' },
      subtotal,
      deliveryFee,
      total,
      notes,
    });
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    if (!ALLOWED_ORDER_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (error) {
    next(error);
  }
};
