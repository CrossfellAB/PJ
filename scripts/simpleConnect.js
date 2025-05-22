const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// Modified connection string with explicit TLS options
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true, // Only for testing! Remove in production
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function run() {
  try {
    console.log('Attempting connection with SSL/TLS options...');
    await client.connect();
    console.log('Connected successfully!');
    
    const dbList = await client.db().admin().listDatabases();
    console.log('Databases:');
    dbList.databases.forEach(db => console.log(` - ${db.name}`));
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);