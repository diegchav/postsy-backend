const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { STATUS_CODES } = require('http')

const baseRouter = require('./routes')

const app = express()

/* Middlewares */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// show routes called in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

/* Routes */
app.use('/api', baseRouter)

/* Error handlers */
app.use((err, req, res, next) => {
    console.error(err)

    if (err.name !== 'ValidationError') return next(err)

    const errors = Object.values(err.errors).map(e => {
        const { path, message } = e
        return {
            [path]: message
        }
    })

    res.status(400).json(errors)
})

app.use((err, req, res, next) => {
    console.error(err)
    
    if (res.headersSent) return next(err)

    const statusCode = err.statusCode || 500
    const errorMessage = STATUS_CODES[statusCode] || 'Internal Error'
    res.status(statusCode).json({ error: errorMessage })
})

module.exports = app