const { Queue } = require("bullmq");

const {redis} = require('../connections/connections')

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
