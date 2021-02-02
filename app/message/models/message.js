const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;
const Schema = mongoose.Schema;
const io = require('../../../socket');

let schema = new Schema({
    from: {type: ObjectId, ref: 'user', autopopulate: true, required: true, index: true},
    to: {type: ObjectId, ref: 'user', autopopulate: true, required: true, index: true},
    text: {type: String, required: true, index: true}
}, {timestamps: true});

schema.plugin(require('mongoose-autopopulate'));

schema.index({from: 1, to: 1}, {background: true});
schema.index({from: 1, to: 1, createdAt: -1}, {background: true});

schema.post('save', function () {
    io.send('message', this);
});

let model = mongoose.model('message', schema);

module.exports = model;
