const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Patient Journey Enterprise API' });
});

// API Routes
app.use('/api/journeys', require('./routes/journeyRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
// These routes will be implemented next:
// app.use('/api/therapeutic-areas', require('./routes/therapeuticAreaRoutes'));
// app.use('/api/regions', require('./routes/regionRoutes'));
// app.use('/api/barriers', require('./routes/barrierRoutes'));
// app.use('/api/interventions', require('./routes/interventionRoutes'));
// app.use('/api/scenarios', require('./routes/scenarioRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app; // For testing purposes