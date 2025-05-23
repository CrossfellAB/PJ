const mongoose = require('mongoose');

// Database configuration with connection pooling and error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/patient_journey', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 15000, // Keep trying to send operations for 15 seconds (increased from 5)
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Force IPv4 to avoid SSL issues on Mac
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;