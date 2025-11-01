const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    const result = await User.registerUser(req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    global.log("User Register Error Occured", err.message);
    return res.status(500).send("internal server error");
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await User.loginUser(req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    global.log("User Login Error Occured", err.message);
    return res.status(500).send("internal server error");
  }
};

const findUser = async (req, res) => {
  try {
    const result = await User.findUser(req.body, req.user);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    global.log("findUser error Occured", err.message);
    return res.status(500).send("internal server error");
  }
};

const myDetails = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (err) {
    global.log("myDetails error Occured", err.message);
    return res.status(500).send("internal server error");
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  myDetails,
};
