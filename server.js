const express = require('express')
const app = express()
require("dotenv").config()

app.get('*', (req, res) => {
    res.send("Server is working!")
})

const port = process.env.SERVER_PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
})