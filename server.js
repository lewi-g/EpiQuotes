'use strict';

const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const { DATABASE_URL, PORT } = require('./config');
const Quotes = require('./models');
//const { User } = require('./models');

const app = express();

const quotesRouter = require('./quote-router');
const upvoteRouter = require('./upvote-router');
//const userRouter = require('./user-router');

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/quotes', quotesRouter);
app.use('/upvotes', upvoteRouter);
//app.use('/users', userRouter);



mongoose.Promise = global.Promise;



app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
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