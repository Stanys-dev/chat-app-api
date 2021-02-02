const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./user/models/user');
const config = require('../config');
const Blacklist = require('./user/models/blacklist');

const Controller = {
    hash: password => {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(password, salt);
    },
    validatePassword: (password, hashedPassword) => {
        return bcrypt.compareSync(password, hashedPassword);
    },
    stringRegexOverride: (str) => {
        return str.split('(').join('\\(').split(')').join('\\)').split('+').join('\\+').split('|').join('\\|');
    },
    verifyToken: function (token) {
        try {
            const decoded = jwt.verify(token, config.secret);
            return {...decoded, expired: false};
        } catch (err) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    const decoded = jwt.decode(token);
                    if (decoded) {
                        return {...decoded, expired: true};
                    } else return false;
                } else return false;
            }
        }
    },
    tokenValidation: async function (req, res, next) {
        let token = req.headers['x-access-token'];
        if (token) {
            req.token = token;
            try {
                const decodedToken = Controller.verifyToken(req.token, next);
                if (!decodedToken) {
                    res.status(401).json('User does not have  token');
                } else if (decodedToken.expired) {
                    res.status(401).json('User\'s token expired');
                } else {
                    let blackListed = await Blacklist.exists({token});

                    if (blackListed) return res.status(401).json('User\'s token expired');
                    let user = await User.findOne({
                        _id: decodedToken.id
                    }).lean();

                    if (!user) return res.status(400).json('User doesn\'t exist');

                    user.token = req.token;
                    user.expiration = decodedToken.exp * 1000;
                    req.user = user;
                    next();
                }
            } catch (err) {
                console.trace(err);
                res.status(400).json({message: 'Error with your token', error: err.message});
            }
        } else {
            res.status(401).json('User does not have  token');
        }
    }
};

module.exports = Controller;
