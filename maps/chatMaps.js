const chatUserMap = new Map();

const chatMaps = {
  setUserChat: (username, chatId) => {
    const result = chatUserMap.set(username, chatId);
    console.log(chatUserMap)
    return 1;
  },
  getUserChat : (username) => {
    const result = chatUserMap.get(username)
    return result
  },
  removeUserChat: (username) => {
    const result = chatUserMap.delete(username);
    return 1;
  },
  
};

module.exports = chatMaps;
