'use strict';

const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
  source: {
    firstName: String,
    lastname: String
  },
  quote: String,
  // tag: {} vs []
  timeStamp: { type: Date, default: Date.now },

})


const Quotes = mongoose.model('Quotes', quoteSchema);
// const User = mongoose.model('User', UserSchema);

module.exports = {Quotes};
