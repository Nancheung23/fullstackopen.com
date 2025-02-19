const morgan = require('morgan');
const logger = require('./logger');

morgan.token('body', (req, res) => {
    return req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : ''
});

const requestLogger = morgan((tokens, req, res) => {
    if (res.statusCode === 304) {
        return null
    };
    if (req.method === 'POST' || req.method === 'PUT') {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens.body(req, res)
        ].join(' ');
    };
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
    logger.error(err.message);
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    next(err);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};