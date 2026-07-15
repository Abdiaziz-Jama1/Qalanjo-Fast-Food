const express = require('express');
const router = express.Router();
const { getFoods, getFeaturedFoods, getFood, createFood, updateFood, deleteFood, getAllFoods } = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

router.get('/featured', getFeaturedFoods);
router.get('/manage', protect, authorize('admin'), getAllFoods);
router.get('/', getFoods);
router.get('/:slug', getFood);
router.post('/', protect, authorize('admin'), createFood);
router.put('/:id', protect, authorize('admin'), updateFood);
router.delete('/:id', protect, authorize('admin'), deleteFood);

module.exports = router;
