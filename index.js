require("dotenv").config();

const {
  SERVER_HOST,
  SERVER_PORT,
  LOGGER_ENABLE = false,
  ENVIRONMENT,
  UI_ORIGIN,
} = process.env;

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const { connectDB } = require("./connections/mongodb");
const log = require("./logger");
const SocketServer = require("./socketServer/socket");
const { initializeQueue } = require("./messageQueue/producer");
const initializeQueueListener = require('./messageQueue/consumer')

const io = new Server(server, {
  cors: {
    origin: UI_ORIGIN,
  },
});

const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todo");

app.use(
  cors({
    origin: UI_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

global.log = log;

app.get("/", (req, res) => {
  global.log("home route hit....");
  res.send("Hey there i am your todo.....");
});

const init = async () => {
  if (LOGGER_ENABLE == "true") {
    global.log("LOGGER ENABLE !!!");
  } else {
    console.log("LOGGER DISABLED !!!");
  }

  server.listen(SERVER_PORT, () => {
    global.log(`${ENVIRONMENT} server started on port`, SERVER_PORT);
  });

  new SocketServer(io);
  await connectDB();
  initializeQueue();
  initializeQueueListener(io)
  require('./maps/userMaps')
};

init();
