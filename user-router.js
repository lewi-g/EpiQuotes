'use strict';
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const bcrypt = require('bcrypt');
const { User } = require('./models');

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
      console.log('bcrypt', bcrypt.compare(password, user.password));
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

//GET
router.get('/', (req, res) => {
  // console.log('in user get endpoint');
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
router.put('/:id', authenticate, (req, res) => {
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
      .then(updatedUser => res.status(201).json(updatedUser.apiRepr()))
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  }
});

// //DELETE
router.delete('/:id', authenticate, (req, res) => {
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