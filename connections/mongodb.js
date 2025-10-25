require("dotenv").config();

const {
  MONGO_HOST = "localhost",
  MONGO_PORT = 27017,
  MONGO_DATABASE = "dev",
  MONGO_CONNECTION
} = process.env;

const { MongoClient } = require("mongodb");
let db;

// const client = new MongoClient(`mongodb://${MONGO_HOST}:${MONGO_PORT}`);
const client = new MongoClient(MONGO_CONNECTION);

client.on("close", () => [console.log("mongo connection closing")]);

client.on("error", (err) => {
  console.log("mongo error occured ", err);
});

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(MONGO_DATABASE);
    console.log("mongo connected success");
  }
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized! Call connectDB() first.");
  }
  return db;
}

module.exports = { connectDB, getDB, client };
