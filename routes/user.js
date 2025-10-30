const express = require("express");

const router = express.Router();

const { authenticationToken } = require("../middlewares/authenctication");

const {
  registerUser,
  loginUser,
  findUser,
  myDetails,
} = require("../controllers/user");

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/findUser", authenticationToken, findUser);
router.get("/myDetails", authenticationToken, myDetails);

module.exports = router;
