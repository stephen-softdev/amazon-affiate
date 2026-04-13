const express = require('express');
const router = express.Router();
const { Analytics } = require('../models');

// Public route: Get visitor count
router.get('/', async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    res.json({ count: analytics ? analytics.visitorCount : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public route: Increment visitor count
router.post('/hit', async (req, res) => {
  try {
    const analytics = await Analytics.findOneAndUpdate(
      {},
      { $inc: { visitorCount: 1 } },
      { new: true, upsert: true }
    );
    res.json({ count: analytics.visitorCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
