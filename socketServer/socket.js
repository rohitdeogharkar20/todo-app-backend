require("dotenv").config();

const { addQueue } = require("../messageQueue/producer");
const Messages = require("../models/message");
const User = require('../models/user')
const { JWT_SECRET = "&^*1$-+12345&*^($)", JWT_EXPIRY = "1d" } = process.env;

const jwt = require("jsonwebtoken");

class SocketServer {
  constructor(io) {
    this.io = io;
    this.socketAuthentication();
    this.initializeSocket();
  }

  async initializeSocket() {
    global.log("Socket server Initialize");

    this.io.on("connection", (socket) => {
      global.log(
        "Connection occured",
        socket.username ? socket.username : socket.id
      );

      socket.on("joinRoom", (roomName) => {
        global.log("Room Joining", roomName);
        socket.join(roomName);
        socket.id = roomName;
        this.io.to(roomName).emit("joinRoom", "You connected to the server");
      });

      socket.on("previousChats", async (data)=>{
        const {username} = data
        const result = await User.findUser(data, socket.username)
        this.io.to(username).emit("previousChats", result)
      })

      socket.on("previousMessages", async (data) => {
        const result = await Messages.getMessages(data);
        this.io.to(data.username).emit("previousMessages", result);
      });

      socket.on("sendMessage", (message) => {
        addQueue(message);
        global.log("sendMessage", message);
      });

      socket.on("user-left", () => {});

      socket.on("disconnect", () => {
        global.log("disconnect", socket.username);
      });
    });
  }

  async socketAuthentication() {
    global.log("socket authentication established");
    this.io.use((socket, next) => {
      const { token } = socket.handshake.auth;
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          next(new Error("Authentication failed"));
        }
        if (user) {
          socket.username = user.username;
          next();
        } else {
          next(new Error("Authentication failed"));
        }
      });
    });
  }
}

module.exports = SocketServer;
