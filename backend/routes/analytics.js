const express = require('express');
const router = express.Router();
const db = require('../db');

// Public route: Get visitor count
router.get('/', (req, res) => {
  db.get('SELECT visitorCount FROM analytics WHERE id = 1', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ count: row ? row.visitorCount : 0 });
  });
});

// Public route: Increment visitor count
router.post('/hit', (req, res) => {
  db.run('UPDATE analytics SET visitorCount = visitorCount + 1 WHERE id = 1', function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.get('SELECT visitorCount FROM analytics WHERE id = 1', [], (err, row) => {
      res.json({ count: row ? row.visitorCount : 0 });
    });
  });
});

module.exports = router;
