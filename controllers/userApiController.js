const User = require('../models/User')
const jwt = require('jsonwebtoken')
require("dotenv").config()

//Function for creating tokens where we can specify configuration to avoid repeating code
const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_KEY)
}

//Controller for verifying user info and returning a token
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const { name, _id } = await User.verify(email, password)

        const token = await createToken(_id)

        res.json({ name, token })
    } catch(error) {
        res.sendStatus(400)
    }
}

//Controller for registering a new user to the database and return a token
const registerUser = async (req, res) => {
    try {
        const { _id } = await User.create(req.body)

        const token = await createToken(_id)

        res.json({ name: req.body.name, token })
    } catch(error) {
        res.sendStatus(400)
    }
}

//Controller for sending user infor to client with an existing token
const loadUser = async (req, res) => {
    const token = req.header('x-auth-token')

    try {
        const { id } = await jwt.verify(token, process.env.JWT_KEY)

        const { name } = await User.findById(id)

        res.json({ name })
    } catch(error) {
        res.sendStatus(400)
    }
}

module.exports = { loginUser, registerUser, loadUser }