const User = require('../models/User')
const jwt = require('jsonwebtoken')
require("dotenv").config()

//Controller for adding a new favourite movie to a user document
// req.user is created in the authUser middleware in the authMiddleware file
const addFavourite = async (req, res, next) => {
    const newFavourite = req.params.id

    try {
        await req.user.save({ $addToSet: { favourites: newFavourite } })

        res.sendStatus(200)
    } catch(error) {
        next(error)
    }
}

//Controller for deleting a specified movie from a users document
// req.user is created in the authUser middleware in the authMiddleware file
const deleteFavourite = async (req, res, next) => {
    const oldFavourite = req.params.id

    try {
        req.user.favourites = req.user.favourites.filter(movie => movie != oldFavourite)

        await req.user.save()

        res.sendStatus(200)
    } catch(error) {
        console.log(error)
        next(error)
    }
}

module.exports = { addFavourite, deleteFavourite }