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

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'Backend running', message: 'Welcome to ShopSphere API' });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serverless handler export
module.exports = async (req, res) => {
  try {
    if (!global.db) {
      global.db = await connectToDatabase();
    }
    app(req, res);
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
