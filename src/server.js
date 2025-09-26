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

// Ensure DB connection before serving
connectToDatabase().catch((err) => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});

// Export Express app directly for Vercel
module.exports = app;

// Run locally (only when not serverless)
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 API listening locally at http://localhost:${PORT}`)
  );
}
