require("dotenv").config();

const { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD, REDIS_TLS } =
  process.env;

const { Queue } = require("bullmq");

let messageQueue;

const initializeQueue = () => {
  messageQueue = new Queue("messageQueue", {
    connection: {
      username: REDIS_USER, // the user you created
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        tls: REDIS_TLS,
      },
    },
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
