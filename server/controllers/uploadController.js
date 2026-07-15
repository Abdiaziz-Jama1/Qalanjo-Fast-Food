const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const images = req.files.map(f => ({ url: f.path, public_id: f.filename }));
    res.json({ images });
  } catch (error) {
    next(error);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ message: 'public_id is required' });
    }
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};
