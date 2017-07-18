'use strict';

const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
  source: {
    firstName: String,
    lastName: String
  },
  quote: String,
  // tag: {} vs []
  timeStamp: { type: Date, default: Date.now },

});

quoteSchema.virtual('sourceName').get(function() {
  return `${this.source.firstName} ${this.source.lastName}`.trim();
});

quoteSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    source: this.sourceName,
    quote: this.quote
  };
};

//user
//should push submitted quotes to array

const Quotes = mongoose.model('Quotes', quoteSchema);
// const User = mongoose.model('User', UserSchema);

module.exports = {Quotes};
