const User = require('../models/User')
const jwt = require('jsonwebtoken')
require("dotenv").config()

//Function for creating tokens where we can specify configuration to avoid repeating code
const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_KEY)
}

//Controller for verifying user info and returning a token
const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    try {
        let { first_name, last_name, favourites, _id, UCId } = await User.verify(email, password)

        const token = await createToken(_id)

        res.json({ first_name, last_name, favourites, token, UCId })
    } catch(error) {
        next(error)
    }
}

//Controller for registering a new user to the database and return a token
const registerUser = async (req, res, next) => {
    try {
        const { _id } = await User.create(req.body)

        const token = await createToken(_id)

        res.json({ token })
    } catch(error) {
        next(error)
    }
}

//Controller for sending user infor to client with an existing token
const loadUser = async (req, res, next) => {
    const token = req.header('x-auth-token')

    try {
        const { id } = await jwt.verify(token, process.env.JWT_KEY)

        const { first_name, last_name, favourites, UCId } = await User.findById(id)

        res.json({ first_name, last_name, favourites, UCId })
    } catch(error) {
        next(error)
    }
}

module.exports = { loginUser, registerUser, loadUser }