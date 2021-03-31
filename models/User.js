const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { v4: uuidv4 }  = require('uuid')
const ErrorResponse = require('../utils/errorResponse')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Please provide a name."],
        maxLength: [20, "First name can't be longer than 20 characters."],
        match: [/^[a-zA-Z]+$/, "Name must only contain alphabet characters."]
    },
    last_name: {
        type: String,
        required: [true, "Please provide a name."],
        maxLength: [20, "Last name can't be longer than 20 characters."],
        match: [/^[a-zA-Z]+$/, "Name must only contain alphabet characters."]
    },
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: [true, "User with that email already exists."]
    },
    password: {
        type: String,
        minLength: [8, "Password must be atleast 8 characters long."],
        maxLength: [64, "Password can't be longer than 64 characters."],
        required: [true, "Please provide a password."],
    },
    favourites: {
        type: Array,
        default: []
    },
    UCId: {
        type: String
    }
})

//Before your created password is saved on the database it is encrypted using bcrypt.
// We create an id for the client to identify their users comments
userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    this.UCId = await uuidv4()
    next()
})

//Create a user verification function on the User model to use in the userApiController.
userSchema.statics.verify = async function(email, password) {
    let errorList = []
    if(!email) errorList.push({ type: "email", message: "Please provide an email." })
    if(!password) errorList.push({ type: "password", message: "Please provide a password." })
    if(errorList.length > 0) throw new ErrorResponse("Verification of email and password failed.", "verify", errorList)

    const user = await this.findOne({ email }).select('first_name last_name password favourites UCId')
    
    if(!user) {
        errorList.push({ type: "email", message: "This email isn't registered." })
        throw new ErrorResponse("User doesn't exist.", "verify", errorList)
    }

    const { first_name, last_name, favourites, _id, UCId } = user

    const correctPassword = await bcrypt.compare(password, user.password)

    if(!correctPassword) {
        errorList.push({ type: "password", message: "Incorrect password." })
        throw new ErrorResponse("Incorrect password.", "verify", errorList)
    }

    return { first_name, last_name, favourites, _id, UCId }
}

module.exports = mongoose.model('user', userSchema)