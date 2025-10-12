// insertUsers.js
const { MongoClient } = require('mongodb');

// MongoDB connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'dev';
const collectionName = 'users';

// Helper function to generate random user data
function generateRandomUser() {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ivan', 'Jack'];
    const domains = ['example.com', 'mail.com', 'test.org', 'demo.net'];

    const name = names[Math.floor(Math.random() * names.length)];
    const email = `${name.toLowerCase()}${Math.floor(Math.random() * 1000)}@${domains[Math.floor(Math.random() * domains.length)]}`;
    
    return {
        name,
        email,
        createdAt: new Date(), // current timestamp
        updatedAt: new Date(), // current timestamp
        createdBy: 'system',  // assuming system creates these
        updatedBy: 'system'
    };
}

async function insertRandomUsers() {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Generate 100 random users
        const users = [];
        for (let i = 0; i < 100; i++) {
            users.push(generateRandomUser());
        }

        // Insert users
        const result = await collection.insertMany(users);
        console.log(`${result.insertedCount} users inserted successfully`);
    } catch (err) {
        console.error('Error inserting users:', err);
    } finally {
        await client.close();
    }
}

// Run the script
insertRandomUsers();
