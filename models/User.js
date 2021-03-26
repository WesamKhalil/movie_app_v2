const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
    }
})

//Before your created password is saved on the database it is encrypted using bcrypt.
userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//Create a user verification function on the User model to use in the userApiController.
userSchema.statics.verify = async function(email, password) {
    const user = await this.findOne({ email }).select('first_name last_name password').lean()
    const { first_name, last_name, _id } = user
    
    if(!user) throw new Error("User doesn't exist.")

    const correctPassword = await bcrypt.compare(password, user.password)
    if(!correctPassword) throw new Error("Incorrect email or password.")

    return { first_name, last_name, _id }
}

module.exports = mongoose.model('user', userSchema)