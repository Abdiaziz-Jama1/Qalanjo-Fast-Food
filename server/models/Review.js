const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: '',
  },
  images: [{
    url: String,
    public_id: String,
  }],
  isApproved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

reviewSchema.index({ food: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (foodId) {
  const stats = await this.aggregate([
    { $match: { food: foodId, isApproved: true } },
    { $group: { _id: '$food', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const Food = mongoose.model('Food');
  if (stats.length > 0) {
    await Food.findByIdAndUpdate(foodId, {
      ratings: { average: Math.round(stats[0].avgRating * 10) / 10, count: stats[0].count },
    });
  } else {
    await Food.findByIdAndUpdate(foodId, { ratings: { average: 0, count: 0 } });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRating(this.food);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) await doc.constructor.calcAverageRating(doc.food);
});

module.exports = mongoose.model('Review', reviewSchema);
