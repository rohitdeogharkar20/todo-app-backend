const User = require('../models/user')

const registerUser = async (req, res) =>{
    try{
        const result = await User.registerUser(req.body)
        return res.status(result.statusCode).json(result)
    }
    catch(err){
        console.log("err",err)
        return  res.status(500).send('internal server error')
    }
}


const loginUser = async (req, res) => {
    try{
        const result = await User.loginUser(req.body)
        return res.status(result.statusCode).json(result)
    }
    catch(err){
        console.log("err",err)
        return  res.status(500).send('internal server error')
    }
}

const findUser = async (req, res) =>{
   
    try{
        const { page = 1 , limit = 10 } = req.body.paginate
        const skip = (page - 1) *  limit
        let result = await User.findUser(req.body.data, skip, limit, req.user)
        result = {
            page,
            limit,
            ...result  
        }
        return res.status(result.statusCode).json(result)
    }
    catch(err){
        console.log("err",err)
        return  res.status(500).send('internal server error')
    }
}

module.exports = {
    registerUser,
    loginUser,
    findUser
}