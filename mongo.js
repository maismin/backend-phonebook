const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const connect = password => {
  const url =
    `mongodb+srv://fullstack:${password}@cluster0-zgxla.mongodb.net/phonebook?retryWrites=true&w=majority`

  mongoose.connect(url, { useNewUrlParser: true })
}

const addPerson = (name, number) => {
  const person = new Person({
    name,
    number,
  })

  person.save().then(response => {
    console.log(`added ${response.name} number ${response.number} to phonebook`)
    mongoose.connection.close()
  })
}

const displayEntries = () => {
  console.log('phonebook:')
  Person.find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}

let password, name, number

switch (process.argv.length) {
case 2:
  console.log('give password as argument')
  process.exit(1)
  break
case 3:
  password = process.argv[2]
  connect(password)
  displayEntries()
  break
case 4:
  console.log('missing name or number')
  process.exit(1)
  break
default:
  password = process.argv[2]
  name = process.argv[3]
  number = process.argv[4]
  connect(password)
  addPerson(name, number)
}

