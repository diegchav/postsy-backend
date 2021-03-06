import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import BaseRouter from './routes'
import * as middleware from './middleware'
import { BASE_PATH } from './constants'

const app = express()

/* Middlewares */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(express.static('public'))

// Show routes called only in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

/* Routes */
app.use(BASE_PATH, new BaseRouter().router)

/* Error handlers */
app.use(middleware.handleMongoValidationError)
app.use(middleware.logErrors)
app.use(middleware.handleError)
app.use(middleware.handleNotFound)

export default app