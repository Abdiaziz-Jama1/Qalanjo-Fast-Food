const Food = require('../models/Food');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getFoods = async (req, res, next) => {
  try {
    const { category, search, featured, page = 1, limit = 12 } = req.query;
    const query = { isAvailable: true };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }
    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { tags: { $regex: safe, $options: 'i' } },
      ];
    }
    if (featured === 'true') query.isFeatured = true;

    const total = await Food.countDocuments(query);
    const foods = await Food.find(query)
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ foods, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedFoods = async (req, res, next) => {
  try {
    const foods = await Food.find({ isFeatured: true, isAvailable: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort('-createdAt');
    res.json({ foods });
  } catch (error) {
    next(error);
  }
};

exports.getFood = async (req, res, next) => {
  try {
    const food = await Food.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ food });
  } catch (error) {
    next(error);
  }
};

exports.createFood = async (req, res, next) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ food });
  } catch (error) {
    next(error);
  }
};

exports.updateFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ food });
  } catch (error) {
    next(error);
  }
};

exports.deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.images?.length) {
      for (const img of food.images) {
        if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
      }
    }
    res.json({ message: 'Food deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getAllFoods = async (req, res, next) => {
  try {
    const foods = await Food.find().populate('category', 'name slug').sort('-createdAt');
    res.json({ foods });
  } catch (error) {
    next(error);
  }
};
