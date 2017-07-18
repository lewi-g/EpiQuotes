'use strict';

const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);

module.exports = User;