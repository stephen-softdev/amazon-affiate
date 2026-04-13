const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public route: Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    // Transform _id to id for the frontend
    const mappedProducts = products.map(p => ({
      id: p._id,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      productUrl: p.productUrl,
      createdAt: p.createdAt
    }));
    res.json(mappedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected route: Add a product
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, imageUrl, productUrl } = req.body;
  if (!title || !productUrl) {
    return res.status(400).json({ error: 'Title and product URL are required' });
  }

  try {
    const product = await Product.create({ title, description, imageUrl, productUrl });
    res.status(201).json({ 
      id: product._id, 
      title: product.title, 
      description: product.description, 
      imageUrl: product.imageUrl, 
      productUrl: product.productUrl 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected route: Delete a product
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
