const jwt = require('jsonwebtoken')
const { error, info } = require('./logger')

const logger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    info('Method: ', req.method)
    info('Path: ', req.path)
    info('Body: ', req.body)
    info('====================')
  }
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
  }
  next()
}

const userExtractor = (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  req.userId = decodedToken.id
  next()
}

const errorHandler = (err, req, res, next) => {
  error('Error name: ', err.name)
  error('Error message: ', err.message)
  if (err.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' })
  else if (err.name === 'ValidationError')
    return res.status(400).json({ error: err.message })
  else if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'token must be provided' })
  else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    })
  }
  next(err)
}

module.exports = {
  logger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
