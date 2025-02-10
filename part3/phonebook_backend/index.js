// dotenv
require('dotenv').config()

const express = require('express')
// 3.7: Phonebook backend step7
const morgan = require('morgan')

const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
// fix etag 304 error
app.use(express.static('dist', { etag: false, lastModified: false }))

// 3.8*: Phonebook backend step8
morgan.token('body', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan((tokens, req, res) => {
  if (res.statusCode === 304) {
    return null
  };

  if (req.method === 'POST') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res)
    ].join(' ')
  };

  return morgan['tiny'](tokens, req, res)
}))

// 3.7: Phonebook backend step7
// app.use(morgan('tiny', {
//     skip: (req, res) => {
//         return res.statusCode === 304 || res.method === 'POST';
//     }
// }));
// app.use(morgan('tiny', {
//     skip: (req, res) => req.path.includes('/assets') || req.path === '/'
// }));
// 3.8*: Phonebook backend step8
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
//     skip: (req, res) => req.method !== 'POST'
// }));

const PORT = process.env.PORT || 3001

// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

// root
app.get('/', (req, res) => {
  res.send('<h1>Phonebook Backend</h1>')
})

// 3.1: Phonebook backend step1
// getAll
app.get('/api/persons', (req, res) => {
  // res.json(persons);
  // 3.13: Phonebook database, step 1
  Person.find({}).then(result => {
    res.json(result)
  })
})

// 3.2: Phonebook backend step2
// info
app.get('/info', (req, res) => {
  // let count = persons.length;
  // 3.18 *: Phonebook database step 6
  Person.countDocuments({})
    .then(count => {
      let time = new Date()
      let unit = count > 1 ? 'people' : 'person'
      res.send(`Phonebook has info for ${count} ${unit} <br/> ${time}`)
    })
})

// 3.3: Phonebook backend step3
// getById
app.get('/api/persons/:id', (req, res, next) => {
  // const person = persons.find(person => person.id === Number(req.params.id));
  // id type is string after transform in /models/person

  // 3.13: Phonebook database, step 1
  // 3.18 *: Phonebook database step 6
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.status(200).json(person)
      } else {
        res.status(404).json({ error: `Id ${req.params.id} not found` })
      };
    })
    .catch(error => next(error))
})

// 3.4 Phonebook backend step4
// deleteById
// 3.15: Phonebook database, step 3
app.delete('/api/persons/:id', (req, res, next) => {
  // const person = persons.find(person => person.id === Number(req.params.id));
  // if (person) {
  //     persons = persons.filter(p => p !== person);
  //     console.log(persons);

  //     res.status(204).json({ message: `Delete by Id ${req.params.id}` });
  // } else {
  //     res.status(404).json({ error: `Id ${req.params.id} not found` });
  // };
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// 3.5: Phonebook backend step5
app.post('/api/persons', (req, res, next) => {
  // 3.14: Phonebook database, step 2
  const { name, number } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Invalid body, name field is missing' })
  };

  if (!number) {
    return res.status(400).json({ error: 'Invalid body, number field is missing' })
  };
  Person.findOne({ name }).then(person => {
    if (person) {
      return res.status(404).json({ error: 'name must be unique' })
    } else {
      const person = new Person({
        name: name,
        number: number
      })
      // 3.14: Phonebook database, step 2
      person.save({ name, number })
        .then(result => {
          return res.status(201).json({ message: `added ${name} number ${number} to phonebook`, person: person })
        })
        .catch(error => {
          console.error('Error saving person:', error.message)
          return res.status(500).json({ error: 'Internal server error' })
        })
    }
  })
    .catch(error => {
      // console.error('Error finding person:', error.message);
      // return res.status(500).json({ error: 'Internal server error' });
      return next(error)
    })
    // 3.6: Phonebook backend step6
    // check unique: name
    // 3.6: Phonebook backend step6
    // check valid: Number
}
  // 3.6: Phonebook backend step6
  // console.log(persons);
)

// 3.17*: Phonebook database, step 5
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  // 3.19 *: Phonebook database, step 7
  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then(updatePerson => {
      res.json(updatePerson)
    })
    .catch(error => next(error))
})


// 3.16: Phonebook database, step 4
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(unknownEndpoint)

app.use(errorHandler)

// listen
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
