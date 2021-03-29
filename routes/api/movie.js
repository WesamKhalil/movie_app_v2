const express = require('express')
const router = express.Router()
const { addFavourite, deleteFavourite } = require('../../controllers/movieApiController')
const { authUser } = require('../../middleware/authMiddleware')

//API route for adding a favourite movie to user document
router.post('/favourites/:id', authUser, addFavourite)

//API route for deleting a favourite movie from user document
router.delete('/favourites/:id', authUser, deleteFavourite)

module.exports = router