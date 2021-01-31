module.exports = function (app) {
    app.use('/api/avatar/', require('./routes'));
};
