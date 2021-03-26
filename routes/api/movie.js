const express = require('express')
const router = express.Router()
const { addFavourite, deleteFavourite } = require('../../controllers/movieApiController')

//API route for adding a favourite movie to user document
router.post('/favourites/:id', addFavourite)

//API route for deleting a favourite movie from user document
router.delete('/favourites/:id', deleteFavourite)

module.exports = router