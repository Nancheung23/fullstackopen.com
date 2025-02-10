// .env
require('dotenv').config()

const express = require('express');
const cors = require('cors');
const app = express();
const Note = require('./models/note');

app.use(cors());
// assets
app.use(express.static('dist'));
// express json-parser
app.use(express.json());
// middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

// let notes = [
//     {
//         id: 1,
//         content: "HTML is easy",
//         date: "2022-05-30T17:30:31.098Z",
//         important: true
//     },
//     {
//         id: 2,
//         content: "Browser can execute only Javascript",
//         date: "2022-05-30T18:39:34.091Z",
//         important: false
//     },
//     {
//         id: 3,
//         content: "GET and POST are the most important methods of HTTP protocol",
//         date: "2022-05-30T19:20:14.298Z",
//         important: true
//     }
// ];
app.use(requestLogger);

app.use(unknownEndpoint);

// error handling
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    };

    next(error);
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
    // no need using Json.stringfy(notes)
    // response.json(notes);
    Note.find({}).then(notes => {
        response.json(notes);
    })
});

app.get('/api/notes/:id', (request, response, next) => {
    // const id = Number(request.params.id);
    // const note = notes.find(note => note.id === id);
    // if (note) {
    //     response.json(note);
    // } else {
    //     response.status(404).end();
    // };
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note);
        } else {
            response.status(404).end();
        }
    })
        .catch(
            error => next(error)
        );
});

app.post('/api/notes', (request, response, next) => {
    // const generateId = () => {
    //     const maxId = notes.length > 0
    //         ? Math.max(...notes.map(n => n.id))
    //         : 0;
    //     return maxId + 1;
    // };

    const body = request.body;

    if (body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        });
    };

    // const note = {
    //     content: body.content,
    //     important: body.important || false,
    //     date: new Date(),
    //     id: generateId(),
    // };
    const note = new Note({
        content: body.content,
        important: body.important || false
    });

    // notes = notes.concat(note);
    note.save()
        .then(savedNote => {
            response.json(savedNote);
        })
        .catch(error => next(error));

    // response.json(note);
});

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body;
    const note = {
        content: body.content,
        important: body.important
    };
    Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' })
        .then(updateNote => {
            response.json(updateNote);
        })
        .catch(error => next(error));
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});