// Models
const Message = require('../models/message');

// Packages
const Helper = require('../../helper');
const ObjectId = require('mongoose').Types.ObjectId;
const to = require('await-to-js').default;

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
    get: async (authorisedUser, friend, text) => {
        if (!friend) throw 'Please provide friend\'s _id';
        if (!authorisedUser) throw 'Please provide token';

        let query = {
            from: {$in: [friend, authorisedUser]},
            to: {$in: [friend, authorisedUser]}
        };

        if (text) query.text = {$regex: Helper.stringRegexOverride(text), $options: 'i'};
        // Because this query by default use index {from:1} I added hint. Regex with case insensitive option doesn't support index, that's why hint doesn't include text index.
        return Message.find(query).sort({createdAt: 1}).hint({from: 1, to: 1, createdAt: -1}).select('-__v').lean();
    },
    getUsersChats: async (_id) => {
        const [messagesErr, messages] = await to(Message.find({$or: [{from: _id}, {to: _id}]}).sort({createdAt: -1}).hint({
            from: 1,
            to: 1,
            createdAt: -1
        }).select('-__v'));

        if (messagesErr) throw messagesErr;

        const usersSet = new Set();
        const chats = [];

        for (const message of messages) {
            const from = message.from._id.toString();
            const receiver = message.to._id.toString();
            if (usersSet.has(from) && usersSet.has(receiver)) continue;
            usersSet.add(from);
            usersSet.add(receiver);

            chats.push(message);
        }

        return chats;
    },
    update: async (user, id, text) => {
        if (!id || !ObjectId.isValid(id)) throw 'Please provide message _id';

        return Message.findOneAndUpdate({from: user, _id: id}, {text}, {new: true});
    },
    delete: async (user, id) => {
        if (!id || !ObjectId.isValid(id)) throw 'Please provide message _id';

        return Message.findOneAndDelete({from: user, _id: id});
    }
};

module.exports = Controller;
