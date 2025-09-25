const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/checkout', auth(true), async (req, res) => {
  const { items } = req.body; // [{ productId, quantity }]
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Empty cart' });

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const orderItems = [];
  let total = 0;
  for (const { productId, quantity } of items) {
    const product = productMap.get(String(productId));
    if (!product) return res.status(400).json({ message: `Invalid product ${productId}` });
    if (product.stock < quantity) return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
    orderItems.push({ product: product._id, quantity, priceAtPurchase: product.price });
    total += product.price * quantity;
  }

  const order = await Order.create({ user: req.user.id, items: orderItems, total, status: 'paid' });

  // Reduce stock
  await Promise.all(
    orderItems.map((i) => Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.quantity } }))
  );

  res.status(201).json(order);
});

router.get('/', auth(true), async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: new mongoose.Types.ObjectId(req.user.id) };
    console.log('Orders filter:', filter, 'User role:', req.user.role);
    const orders = await Order.find(filter).populate('items.product').sort({ createdAt: -1 });
    console.log('Found orders:', orders.length);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/my', auth(true), async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);
    const orders = await Order.find({ user: new mongoose.Types.ObjectId(req.user.id) }).populate('items.product').sort({ createdAt: -1 });
    console.log('Found orders for user:', orders.length);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;


