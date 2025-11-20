require("dotenv").config();

const { MONGO_DATABASE, ENVIRONMENT } = process.env;

const { client } = require("../connections/connections");

let db;

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
