const Mongo = require("../utils");
const { v4: uuidv4 } = require("uuid");
const { Validator } = require("node-input-validator");

const createToDo = async (data, user) => {
  const { title, description, startAt, endAt } = data;

  const validate = new Validator(data, {
    title: "required|maxLength:50",
    description: "required",
  });

  const validateResult = await validate.check();

  if (!validateResult) {
    global.log("createToDo Validation failed", { user: user.username, data });
    return {
      statusCode: 201,
      result: validate.errors,
    };
  }

  const checkResult = await Mongo.findData("todos", {
    $and: [
      { title: title.trim() },
      { username: user.username },
      { deleteStatus: 0 },
    ],
  });
  if (checkResult.length > 0) {
    global.log("Todo with same title already exist!", { title, user });
    return {
      statusCode: 201,
      message: "Todo with same title already exist!",
    };
  }

  const toDodata = {
    todoId: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    username: user.username,
    startAt: startAt ? startAt : "",
    endAt: endAt ? endAt : "",
    deleteStatus: 0,
    completeStatus: 0,
  };
  const result = await Mongo.insertData("todos", toDodata);
  if (result) {
    global.log("Todo created success", toDodata);
    return {
      statusCode: 200,
      message: "To do created successfully!",
    };
  } else {
    global.log("To do creation unsuccess!", toDodata);
    return {
      statusCode: 201,
      message: "To do creation unsuccess!",
    };
  }
};

const getTodoList = async (data, user) => {
  const { page, limit, filter } = data;

  const skip = (page - 1) * limit;

  const getToDo = await Mongo.findData(
    "todos",
    { username: user.username, deleteStatus: 0, ...filter },
    {},
    { startAt: 1 },
    skip,
    limit
  );

  if (getToDo.length > 0) {
    global.log("Todo fetch sucess", {
      user: user.username,
      getToDoCount: getToDo.length,
    });
    return {
      statusCode: 200,
      message: "Todos found successfully!",
      data: getToDo,
    };
  } else {
    global.log("no todos found!", {
      user: user.username,
      getToDoCount: getToDo.length,
    });
    return {
      statusCode: 200,
      message: "no todos found!",
    };
  }
};

const getToDoById = async (data, user) => {
  const { todoId } = data;

  const validate = new Validator(data, {
    todoId: "required",
  });

  const validateResult = await validate.check();

  if (!validateResult) {
    global.log("getToDoById Validation failed", { user: user.username, data });
    return {
      statusCode: 201,
      result: validate.errors,
    };
  }

  const getToDo = await Mongo.findData("todos", { todoId });

  if (getToDo.length > 0) {
    global.log("To do found", getToDo);
    return {
      statusCode: 200,
      message: "to do found success",
      data: getToDo,
    };
  } else {
    global.log("no todos found!", getToDo);
    return {
      statusCode: 201,
      message: "No todo found!",
    };
  }
};

const updateTodoById = async (data, user) => {
  const validate = new Validator(data, {
    todoId: "required",
  });

  const validateResult = await validate.check();

  if (!validateResult) {
    global.log("updateTodoById failed", data);
    return {
      statusCode: 201,
      result: validate.errors,
    };
  }

  const fitler = { todoId: data.todoId };

  const updateTodo = await Mongo.findAndUpdateData("todos", fitler, data);

  if (updateTodo == null) {
    global.log("update todo fail", updateTodo);
    return {
      statusCode: 201,
      message: "No todo found!",
    };
  } else {
    global.log("Update todo success!", updateTodo);
    return {
      statusCode: 200,
      message: "Update todo success!",
    };
  }
};

const deleteTodoById = async (data, user) => {
  const { todoId } = data;

  const validate = new Validator(data, {
    todoId: "required",
  });

  const validateResult = await validate.check();

  if (!validateResult) {
    global.log("deleteTodoById Validation failed", {
      user: user.username,
      data,
    });
    return {
      statusCode: 201,
      result: validate.errors,
    };
  }

  const fitler = { todoId };

  const updateData = {
    deleteStatus: 1,
  };

  const updateTodo = await Mongo.findAndUpdateData("todos", fitler, updateData);

  if (updateTodo == null) {
    global.log("deleteTodoById fail", updateTodo);
    return {
      statusCode: 201,
      message: "No todo found!",
    };
  } else {
    global.log("deleteTodoById success", updateTodo);
    return {
      statusCode: 200,
      message: "delete todo success!",
    };
  }
};

const completeMarkOperation = async (data, user) => {
  const { todoId, completeStatus } = data;

  const validate = new Validator(data, {
    todoId: "required",
  });

  const validateResult = await validate.check();

  if (!validateResult) {
    global.log("completeMarkOperation failed", data);
    return {
      statusCode: 201,
      result: validate.errors,
    };
  }

  const fitler = { todoId };

  const updateTodo = await Mongo.findAndUpdateData("todos", fitler, data);

  if (updateTodo) {
    let message = "";
    completeStatus == 0
      ? (message = "Todo changed to incomplete success!")
      : (message = "Todo Completed Success!");

    global.log("completeMarkOperation todo success", {
      updateTodo,
      message,
    });
    return {
      statusCode: 200,
      message,
    };
  }
};

module.exports = {
  createToDo,
  getTodoList,
  getToDoById,
  updateTodoById,
  deleteTodoById,
  completeMarkOperation,
};
