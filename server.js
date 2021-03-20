const express = require('express')
const app = express()
const mongoose = require('mongoose')
require("dotenv").config()
const apiUserRoutes = require('./routes/api/user')

//Using mongoose to connect to the Mongo database
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    .then(res => console.log("Connected to MongoDB."))

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