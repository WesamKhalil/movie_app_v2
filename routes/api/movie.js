const express = require('express')
const router = express.Router()
const { addFavourite, deleteFavourite, fetchMovieInfo, addComment, deleteComment } = require('../../controllers/movieApiController')
const { authUser } = require('../../middleware/authMiddleware')

//API route for adding a favourite movie to user document
router.post('/favourites/:id', authUser, addFavourite)

//API route for deleting a favourite movie from user document
router.delete('/favourites/:id', authUser, deleteFavourite)

// API route for fetching favourited count and comments for a movie
router.get('/info/:id', fetchMovieInfo)

// API route for adding a comment under a movie
router.post('/comments/:id', authUser, addComment)

// API route for deleting a comment under a movie
router.delete('/comments/:id', authUser, deleteComment)

module.exports = router