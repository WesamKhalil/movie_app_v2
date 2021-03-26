const express = require('express')
const app = express()
require("dotenv").config()
const connectDB = require('./config/db.js')
const apiUserRoutes = require('./routes/api/user')
const apiMovieRoutes = require('./routes/api/movie')
const ErrorHandler = require('./middleware/error')

//Connect to Mongo database.
connectDB()

//Attach json sent in the http body to the req argument in routes
app.use(express.json())

app.use(express.static(__dirname + '/public'))

//This provides the user api for handling users
app.use('/api/user', apiUserRoutes)

//This provides the movie api for handling movie data
app.use('/api/movie', apiMovieRoutes)

app.get(['/', '/login', '/register', '/movie/:id', '/favourites'], (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

//Error handler should be last piece of middleware
app.use(ErrorHandler)

const port = process.env.SERVER_PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
})