const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    const errorFormat = { first_name: null, last_name: null, email: null, password: null, general: null }
    let error = {}
    Object.getOwnPropertyNames(err).forEach(key => error[key] = err[key] , err)

    // console.log(err)
    // console.log(error)

    // Duplicate field value entered. In this case can only be a duplicate email.
    if(err.code === 11000) {
        errorFormat.email = "That email is already registered."
    }

    // Mongoose or user created validation failed.
    if(err.name === "ValidatorError" || err.name === "verify") {
        err.errors.forEach(({ type, message }) => { errorFormat[type] = message })
    }

    // Mongoose validation error when creating a new document
    if(err._message === "user validation failed") {
        const errorObj = err.errors
        Object.keys(errorObj)
            .forEach((errorType) => {
                const { path, message } = errorObj[errorType].properties
                errorFormat[path] = message
            })
    }

    errorExists = Object.values(error).some(message => message != null)
    if(errorExists) {
        error = new ErrorResponse("User error.", "User error.", errorFormat, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.errors || "Server Error"
    })
}

module.exports = errorHandler