'use strict';

//require('dotenv').config();
const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const bcrypt = require('bcrypt');

const { DATABASE_URL, PORT } = require('./config');
const { Quotes } = require('./models');
const { User } = require('./models');
// const Quotes = require('models/quote-model');
// const User = require('models/user-model');

const app = express();

const quotesRouter = require('./quote-router');
//const upvoteRouter = require('./upvote-router');
const userRouter = require('./user-router');

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));


const basicStrategy = new BasicStrategy(function (username, password, done) {
  let user;
  console.log(username, 'username');
  User
    .findOne({ username: username })
    .then(_user => {
      user = _user;
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      //console.log('bcrypt', bcrypt.compare(password, user.password));
      return bcrypt.compare(password, user.password);
      //   password === user.password;
    })
    .then(isValid => {
      console.log('isValid', isValid);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password' });
      }
      else {
        return done(null, user);
      }
    });
});

passport.use(basicStrategy);
const authenticate = passport.authenticate('basic', { session: false });


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/quotes', quotesRouter);
//app.use('/upvotes', upvoteRouter);
app.use('/users', userRouter);

mongoose.Promise = global.Promise;

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

///  user endpoints ++++================================




let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}


module.exports = { runServer, app, closeServer };