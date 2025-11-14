require("dotenv").config();

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER,
  REDIS_PASSWORD,
  REDIS_TLS,
  REDIS_URL,
} = process.env;

const { Worker } = require("bullmq");
const { createClient } = require("redis");

const Message = require("../models/message");
const maps = require("../maps/userMaps");
const chatMaps = require("../maps/chatMaps");

const redis = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    tls: REDIS_TLS,
  },
  password: REDIS_PASSWORD,
});

let worker;

const initializeQueueListener = (io) => {
  global.log("Message Queue Listener Initialize");

  const process = async (job) => {
    const { roomName, username, message, chatId } = job.data;

    let status = "sent";

    const userStatus = maps.checkUserStatus(roomName);
    if (userStatus == 1) {
      global.log("Recieve message", { data: job.data });
      io.to(roomName).emit("receiveMessage", job.data);
      status = "delivered";
      const result = chatMaps.getUserChat(roomName);
      console.log(result, chatId);
      if (result == chatId) {
        status = "read";
      }
    }
    io.to(username).emit("messageStatus", { status, message });

    job.data.status = status;
    const result = await Message.insertMessage(job.data);
  };

  worker = new Worker("messageQueue", process, {
    connection: redis,
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
