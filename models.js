'use strict';

const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  source: {
    firstName: String,
    lastName: String
  },
  quote: String,
  // tag should be plural if it's several tags
  tag: Array, 
  date: {type: String, default: 'unknown'},
  timeStamp: { type: Date, default: Date.now },
  upvotes: {type: Number, default: 0}
});

quoteSchema.virtual('sourceName').get(function() {
  return `${this.source.firstName} ${this.source.lastName}`.trim();
});

quoteSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    source: this.sourceName,
    tag: this.tag,
    quote: this.quote,
    date: this.date,
    upvotes: this.upvotes
  };
};

const Quotes = mongoose.model('Quotes', quoteSchema);

module.exports.Quotes = Quotes;

//user
//should push submitted quotes to array
const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  //my quotes will be an array of ids that match the id of the quotes
  myQuotes: Array 
});

userSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    myQuotes: this.myQuotes
  };
};


const User = mongoose.model('User', userSchema);

module.exports.User = User;