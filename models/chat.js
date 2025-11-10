const Mongo = require("../utils");
const { v4: uuidv4 } = require("uuid");

const createChat = async (participants) => {
  const data = {
    chatId: uuidv4(),
    chatName: participants.join(","),
    participants,
  };
  let findResult;
  const result = await Mongo.insertData("chats", data);
  if (result.acknowledged) {
    findResult = await Mongo.findData("chats", {
      _id: result.insertedId,
    });
  }
  return findResult;
};

const findChat = async (participants) => {
  const filter = {
    participants: { $all: participants },
  };

  const result = await Mongo.findData("chats", filter);
  return result;
};

module.exports = {
  createChat,
  findChat,
};
