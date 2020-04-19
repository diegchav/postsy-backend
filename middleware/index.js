const { STATUS_CODES } = require('http')

const handleValidationError = (err, req, res, next) => {
    console.error(err)

    if (err.name !== 'ValidationError') return next(err)

    const errors = Object.values(err.errors).map(e => {
        const { path, message } = e
        return {
            [path]: message
        }
    })

    res.status(400).json(errors)
}

const handleError = (err, req, res, next) => {
    console.error(err)
    
    if (res.headersSent) return next(err)

    const statusCode = err.statusCode || 500
    const errorMessage = STATUS_CODES[statusCode] || 'Internal Error'
    res.status(statusCode).json({ error: errorMessage })
}

const handleNotFound = (req, res) => {
    const statusCode = 404
    const errorMessage = STATUS_CODES[statusCode]
    res.status(statusCode).json({ error: errorMessage })
}

module.exports = {
    handleValidationError,
    handleError,
    handleNotFound
}