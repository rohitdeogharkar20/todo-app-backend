require("dotenv").config();

const { SERVER_HOST, SERVER_PORT } = process.env;

const express = require("express");
const app = express();
const cors = require("cors");

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
  res.send("Hey there i am your todo.....");
});

const init = async () => {
  await connectDB();

  app.listen(SERVER_PORT, () => {
    console.log(
      `Server up and running on http://${SERVER_HOST}:${SERVER_PORT}`
    );
  });
};

init();
