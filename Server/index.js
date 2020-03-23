// Express
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
// Middleware
app.use(bodyParser.json())
app.use(cors())

// Make requests to users api
const users = require('./userCollection')
app.use('/api/users',users)

const port = process.env.PORT || 9000
app.listen(port, ()=>console.log(`Server started on port: ${port}`))