const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

process.on('unhandledRejection', error => {
    console.trace(error);
});

process.on('uncaughtException', error => {
    console.trace(error);
});

process.on('warning', warning => {
    console.trace(warning.name, warning.message);
});

const app = express();
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

!async function () {
    try {
        await mongoose.connect(process.env.MONGODB);
    } catch (e) {
        console.trace(e);
    }
}();

app.listen(process.env.PORT, function () {
    console.log('Magic happens on: ' + process.env.PORT);
});
