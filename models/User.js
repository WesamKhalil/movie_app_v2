const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name."],
        maxLength: [30, "Name can't be longer than 30 characters."],
        validate: [
            { validator: isValidName, message: "Name must only contain alphabet characters and spaces." }
        ]
    },
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: [true, "User with that email already exists."]
    },
    password: {
        type: String,
        minLength: [8, "Password must be atleast 8 characters long."],
        maxLength: [50, "Password can't be longer than 50 characters."],
        required: [true, "Please provide a password."],
    }
})

//Before your created password is saved on the database it is encrypted using bcrypt.
userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//Create a user verification function on the User model to use in the userApiController.
userSchema.statics.verify = async function(email, password) {
    const user = await this.findOne({ email }).select('name password').lean()
    
    if(!user) throw new Error("User doesn't exist.")


    const correctPassword = await bcrypt.compare(password, user.password)
    if(!correctPassword) throw new Error("Incorrect email or password.")

    return { name: user.name, _id: user._id }
}

//Function for validating a valid name format, alphabet characters and spaces only allowed in name.
function isValidName(name) {
    return /^[a-zA-Z\s]+$/.test(name)
}

module.exports = mongoose.model('user', userSchema)