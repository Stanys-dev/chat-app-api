module.exports = function (app) {
    app.use('/api/message/', require('./routes'));
};
