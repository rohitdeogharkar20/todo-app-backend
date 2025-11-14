require("dotenv").config();

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER,
  REDIS_PASSWORD,
  REDIS_TLS,
  REDIS_URL,
} = process.env;

const { Queue } = require("bullmq");
const { createClient } = require("redis");

const redis = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    tls: REDIS_TLS,
  },
  username: REDIS_USER,
  password: REDIS_PASSWORD,
});

let messageQueue;

const initializeQueue = () => {
  messageQueue = new Queue("messageQueue", {
    connection: redis,
  });

  global.log("Message queue initialize");
  return messageQueue;
};

const addQueue = async (data) => {
  if (!messageQueue) {
    throw new Error("Queue not initialized. Call initializeQueue() first.");
  }

  await messageQueue.add("messageJob", data);
};

module.exports = { initializeQueue, addQueue };
