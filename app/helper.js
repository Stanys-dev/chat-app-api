const md5 = require('md5');

const Controller = {
    hash: password => {
        return md5(password);
    }
};

module.exports = Controller;
