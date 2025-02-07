const express = require('express');
// 3.7: Phonebook backend step7
const morgan = require('morgan');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// 3.8*: Phonebook backend step8
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
});

// 3.7: Phonebook backend step7
app.use(morgan('tiny', {
    skip: (req, res) => req.method === 'POST'
}));

// 3.8*: Phonebook backend step8
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req, res) => req.method !== 'POST'
}));

const PORT = process.env.PORT || 3001;

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

// root
app.get('/', (req, res) => {
    res.send('<h1>Phonebook Backend</h1>');
});

// 3.1: Phonebook backend step1
// getAll
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// 3.2: Phonebook backend step2
// info
app.get('/info', (req, res) => {
    let count = persons.length;
    let time = new Date();
    let unit = count > 1 ? 'people' : 'person';
    res.send(`Phonebook has info for ${count} ${unit} <br/> ${time}`)
});

// 3.3: Phonebook backend step3
// getById
app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id === Number(req.params.id));
    if (person) {
        res.status(200).json(person);
    } else {
        res.status(404).json({ error: `Id ${req.params.id} not found` });
    };
});

// 3.4 Phonebook backend step4
// deleteById
app.delete('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id === Number(req.params.id));
    if (person) {
        persons = persons.filter(p => p !== person);
        console.log(persons);

        res.status(404).json({ message: `Delete by Id ${req.params.id}` });
    } else {
        res.status(404).json({ error: `Id ${req.params.id} not found` });
    };
});

// 3.5: Phonebook backend step5
app.post('/api/persons', (req, res) => {
    if (req.body.name) {
        // 3.6: Phonebook backend step6
        // check unique: name
        const person = persons.find(p => p.name.toLowerCase() === req.body.name.toLowerCase());
        if (person) {
            res.status(404).json({ error: 'name must be unique' });
            return;
        };

        // 3.6: Phonebook backend step6
        // check valid: Number
        if (!req.body.number) {
            res.status(404).json({ error: 'Invalid body, number field is missing' });
            return;
        }

        if (req.body.id) {
            const { id, name, number } = req.body;
            persons = persons.concat({
                id: id,
                name: name,
                number: number
            });
            // console.log(persons);
            res.status(200).json({ message: `Create item by given Id ${id}` });
        } else {
            const id = Math.floor(Math.random() * 65535);
            const { name, number } = req.body;
            persons = persons.concat({
                id: id,
                name: name,
                number: number
            });
            // console.log(persons);
            res.status(200).json({ message: `Create item by random Id ${id}` });
        }
    }
    else {
        // 3.6: Phonebook backend step6
        // console.log(persons);
        res.status(404).json({ error: `Invalid body, name field is missing` });
    };
});

// listen
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
