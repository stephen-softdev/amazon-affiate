const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public route: Get all products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Protected route: Add a product
router.post('/', authenticateToken, (req, res) => {
  const { title, description, imageUrl, productUrl } = req.body;
  if (!title || !productUrl) {
    return res.status(400).json({ error: 'Title and product URL are required' });
  }

  const query = `INSERT INTO products (title, description, imageUrl, productUrl) VALUES (?, ?, ?, ?)`;
  db.run(query, [title, description, imageUrl, productUrl], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, title, description, imageUrl, productUrl });
  });
});

// Protected route: Delete a product
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', changes: this.changes });
  });
});

module.exports = router;
