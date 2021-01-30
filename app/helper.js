const md5 = require('md5');

const Controller = {
    hash: password => {
        return md5(password);
    },
    stringRegexOverride: function (str) {
        return str.split('(').join('\\(').split(')').join('\\)').split('+').join('\\+').split('|').join('\\|');
    }
};

module.exports = Controller;
