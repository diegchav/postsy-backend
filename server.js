const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const baseRouter = require('./routes')
const middleware = require('./middleware')

const app = express()

/* Middlewares */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Show routes called only in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

/* Routes */
app.use('/api', baseRouter)

/* Error handlers */
app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.handleNotFound)

module.exports = app