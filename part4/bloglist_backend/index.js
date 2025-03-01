// 4.1 - 4.2
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

module.exports = { app, server };
