require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url = `mongodb+srv://dactry_phonebook:${password}@cluster0.kiwh3jl.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    ;((returnedObject.id = returnedObject._id.toString()),
      delete returnedObject._id)
    delete returnedObject.__v
  },
})
const Person = mongoose.model('Person', personSchema)

if (!phone) {
  const output = ['Phonebook: ']
  Person.find({}).then((res) => {
    res.forEach((r) => {
      output.push(`${r.name} ${r.phone}`)
    })
    console.log(output.join('\n'))
    mongoose.connection.close()
  })
  return
}

const person = new Person({ name, phone })

person.save().then((result) => {
  console.log(`added ${result.name} number ${result.phone} to phonebook`)
  mongoose.connection.close()
})
