// Models
const User = require('../models/user');
const Blacklist = require('../models/blacklist');

// Packages
const to = require('await-to-js').default;
const ObjectId = require('mongoose').Types.ObjectId;
const Helper = require('../../helper');

const Controller = {
    create: async ({username, password, address, postCode, phone, email}) => {
        if (!username) throw 'Username is required field';
        if (!password) throw 'Password is required field';
        if (!email) throw 'Email is required field';

        const [existsErr, exists] = await to(User.findOne({$or: [{username}, {email}]}).select('username email -_id').lean());

        if (existsErr) throw existsErr;

        if (exists) {
            if (exists.username === username) throw 'Username is already taken';
            if (exists.email === email) throw 'Email is already taken';
        }

        return User.create({
            username,
            passwordHash: Helper.hash(password),
            address,
            postCode,
            phone,
            email
        });
    },
    getAll: () => {
        return User.find().select('-passwordHash -__v').lean();
    },
    getOne: id => {
        if (!id || !ObjectId.isValid(id)) throw 'Please provide user _id';
        return User.findById(id).select('-__v').lean();
    },
    update: async (id, {username, password, address, postCode, phone}) => {
        if (!id || !ObjectId.isValid(id)) throw 'Please provide user _id';

        let update = {};

        if (username) {
            const [existsErr, exists] = await to(User.exists({username, _id: {$ne: id}}));

            if (existsErr) throw existsErr;

            if (exists) throw 'Username is already taken';

            update.username = username;
        }

        if (password) update.passwordHash = Helper.hash(password);
        if (address) update.address = address;
        if (postCode) update.postCode = postCode;
        if (phone) update.phone = phone;

        return User.findByIdAndUpdate(id, update, {new: true});
    },
    delete: async user => {
        if (!user._id || !ObjectId.isValid(user._id)) throw 'Please provide user _id';

        try {
            await Blacklist.create({
                token: user.token,
                expiration: user.expiration
            });
        } catch (e) {
            throw e;
        }

        return User.findByIdAndDelete(user._id);
    }
};

module.exports = Controller;
