const mongoose = require('mongoose')

var tokenSchema = new mongoose.Schema({
  token: { type: String, default: "" },
});

var Token = mongoose.model('Token', tokenSchema , 'tokens');

module.exports = Token;