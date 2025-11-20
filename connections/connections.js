require("dotenv").config();

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_REMOTE_CONNECTION,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER,
  REDIS_PASSWORD,
  REDIS_TLS,
  ENVIRONMENT,
} = process.env;

const { MongoClient } = require("mongodb");
const Redis = require("ioredis");

let client;
let redis;

if (ENVIRONMENT == "development") {
  client = new MongoClient(`mongodb://${MONGO_HOST}:${MONGO_PORT}`);

  redis = new Redis({ maxRetriesPerRequest: null });
} else {
  client = new MongoClient(MONGO_REMOTE_CONNECTION);

  redis = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
    username: REDIS_USER,
    password: REDIS_PASSWORD,
    tls: REDIS_TLS,
    maxRetriesPerRequest: null,
  });
}

module.exports = {
  client,
  redis,
};
