const info = (...params) => {
    console.log('[INFO]', ...params);
};

const error = (...params) => {
    console.log('[ERROR]', ...params);
};

module.exports = {
    info,
    error
};
