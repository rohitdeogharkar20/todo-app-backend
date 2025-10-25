require("dotenv").config();

const {
  SERVER_HOST,
  SERVER_PORT,
  LOGGER_ENABLE = false,
  ENVIRONMENT,
} = process.env;

const express = require("express");
const app = express();
const cors = require("cors");
const log = require("./logger");
global.log = log;

const { connectDB } = require("./connections/mongodb");

const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todo");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

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

  app.listen(SERVER_PORT, () => {
    global.log(`${ENVIRONMENT} server started on port`, SERVER_PORT);
  });

  await connectDB();
};

init();
