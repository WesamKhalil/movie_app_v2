const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    let error = {}
    Object.getOwnPropertyNames(err).forEach(key => error[key] = err[key] , err);

    if(err.code === 11000) {
        const message = "Duplicate field value entered."
        error = new ErrorResponse(message, 400)
    }

    if(err.name === "ValidatorError") {
        const message = Object.values(err.errors).map(validErr => validErr.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error"
    })
}

module.exports = errorHandler