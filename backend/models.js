const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: String,
  productUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const analyticsSchema = new mongoose.Schema({
  visitorCount: { type: Number, default: 0 }
});

const Admin = mongoose.model('Admin', adminSchema);
const Product = mongoose.model('Product', productSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = { Admin, Product, Analytics };
