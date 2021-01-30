// Models
const Message = require('../models/message');

// Packages
const Helper = require('../../helper');
const ObjectId = require('mongoose').Types.ObjectId;

const Controller = {
    create: async (from, messageReceiver, text) => {
        if (!from || !ObjectId.isValid(from)) throw 'Please provide sender\'s _id';
        if (!messageReceiver || !ObjectId.isValid(messageReceiver)) throw 'Please provide message receiver\'s _id';
        if (!text || typeof text !== 'string') throw 'Please provide message\'s text';

        return Message.create({
            from,
            to: messageReceiver,
            text
        });
    },
    get: async (users, text) => {
        if (!users) throw 'Please provide users _id\'s';
        users = JSON.parse(users);
        if (users.length === 0) throw 'Please provide users _id\'s';
        if (users.filter(u => ObjectId.isValid(u)).length !== 2) throw 'Please provide valid users _id\'s';
        let query = {
            from: {$in: users},
            to: {$in: users}
        };

        if (text) query.text = {$regex: Helper.stringRegexOverride(text), $options: 'i'};
        return Message.find(query).select('-__v').lean();
    },
    update: async (id, text) => {
        if (!id || !ObjectId.isValid(id)) throw 'Please provide message _id';

        return Message.findByIdAndUpdate(id, {text}, {new: true});
    },
    delete: async id => {
        if (!id || !ObjectId.isValid(id)) throw 'Please provide user _id';

        return Message.findByIdAndDelete(id);
    }
};

module.exports = Controller;
