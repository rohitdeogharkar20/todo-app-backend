require("dotenv").config();

const Mongo = require("../utils");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { Validator } = require("node-input-validator");
const niv = require("node-input-validator");
const { generateToken } = require("../middlewares/authenctication");

const { BCRYPT_SALT_ROUND = 10 } = process.env;

const registerUser = async (data) => {
  const { username, email, password } = data;

  niv.addCustomMessages({
    "password.regex": `Password must contain:At least 1 uppercase letter, At least 1 lowercase letter, At least 1 number, At least 1 special character`,
  });

  const validate = new Validator(data, {
    username: "required|maxLength:15",
    email: "required|email",
    password:
      "required|minLength:8|regex:^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$",
    confirmPassword: "required|same:password",
  });

  const validateResult = await validate.check();

  if (!validateResult) {
    global.log("registerUser Validation failed", data);
    return {
      statusCode: 202,
      message: validate.errors,
    };
  }

  const userCheck = await Mongo.findData("users", { username });

  if (userCheck.length > 0) {
    return {
      statusCode: 201,
      message: "User with same username exist",
    };
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userData = {
      userId: uuidv4(),
      username: username,
      email: email,
      password: hash,
    };

    const result = await Mongo.insertData("users", userData);

    if (result) {
      global.log("New User registered", userData);
      return {
        statusCode: 200,
        message: "User Registered Successfully!",
        data: result,
      };
    } else {
      global.log("User registeration failure", result);
      return {
        statusCode: 201,
        message: "User Registered Unsuccessfull!",
      };
    }
  }
};

const loginUser = async (data) => {
  const { username, password } = data;

  const validate = new Validator(data, {
    username: "required",
    password: "required",
  });

  const validateResult = await validate.check();

  if (!validateResult) {
    global.log("Bad Paramters supplied", data);
    return {
      statusCode: 202,
      message: validate.errors,
    };
  }

  const userCheck = await Mongo.findData("users", { username });

  if (userCheck.length > 0) {
    const passwordCheck = await bcrypt.compare(password, userCheck[0].password);
    if (passwordCheck) {
      global.log("User logged in", username);
      return {
        statusCode: 200,
        token: generateToken({ username, email: userCheck[0].email }),
        username: username,
        message: "Login Success",
      };
    } else {
      global.log("Wrong credentials passed", username);
      return {
        statusCode: 201,
        message: "Wrong Credentials",
      };
    }
  } else {
    global.log("Wrong credentials passed", username);
    return {
      statusCode: 201,
      message: "Wrong Credentials",
    };
  }
};

const findUser = async (data, user = {}) => {
  let { skip, limit, filter = {} } = data;

  const result = await Mongo.findData(
    "users",
    { username: { $ne: user } },
    {
      username: 1,
      userId: 1,
    }
  );
  // const total = await Mongo.count("users", data);
  return {
    statusCode: 200,
    // totalPages: Math.ceil(total / limit),
    // totalItems: total,
    result,
  };
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
};
