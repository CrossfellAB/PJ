# Setting Up MongoDB Atlas for Patient Journey Platform

Since you don't have MongoDB installed locally, we'll use MongoDB Atlas - a fully managed cloud database service. Here's how to set it up:

## 1. Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Click "Try Free" and sign up with your email

## 2. Create a Free Tier Cluster

1. Choose "M0 FREE" tier when prompted
2. Select your preferred cloud provider (AWS, GCP, or Azure)
3. Choose a region closest to you
4. Click "Create Cluster" (this may take a few minutes to provision)

## 3. Set Up Database Access

1. In the left sidebar, go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Create a username and password (make it secure but note it down)
4. Select "Password" authentication method
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## 4. Configure Network Access

1. In the left sidebar, go to "Security" → "Network Access"
2. Click "Add IP Address"
3. For development purposes, you can click "Allow Access from Anywhere" (not recommended for production)
4. Alternatively, add your specific IP address
5. Click "Confirm"

## 5. Get Your Connection String

1. In the left sidebar, go to "Databases"
2. Find your cluster and click "Connect"
3. Select "Connect your application"
4. Choose "Node.js" and the latest version
5. Copy the connection string provided

It will look like this:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. Replace `<username>` and `<password>` with the credentials you created

## 6. Update Your Project's .env File

1. Open the .env file in the project root
2. Update the MONGO_URI line with your connection string:

```
# Comment out the local connection
# MONGO_URI=mongodb://localhost:27017/patient_journey
# Use the Atlas connection
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/patient_journey?retryWrites=true&w=majority
```

## 7. Test Your Connection

Run the connection test script:

```
cd "/Users/matsfogelkvist/PJ Dev/PJ" && npm run check-db
```

If successful, you should see "MongoDB Connected Successfully!" in the output.

## 8. Seed the Database

After confirming the connection works, seed the database with initial data:

```
cd "/Users/matsfogelkvist/PJ Dev/PJ" && npm run seed
```

## 9. Start the Development Server

```
cd "/Users/matsfogelkvist/PJ Dev/PJ" && npm run dev
```

The API will be available at `http://localhost:5000`.