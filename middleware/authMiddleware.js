const User = require('../models/User')
const jwt = require('jsonwebtoken')
require("dotenv").config()

//middleware for verifying a user with the token they send to the api
const authUser = async (req, res, next) => {
    const token = req.header('x-auth-token')
    if(!token) throw new Error('No token provided.')

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY)

        const user = await User.count({ _id: decodedToken.id })
        if(user === 0) throw new Error("User doesn't exist.")

        next()
    } catch(error) {
        res.sendStatus(401)
    }
}

module.exports = authUser