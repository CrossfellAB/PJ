const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const checkConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string: ${process.env.MONGO_URI}`);
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected Successfully!`);
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Database Name: ${mongoose.connection.name}`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed.');
    
    return true;
  } catch (error) {
    console.error('MongoDB Connection Error:');
    console.error(error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\nTroubleshooting Tips:');
      console.log('1. Make sure MongoDB is installed and running');
      console.log('2. If using Docker, ensure the container is up with: docker-compose up -d');
      console.log('3. If using MongoDB Atlas, check your network connection and whitelist your IP');
      console.log('4. Verify the MONGO_URI in your .env file is correct');
    }
    
    return false;
  }
};

// Run the check
checkConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  });