const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log('[INFO]', ...params);
    };
};

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log('[ERROR]', ...params);
    };
};

module.exports = {
    info,
    error
};
