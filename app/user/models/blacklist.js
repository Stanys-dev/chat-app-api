const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    token: {type: String, required: true, unique: true},
    expiration: {type: Date, required: true, expires:1},
});

let model = mongoose.model('blacklist', schema);

module.exports = model;
