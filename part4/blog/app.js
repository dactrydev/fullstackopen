const express = require('express')
const { MONGODB_URI } = require('./utils/config')
const mongoose = require('mongoose')
const {
  unknownEndpoint,
  errorHandler,
  logger,
  tokenExtractor,
} = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

const app = express()

app.use(express.json())
app.use(logger)
app.use('/api/login', loginRouter)
app.use(tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use(unknownEndpoint)
app.use(errorHandler)
module.exports = app
