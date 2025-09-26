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

// Export Express app directly for Vercel
module.exports = app;

// Initialize database connection for Vercel
let dbConnected = false;

// Connect to database when the function is invoked
async function initializeDatabase() {
  if (!dbConnected) {
    try {
      await connectToDatabase();
      dbConnected = true;
      console.log('✅ Database connected successfully');
    } catch (err) {
      console.error('❌ Failed to connect to database:', err);
      // Don't exit process in serverless environment
      return false;
    }
  }
  return true;
}

// Middleware to ensure database connection
app.use(async (req, res, next) => {
  if (!dbConnected) {
    const connected = await initializeDatabase();
    if (!connected) {
      return res.status(500).json({ 
        error: 'Database connection failed',
        message: 'Unable to connect to the database'
      });
    }
  }
  next();
});

// Run locally (only when not serverless)
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 API listening locally at http://localhost:${PORT}`)
  );
}
