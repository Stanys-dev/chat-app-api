const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    address: {type: String, required: false},
    postCode: {type: Number, required: false},
    phone: {type: Number, required: false},
    email: {type: String, required: true, unique: true, immutable: true},
    avatar: {data: Buffer, contentType: String}
});

let model = mongoose.model('user', schema);

module.exports = model;
