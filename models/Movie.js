const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    UCId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    replyTo: {
        type: String
    }
})

const movieSchema = new mongoose.Schema({
    movieId : {
        type: String,
        required: true
    },
    favourited: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
})

module.exports = mongoose.model('movie', movieSchema)