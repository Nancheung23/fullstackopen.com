const morgan = require('morgan');
const logger = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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

// 4.20 *: Blog List Expansion, step8
const getTokenFrom = (req) => {
    const authorization = req.get('authorization');
    return authorization && authorization.toLowerCase().startsWith('bearer ')
        ? authorization.substring(7)
        : null;
};

// 4.18: Blog List Expansion, step6
const jwtValidation = (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (decodedToken.id) {
        req.userId = decodedToken.id;
    };
    next();
};

// 4.22 *: Blog List Expansion, step10
const userExtractor = async (req, res, next) => {
    if (!req.userId) {
        return res.status(401).json({ error: 'User ID missing in the request' });
    };
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    };
    req.user = user;
    next();
}

const errorHandler = (err, req, res, next) => {
    logger.error(err.message);
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
        return res.status(400).json({
            error: 'expected `username` to be unique'
        })
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(400).json({
            error: 'token missing or invalid'
        });
    } else if (err.name === 'TokenExpiredError') {
        return res.status(400).json({
            error: 'token expired'
        });
    };
    next(err);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    jwtValidation,
    userExtractor
};