const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const io = require('../../../socket');

let schema = new Schema({
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    address: {type: String, required: false},
    postCode: {type: Number, required: false},
    phone: {type: Number, required: false},
    email: {type: String, required: true, unique: true, immutable: true},
    avatar: {data: Buffer, contentType: String}
}, {timestamps: true});

schema.pre('findOneAndUpdate', function () {
    if (this._conditions._id) io.send('user', {_id: this._conditions._id, ...this._update});
});

let model = mongoose.model('user', schema);

module.exports = model;
