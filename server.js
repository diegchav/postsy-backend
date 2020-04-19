const express = require('express')
const bodyParser = require('body-parser')
const { STATUS_CODES } = require('http')

// load configuration from environment variables
require('dotenv').config()

const authRoute = require('./routes/auth.route')

const port = process.env.PORT || 1337

const app = express()

/* Middlewares */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Routes */
app.use('/auth', authRoute)

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

app.listen(port, () => console.log(`Server listening on port ${port}`))