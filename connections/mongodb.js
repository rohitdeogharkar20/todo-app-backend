require("dotenv").config();

const {
  MONGO_HOST = "localhost",
  MONGO_PORT = 27017,
  MONGO_DATABASE = "dev",
  MONGO_REMOTE_CONNECTION,
  ENVIRONMENT,
} = process.env;

const { MongoClient } = require("mongodb");
let db;
let client;

if (ENVIRONMENT == "development") {
  client = new MongoClient(`mongodb://${MONGO_HOST}:${MONGO_PORT}`);
} else {
  client = new MongoClient(MONGO_REMOTE_CONNECTION);
}

client.on("close", () => global.log("mongo connection closing"));

client.on("error", (err) => {
  global.log("Mongo start up error", err);
});

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(MONGO_DATABASE);
    global.log("mongo connected success", ENVIRONMENT);
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
