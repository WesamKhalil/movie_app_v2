const express = require('express')
const router = express.Router()
const { loginUser, registerUser, loadUser } = require('../../controllers/userApiController')

//Route for logging in user
router.post('/login', loginUser)

//Route for registering user
router.post('/register', registerUser)

//Route for loading user data
router.post('/load', loadUser)

module.exports = router