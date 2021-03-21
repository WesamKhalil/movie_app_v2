const express = require('express')
const app = express()
require("dotenv").config()
const connectDB = require('./config/db.js')
const apiUserRoutes = require('./routes/api/user')

//Connect to Mongo database.
connectDB()

//Attach json sent in the http body to the req argument in routes
app.use(express.json())

//This provides the user api for handling users
app.use('/api/user', apiUserRoutes)

app.get('*', (req, res) => {
    res.send("Server is working!")
})

const port = process.env.SERVER_PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
})