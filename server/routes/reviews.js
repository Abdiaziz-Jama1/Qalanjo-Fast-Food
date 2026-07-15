const express = require('express');
const router = express.Router();
const { createReview, getFoodReviews, deleteReview, approveReview, getAllReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/food/:foodId', getFoodReviews);
router.get('/', protect, authorize('admin'), getAllReviews);
router.put('/:id/approve', protect, authorize('admin'), approveReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
