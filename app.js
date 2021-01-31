// Packages
const mongoose = require('mongoose');
const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');

// Controllers
const user = require('./app/user');
const message = require('./app/message');
const avatar = require('./app/avatar');
const socket = require('./socket');

process.on('unhandledRejection', error => {
    console.trace(error);
});

process.on('uncaughtException', error => {
    console.trace(error);
});

process.on('warning', warning => {
    console.trace(warning.name, warning.message);
});

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
message(app);
avatar(app);
socket.init(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(process.env.PORT, () => {
    console.log('Magic happens on: ' + process.env.PORT);
});
