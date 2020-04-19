// Load configuration from environment variables
require('dotenv').config()

const app = require('./server')
const logger = require('./logger')

const port = process.env.PORT || 1337
app.listen(port, () => logger.info(`Server listening on port ${port}`))