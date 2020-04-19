// load configuration from environment variables
require('dotenv').config()

const app = require('./server')

const port = process.env.PORT || 1337
app.listen(port, () => console.log(`Server listening on port ${port}`))