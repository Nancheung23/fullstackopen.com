const config = require('./utils/config');
const http = require('http');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const blogRouter = require('./controllers/blogs');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

mongoose.set('strictQuery', false);
mongoose.connect(config.MONGO_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connection to MongoDB:', error.message);
    });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
// app.use(middleware.jwtValidation);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;