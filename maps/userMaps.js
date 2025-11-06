const userOnline = new Map();
const userOffline = new Map();

const maps = {
  setUserOnline: (username) => {
    if (userOffline.has(username)) {
      if (userOffline.delete(username)) {
        userOnline.set(username, Date.now());
      }
    } else {
      userOnline.set(username, Date.now());
    }
    return 1;
  },
  setUserOffline: (username) => {
    if (userOnline.has(username)) {
      if (userOnline.delete(username)) {
        userOffline.set(username, Date.now());
      }
    } else {
      userOffline.set(username, Date.now());
    }
    return userOffline.get(username);
  },
  checkUserStatus: (username) => {
    if (userOnline.has(username)) {
      return 1;
    } else if (userOffline.has(username)) {
      return userOffline.get(username);
    } else {
      return 404;
    }
  },
};

module.exports = maps;
