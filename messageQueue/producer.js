const { Queue } = require("bullmq");

let messageQueue;

const initializeQueue = () => {
  messageQueue = new Queue("messageQueue", {
    connection: {
      host: "127.0.0.1",
      port: 6379,
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
