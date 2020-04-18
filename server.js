const express = require('express')

const port = process.env.PORT || 1337

const app = express()

app.listen(port, () => console.log(`Server listening on port ${port}`))