require('dotenv').config()
let Data = require('./models/person')
const morgan = require('morgan')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3012
const HOST = `http://localhost:${PORT}`
const PERSON_API_PATH = '/api/persons'

morgan.token('body', (req) => JSON.stringify(req.body) || ' ')

app
  .use(express.json())
  .use(morgan(':method :url :status :body'))
  .use(express.static('dist'))

app.get('/', (req, res) => {
  res.send('<h1>Phonebook</h1>')
})

app.get('/info', (req, res, next) => {
  Data.find({})
    .then((data) => {
      const entriesCountLine = `Phonebook has info for ${data.length} people`
      const date = Date()
      res.json(entriesCountLine + date)
    })
    .catch(next)
})

app.get(PERSON_API_PATH, (req, res, next) => {
  Data.find({})
    .then((people) => res.status(200).json(people))
    .catch(next)
})

app.get(PERSON_API_PATH + '/:id', (req, res, next) => {
  Data.findById(req.params.id)
    .then((person) => {
      if (!person) return res.status(404).end()
      res.json(person)
    })
    .catch(next)
})

app.delete(PERSON_API_PATH + '/:id', (req, res, next) => {
  Data.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(next)
})

app.put(PERSON_API_PATH + '/:id', (req, res, next) => {
  const { name, number } = req.body
  Data.findById(req.params.id)
    .then((person) => {
      if (!person) return res.status(404).end()
      person.name = name
      person.number = number
      return person.save().then((updatedPerson) => res.json(updatedPerson))
    })
    .catch(next)
})

app.post(PERSON_API_PATH, (req, res, next) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).send('content missing')

  const person = new Data({
    name,
    number,
  })
  person
    .save()
    .then((newPerson) => res.json(newPerson))
    .catch(next)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error('Error Name: ', error.name)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)
app.listen(PORT, () => console.log('Start server on :', HOST + PERSON_API_PATH))
