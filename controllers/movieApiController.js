const User = require('../models/User')
const jwt = require('jsonwebtoken')
require("dotenv").config()

//Controller for adding a new favourite movie to a user document
const addFavourite = async (req, res, next) => {
    const token = req.header('x-auth-token')
    const newFavourite = req.params.id

    try {
        const { id } = await jwt.verify(token, process.env.JWT_KEY)

        await User.findByIdAndUpdate(id, { $addToSet: { favourites: newFavourite } })

        res.sendStatus(200)
    } catch(error) {
        next(error)
    }
}

//Controller for deleting a specified movie from a users document
const deleteFavourite = async (req, res, next) => {
    const token = req.header('x-auth-token')
    const oldFavourite = req.params.id

    try {
        const { id } = await jwt.verify(token, process.env.JWT_KEY)

        let user = await User.findById(id)

        user.favourites.filter(movie => movie != oldFavourite)

        await user.save()

        res.sendStatus(200)
    } catch(error) {
        next(error)
    }
}

module.exports = { addFavourite, deleteFavourite }