const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const cors = require('cors')
import 'fontsource-roboto'
//routes
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const roomRouter = require('./controllers/rooms')
const loginRouter = require('./controllers/login')

//middleware
const middleware = require('./utils/middleware')

//mongoose
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

app.use(middleware.isLogged)
app.use('/api/notes', notesRouter)
app.use('/api/rooms', roomRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app