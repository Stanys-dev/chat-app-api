// Packages
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

// Controllers
const user = require('./app/user');

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
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

!async function () {
    try {
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    } catch (e) {
        console.trace(e);
    }
}();

user(app);

app.listen(process.env.PORT, () => {
    console.log('Magic happens on: ' + process.env.PORT);
});
