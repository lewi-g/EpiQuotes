'use strict';

const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const { DATABASE_URL, PORT } = require('./config');
const { Quotes } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

app.get('/quotes', (req, res) => {
  Quotes
    .find()
    .exec()
    .then(quotes => {
      console.log('the test WORKED!');
      res.json(quotes.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

//app.get id

//app.get source

//currently returns last name as undefined
app.post('/quotes', (req, res) => {
  const requiredFields = ['quote', 'source'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Quotes
    .create({
      quote: req.body.quote,
      source: req.body.source
    })
    .then(quote => res.status(201).json(quote.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});

//PUT
app.put('/quotes/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {

    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  } else {

  const updated = {};
  const updateableFields = ['quote', 'source'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Quotes
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));

	}
});

//DELETE
app.delete('/quotes/:id', (req, res) => {
  Quotes
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({message: 'the quote was succesfully deleted'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});




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
};


module.exports = { runServer, app, closeServer }