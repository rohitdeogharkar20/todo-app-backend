// const moment = require("moment");
const dayjs = require('dayjs')

const { LOGGER_ENABLE = false, ENVIRONMENT } = process.env;

const log = (message, data) => {
  if (LOGGER_ENABLE == "true") {
    if (ENVIRONMENT == "development") {
      const time = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
      console.log(time + " | " + message + " ==> ", data ? data : "");
    } else {
      console.log(message + " ==> ", data ? data : "");
    }
  }
};

module.exports = log;
