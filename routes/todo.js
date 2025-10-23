const express = require("express");

const router = express.Router();

const { authenticationToken } = require("../middlewares/authenctication");

const {
  createToDo,
  getTodoList,
  getToDoById,
  updateTodoById,
  deleteTodoById,
  completeMarkOperation,
} = require("../controllers/todo");

router.post("/createToDo", authenticationToken, createToDo);
router.post("/getTodoList", authenticationToken, getTodoList);
router.get("/getToDoById", authenticationToken, getToDoById);
router.post("/updateTodoById", authenticationToken, updateTodoById);
router.post("/deleteTodoById", authenticationToken, deleteTodoById);
router.post(
  "/completeMarkOperation",
  authenticationToken,
  completeMarkOperation
);

module.exports = router;
