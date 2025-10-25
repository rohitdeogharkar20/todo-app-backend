const moment = require("moment");

const { LOGGER_ENABLE = false } = process.env;

const log = (message, data) => {
  const time = moment().format("YYYY-MM-DD HH:mm:ss.SSS");

  if (LOGGER_ENABLE == "true") {
    console.log(time + " | " + message + " ==> ", data ? data : "");
  }
};

module.exports = log;
