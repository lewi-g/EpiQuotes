'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const quoteSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  source:  String,
  quote: String,
  // tag should be plural if it's several tags
  tag: Array, 
  date: {type: String, default: 'unknown'},
  timeStamp: { type: Date, default: Date.now },
});

quoteSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    timeStamp: this.timeStamp,
    source: this.source,
    tag: this.tag,
    quote: this.quote,
    date: this.date,
  };
};

const Quote = mongoose.model('Quote', quoteSchema);

module.exports.Quote = Quote;

