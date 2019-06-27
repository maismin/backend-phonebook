const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max)) 
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const id = getRandomInt(10000)
  const body = request.body

  const missingName = !body.name
  const missingNumber = !body.number
  const duplicatePerson = persons.some(person => person.name === body.name)

  if (missingName) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (missingNumber) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  if (duplicatePerson) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    "name": body.name,
    "number": body.number,
    "id": id
  }

  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})