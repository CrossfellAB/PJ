const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// Get the connection string
const uri = process.env.MONGO_URI;
console.log('Using connection string:', uri.replace(/:[^:@]+@/, ':****@'));

// Create the MongoDB client with minimal options
const client = new MongoClient(uri);

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
    
    return false;
  } finally {
    await client.close();
  }
}

run().then(success => {
  process.exit(success ? 0 : 1);
});