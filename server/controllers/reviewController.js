const Review = require('../models/Review');

const ALLOWED_REVIEW_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

exports.createReview = async (req, res, next) => {
  try {
    const { food, rating, comment } = req.body;
    if (!food || !rating) {
      return res.status(400).json({ message: 'Food and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    const existing = await Review.findOne({ user: req.user._id, food });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }
    const review = await Review.create({ food, rating, comment: comment || '', user: req.user._id });
    res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
};

exports.getFoodReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ food: req.params.foodId, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (error) {
    next(error);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('food', 'name')
      .sort('-createdAt');
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
};
