const Mongo = require("../utils");
const { v4: uuidv4 } = require("uuid");
const { Validator } = require("node-input-validator");

const insertMessage = async (data) => {

  console.log(data.message)
  const insertData = {
    messageId: uuidv4(),
    deleteStatus: 0,
    ...data,
  };

  const result = await Mongo.insertData("messages", insertData);
  if (result) {
    global.log("Message inserted success", insertData);
    return {
      statusCode: 200,
      message: "Message inserted successfully!",
    };
  } else {
    global.log("Message inserted unsuccess!", insertData);
    return {
      statusCode: 201,
      message: "Message inserted unsuccess!",
    };
  }
};

const getMessages = async (data) => {
  const { username, roomName, pagination } = data;
  const filter = {
    $or: [
      { username, roomName },
      { username: roomName, roomName: username },
    ],
  };
  const result = await Mongo.findData(
    "messages",
    filter,
    {},
    { insertedAt: -1 },
    pagination,
    10
  );

  if (result.length > 0) {
    global.log("Messages fetch sucess", {
      // user: user.username,
      getToDoCount: result.length,
    });
    return {
      statusCode: 200,
      message: "Messages found successfully!",
      data: result,
    };
  } else {
    global.log("no messages found!", {
      // user: user.username,
      getToDoCount: result.length,
      data: result,
    });
    return {
      statusCode: 200,
      message: "no messages found!",
      data: result,
    };
  }
};

module.exports = {
  insertMessage,
  getMessages,
};
