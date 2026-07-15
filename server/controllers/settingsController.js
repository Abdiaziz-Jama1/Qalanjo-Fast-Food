const Settings = require('../models/Settings');

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        openingHours: [
          { day: 'Monday', open: '09:00', close: '22:00' },
          { day: 'Tuesday', open: '09:00', close: '22:00' },
          { day: 'Wednesday', open: '09:00', close: '22:00' },
          { day: 'Thursday', open: '09:00', close: '22:00' },
          { day: 'Friday', open: '09:00', close: '23:00' },
          { day: 'Saturday', open: '10:00', close: '23:00' },
          { day: 'Sunday', open: '10:00', close: '21:00' },
        ],
      });
    }
    res.json({ settings });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json({ settings });
  } catch (error) {
    next(error);
  }
};
