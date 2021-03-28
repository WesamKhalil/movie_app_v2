class ErrorResponse extends Error {
    constructor(message, name, errors, statusCode) {
        super(message)
        this.name = name
        this.errors = errors
        this.statusCode = statusCode
    }
}

module.exports = ErrorResponse