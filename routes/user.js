const express  = require('express')

const router = express.Router()

const  {authenticationToken} = require('../middlewares/authenctication') 

const { 
    registerUser,
    loginUser,
    findUser
} = require('../controllers/user')

router.post('/registerUser', registerUser)
router.post('/loginUser',loginUser)
router.post('/findUser', authenticationToken, findUser)

module.exports = router
