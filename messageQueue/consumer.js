const { Worker } = require("bullmq");
const Message = require("../models/message");

let worker;

const initializeQueueListener = (io) => {
  global.log("Message Queue Listener Initialize");

  const process = async (job) => {
    const { roomName } = job.data;
    const result = await Message.insertMessage(job.data);
    if (result) {
      io.to(roomName).emit("receiveMessage", job.data);
    }
  };

  worker = new Worker("messageQueue", process, {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  });

  worker.on("completed", async (job) => {
    await job.remove();
  });

  worker.on("failed", (job, err) => {
    global.log("job failed", err.message);
  });

  return worker;
};

module.exports = initializeQueueListener;
