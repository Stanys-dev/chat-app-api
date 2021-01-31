let io;

const Controller = {
    init: http => {
        io = require('socket.io')(http);

        io.on('connection', (socket) => {
            console.log('user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    },
    send: (topic, data) => {
        if (topic === 'message' && data.from.avatar && data.from.avatar.data) {
            const base64Str = data.from.avatar.data.toString('base64');

            data = JSON.parse(JSON.stringify(data));

            data.from.avatar.data = base64Str;
        } else if (topic === 'user' && data.avatar && data.avatar.data) {
            const base64Str = data.avatar.data.toString('base64');

            data = JSON.parse(JSON.stringify(data));

            data.avatar.data = base64Str;
        }

        io.emit(topic, JSON.stringify(data));
    }
};

module.exports = Controller;
