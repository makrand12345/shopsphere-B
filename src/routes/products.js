const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { q, category } = req.query;
  // Include documents where isActive is true OR missing (for backward-compatibility)
  const filter = { $or: [ { isActive: true }, { isActive: { $exists: false } } ] };
  if (category) filter.category = category;
  if (q) filter.title = { $regex: q, $options: 'i' };
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

router.post('/', auth(true), async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { title, price } = req.body || {};
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'title is required' });
    }
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: 'price must be a non-negative number' });
    }

    const created = await Product.create({ ...req.body, price: numericPrice });
    return res.status(201).json(created);
  } catch (err) {
    console.error('Create product failed:', err);
    return res.status(500).json({ message: 'Internal error creating product' });
  }
});

router.put('/:id', auth(true), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', auth(true), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
});

module.exports = router;


