require('dotenv').config();
const { connectToDatabase } = require('./config/db');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;

connectToDatabase()
  .then(() => {
    // Seed sample products if empty (for dev/demo)
    if (process.env.SEED_PRODUCTS !== 'false') {
      try {
        const Product = require('./models/Product');
        Product.countDocuments().then(async (count) => {
          if (count === 0) {
            const seed = [
              { title: 'Nebula Lamp', description: 'Cosmic ambience in your room', price: 1999, imageUrl: 'https://picsum.photos/seed/nebula/600/400', category: 'home', stock: 50, isActive: true },
              { title: 'Aurora Mug', description: 'Color-shifting mug', price: 499, imageUrl: 'https://picsum.photos/seed/aurora/600/400', category: 'kitchen', stock: 120, isActive: true },
              { title: 'Quantum Backpack', description: 'Lightweight and durable', price: 2999, imageUrl: 'https://picsum.photos/seed/quantum/600/400', category: 'fashion', stock: 35, isActive: true },
              { title: 'Stellar Headphones', description: 'Immersive sound', price: 3999, imageUrl: 'https://picsum.photos/seed/stellar/600/400', category: 'electronics', stock: 25, isActive: true },
              { title: 'Lunar Notebook', description: 'Smooth pages for ideas', price: 299, imageUrl: 'https://picsum.photos/seed/lunar/600/400', category: 'stationery', stock: 200, isActive: true },
              { title: 'Comet Bottle', description: 'Keeps drinks cold', price: 799, imageUrl: 'https://picsum.photos/seed/comet/600/400', category: 'outdoors', stock: 80, isActive: true },
            ];
            await Product.insertMany(seed);
            console.log('🟣 Seeded sample products');
          }
        });
      } catch (e) {
        console.warn('Skipping product seed:', e?.message || e);
      }
    }
    app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
    process.exit(1);
  });

module.exports = app;
