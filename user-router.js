'use strict';
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { User } = require('./models');

//GET
router.get('/', (req, res) => {
  console.log('in user get endpoint');
  User
    .find()
    //.exec()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.post('/', (req, res) => {
  console.log(req.body.username);
  const requiredFields = ['username', 'password', 'email'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  User
    .create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      myQuotes: req.body.myQuotes
    })
    .then(response => res.status(201).json(response.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal error. Can\'t add user' });
    });

});

//PUT
router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {

    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  } else {

    const updated = {};
    const updateableFields = ['username'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });

    User
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .exec()
      .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));

  }
});

// //DELETE
router.delete('/:id', (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({ message: 'the user was succesfully deleted' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


module.exports = router;