const Todos = require('../models/todo')

const createToDo = async (req, res) =>{
    try{
        const result = await Todos.createToDo(req.body, req.user)
        return res.status(result.statusCode).json(result)
    }
    catch(err){
        console.log("err",err)
        return  res.status(500).send('internal server error')
    }
}

const getTodoList = async (req, res) => {
    try{
        const result = await Todos.getTodoList(req.query, req.user)
        return res.status(result.statusCode).json(result)
    }
    catch(err){
        console.log("err",err)
        return  res.status(500).send('internal server error')
    }
}

const getToDoById = async (req, res) => {
    try{
        const result = await Todos.getToDoById(req.query, req.user)
        return res.status(result.statusCode).json(result)
    }
    catch(err){
        console.log("err",err)
        return  res.status(500).send('internal server error')
    }
}

const updateTodoById = async (req, res) => {
    try{
        const result = await Todos.updateTodoById(req.body, req.user)
        return res.status(result.statusCode).json(result)
    }
    catch(err){
        console.log("err",err)
        return  res.status(500).send('internal server error')
    }
}

const deleteTodoById = async (req, res) => {
    try{
        const result = await Todos.deleteTodoById(req.body, req.user)
        return res.status(result.statusCode).json(result)
    }
    catch(err){
        console.log("err",err)
        return  res.status(500).send('internal server error')
    }
}

const completeMarkOperation = async (req, res) => {
    try{
        const result = await Todos.completeMarkOperation(req.body, req.user)
        return res.status(result.statusCode).json(result)
    }
    catch(err){
        console.log("err",err)
        return  res.status(500).send('internal server error')
    }
}


module.exports = {
    createToDo,
    getTodoList,
    getToDoById,
    updateTodoById,
    deleteTodoById,
    completeMarkOperation
}