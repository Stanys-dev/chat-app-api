const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;
const Schema = mongoose.Schema;

let schema = new Schema({
    from: {type: ObjectId, ref: 'user', required: true, index: true},
    to: {type: ObjectId, ref: 'user', required: true, index: true},
    text: {type: String, required: true, index: true}
}, {timestamps: true});

schema.index({from: 1, to: 1}, {background: true});
schema.index({from: 1, to: 1, text: 1}, {background: true});

let model = mongoose.model('message', schema);

module.exports = model;
