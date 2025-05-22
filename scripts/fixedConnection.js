const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// Get the connection string
const uri = process.env.MONGO_URI;
console.log('Using connection string:', uri.replace(/:[^:@]+@/, ':****@'));

// Create the MongoDB client with specific TLS settings
const client = new MongoClient(uri, {
  // TLS/SSL options
  tls: true,
  ssl: true,
  // Force IPv4
  family: 4,
  // Other options
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
});

async function run() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await client.connect();
    console.log('Connected to MongoDB Atlas successfully!');
    
    // List databases
    const dbList = await client.db().admin().listDatabases();
    console.log('Available databases:');
    dbList.databases.forEach(db => console.log(` - ${db.name}`));
    
    return true;
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:');
    console.error(`Error: ${err.message}`);
    console.error('Error code:', err.code);
    console.error('Error name:', err.name);
    
    if (err.message.includes('SSL') || err.message.includes('TLS')) {
      console.log('\nThis appears to be an SSL/TLS error. Possible solutions:');
      console.log('1. Check that your Node.js version supports the TLS version required by MongoDB Atlas');
      console.log('2. Try downgrading Node.js to an LTS version (v18 or v20)');
      console.log('3. Verify your network allows TLS connections to MongoDB Atlas');
      console.log('4. Try connecting from a different network');
    }
    
    return false;
  } finally {
    await client.close();
  }
}

run().then(success => {
  process.exit(success ? 0 : 1);
});