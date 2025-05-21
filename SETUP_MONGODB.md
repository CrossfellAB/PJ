# MongoDB Setup Guide

This document provides instructions on setting up MongoDB for the Patient Journey Enterprise Platform. There are multiple ways to set up MongoDB. Choose the option that works best for your environment.

## Option 1: Install MongoDB Directly on macOS

### Installing with Homebrew

1. Install Homebrew if you don't have it already:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install MongoDB:
   ```
   brew tap mongodb/brew
   brew install mongodb-community
   ```

3. Start MongoDB as a service:
   ```
   brew services start mongodb-community
   ```

4. Verify MongoDB is running:
   ```
   mongo
   ```
   You should see the MongoDB shell prompt.

### Installing MongoDB Community Edition Manually

1. Download the MongoDB Community Server .tgz file from the [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Extract the files to your preferred location
3. Create data directory:
   ```
   sudo mkdir -p /data/db
   sudo chown -R `id -un` /data/db
   ```
4. Add MongoDB binaries to your PATH
5. Start MongoDB:
   ```
   mongod
   ```

## Option 2: Using Docker (Recommended)

If you have Docker and Docker Compose installed, you can use the provided docker-compose.yml file:

1. Install Docker Desktop for Mac from [Docker's website](https://www.docker.com/products/docker-desktop)

2. Start MongoDB using Docker Compose:
   ```
   cd /Users/matsfogelkvist/PJ\ Dev/PJ
   docker-compose up -d
   ```

3. Verify MongoDB is running:
   ```
   docker ps
   ```
   You should see the MongoDB container running.

## Option 3: MongoDB Atlas (Cloud-hosted)

You can also use MongoDB Atlas, a fully managed cloud database:

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (the free tier is sufficient for development)
3. Set up database access (username and password)
4. Configure network access (whitelist your IP or allow access from anywhere for development)
5. Get your connection string
6. Update your .env file with the connection string:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/patient_journey
   ```

## Verifying Your Connection

After setting up MongoDB, you can verify the connection by running the seed script:

```
npm run seed
```

If successful, you should see "Database seeded successfully!" in the console output.