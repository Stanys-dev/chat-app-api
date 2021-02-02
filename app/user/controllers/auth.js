const User = require('../models/user');
const Helper = require('../../helper');
const config = require('../../../config');
const Blacklist = require('../models/blacklist');

const to = require('await-to-js').default;
const jwt = require('jsonwebtoken');

const Controller = {
    register: async function ({username, password, address, postCode, phone, email}) {
        return User.create({
            username,
            passwordHash: Helper.hash(password),
            address,
            postCode,
            phone,
            email
        });
    },
    login: async function ({email, password}) {

        let [userErr, user] = await to(User.findOne({email}).lean().select('-__v'));

        if (userErr) throw userErr;

        if (user) {
            let isUserAuthenticated = Helper.validatePassword(password, user.passwordHash);

            if (isUserAuthenticated) {
                user.token = jwt.sign(
                    {
                        id: user._id
                    },
                    config.secret,
                    {
                        expiresIn: '1d'
                    }
                );

                return user;
            } else {
                throw 'Password is incorrect';
            }
        } else throw 'Email is incorrect';
    },
    logout: function ({token, expiration}) {
        return Blacklist.create({
            token,
            expiration
        });
    }
};

module.exports = Controller;
