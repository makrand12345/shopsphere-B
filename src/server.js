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

// Connect to DB once before handling requests
connectToDatabase()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => {
    console.error('❌ Failed to connect to database', err);
    process.exit(1);
  });

// ✅ Export app for Vercel (serverless)
module.exports = app;

// ✅ Run normally when executed locally
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));
}
