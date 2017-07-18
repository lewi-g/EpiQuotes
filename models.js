'use strict';

const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  source: {
    firstName: String,
    lastName: String
  },
  quote: String,
  tag: Array, 
  date: {type: String, default: 'unknown'},
  timeStamp: { type: Date, default: Date.now },

  upvotes: {type: Number, default: 0}
})



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

//user
//should push submitted quotes to array

const userSchema = mongoose.Schema({
  username: String,
  submittedQuotes: Array
  //password: 
})

userSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    username: this.username,
    submittedQuotes: this.submittedQuotes
  };
}



const Quotes = mongoose.model('Quotes', quoteSchema);
const User = mongoose.model('User', userSchema);

module.exports = Quotes;
//module.exports = User;