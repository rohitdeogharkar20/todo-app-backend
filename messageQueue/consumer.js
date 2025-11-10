require("dotenv").config();

const { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD, REDIS_TLS } =
  process.env;

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
      username: REDIS_USER, // the user you created
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        tls: REDIS_TLS,
      },
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
