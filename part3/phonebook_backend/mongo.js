// 3.12: Command-line database
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
};

// set up password and dbName
const password = process.argv[2]


const dbName = 'phonebookApp'

const url =
    `mongodb+srv://admin:${password}@cluster0.jyksi.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// set schema
const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


// show all contacts
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
};


// add new contact
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    // "id": 1,
    'name': name,
    'number': number
  })
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to ${dbName}`)
    mongoose.connection.close()
  })
}

// missing variable or too many variables
if (process.argv.length === 4 || process.argv.length > 5) {
  console.log('Missing name/number or too many arguments!')
  process.exit(1)
}