require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/business-plans', require('./routes/businessPlans'));
app.use('/api/bookkeeping', require('./routes/bookkeeping'));
app.use('/api/evaluations', require('./routes/evaluations'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const startServer = async () => {
  try {
    // Sync database models
    await sequelize.sync();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('Starting server without database connection in development mode...');
  } finally {
    // Start listening regardless of database connection in development
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
};

startServer();