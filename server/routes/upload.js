const express = require('express');
const router = express.Router();
const { uploadImage, uploadMultiple, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('admin'), upload.single('image'), uploadImage);
router.post('/multiple', protect, authorize('admin'), upload.array('images', 5), uploadMultiple);
router.delete('/', protect, authorize('admin'), deleteImage);

module.exports = router;
