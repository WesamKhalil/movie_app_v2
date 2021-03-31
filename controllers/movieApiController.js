const Movie = require('../models/Movie')
const mongoose = require('mongoose')
require("dotenv").config()

//Controller for adding a new favourite movie to a user document
// req.user is created in the authUser middleware in the authMiddleware file
const addFavourite = async (req, res, next) => {
    const newFavourite = req.params.id

    try {
        await req.user.updateOne({ $addToSet: { favourites: newFavourite } })

        const movieInfo = await Movie.findOneAndUpdate({ movieId: newFavourite }, { $inc: { favourited: 1 } })
        if(!movieInfo) Movie.create({ movieId: newFavourite, favourited: 1 })

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
        await req.user.updateOne({ $pull: { favourites: oldFavourite } })

        await Movie.findOneAndUpdate({ movieId: oldFavourite }, { $inc: { favourited: -1 } })

        res.sendStatus(200)
    } catch(error) {
        next(error)
    }
}

// Controller for fetching info about a movie
const fetchMovieInfo = async (req, res) => {
    const movieId = req.params.id

    try {
        const info = await Movie.findOne({ movieId })

        if(!info) return res.json({ favourited: 0, comments: [] })

        const { favourited, comments } = info
        res.json({ favourited, comments })
    } catch(error) {
        res.sendStatus(500)
    }
}

// Controller for adding a comment to a document in the Movies collection
const addComment = async(req, res) => {
    const { comment } = req.body
    const UCId = req.user.UCId
    const username = req.user.first_name + ' ' + req.user.last_name
    const movieId = req.params.id
    
    try {
        let movie = await Movie.findOne({ movieId })
        if(!movie) movie = await Movie.create({ movieId })

        const _id = mongoose.Types.ObjectId()
        await movie.updateOne({ $push: { comments: { _id, username, comment, UCId } } })

        res.json({ _id })
    } catch(error) {
        res.sendStatus(400)
    }
}

// Controller for deleting a comment from a document in the Movies collection
const deleteComment = async (req, res) => {
    const { _id } = req.body
    const UCId = req.user.UCId
    const movieId = req.params.id

    try {
        await Movie.findOneAndUpdate({ movieId: movieId }, { $pull: { comments: { _id, UCId } } })

        res.sendStatus(200)
    } catch(error) {
        res.sendStatus(400)
    }
}

const editComment = async (req, res) => {
    const { comment, _id } = req.body
    const UCId = req.user.UCId
    const movieId = req.params.id

    try {
        const movie = await Movie.findOneAndUpdate({ movieId, "comments._id": _id }, { "$set": { "comments.$.comment": comment } })

        res.sendStatus(200)
    } catch(error) {
        console.log(error)
        res.sendStatus(400)
    }
}

module.exports = { addFavourite, deleteFavourite, fetchMovieInfo, addComment, deleteComment, editComment }