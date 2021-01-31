// Models
const User = require('../../user/models/user');

// Packages
const ObjectId = require('mongoose').Types.ObjectId;
const to = require('await-to-js').default;
const fs = require('fs');

const Controller = {
    add: async (id, avatarPath, contentType) => {
        if (!id || !ObjectId.isValid(id)) throw 'Please provide user _id';
        if (!avatarPath) throw 'Please provide user avatar';

        return User.findByIdAndUpdate(id, {avatar: {data: fs.readFileSync(avatarPath), contentType}}, {new: true});
    },
    get: async (id) => {
        if (!id || !ObjectId.isValid(id)) throw 'Please provide user _id';

        const [userErr, user] = await to(User.findById(id).select('avatar').lean());

        if (userErr) throw userErr;

        if (!user) throw 'Incorrect user _id';
        else return user.avatar;
    },
    delete: async id => {
        if (!id || !ObjectId.isValid(id)) throw 'Please provide user _id';

        return User.findByIdAndUpdate(id, {avatar: null});
    }
};

module.exports = Controller;
