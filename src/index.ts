// Load configuration from environment variables
import dotenv from 'dotenv'
dotenv.config()

import db from './db'

// Connect to MongoDB
db()

import app from './server'
import logger from './common/logger'

const port = Number(process.env.PORT || 1337)
app.listen(port, () => logger.info(`Server listening on port ${port}`))