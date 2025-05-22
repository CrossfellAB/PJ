const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;
console.log('Attempting to connect with URI:', uri);

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    
    // List databases to verify connection
    const databases = await client.db().admin().listDatabases();
    console.log('Available databases:');
    databases.databases.forEach(db => console.log(` - ${db.name}`));
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.close();
  }
}

run().catch(console.error);