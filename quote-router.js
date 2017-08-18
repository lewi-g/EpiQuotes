'use strict';
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Quote } = require('./models');

//get all quotes

router.get('/', (req, res) => {
  console.log('the tag is ' + req.query.tag);
  
  Quote
    .find().sort({timeStamp: 'desc'})
    .exec()
    .then(quote => {
      res.json(quote.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

//get quote by tag
router.get('/tag/', (req, res) => {
  const filters = {};
  const queryableFields = ['tag'];

  queryableFields.forEach(field => {
    if (req.query[field]) {
      filters[field] = req.query[field];
    }
  });
  Quote
    .find(filters).sort({timeStamp: 'desc'})
    .exec()
    .then(quote => 
      res.json(quote.map(post => post.apiRepr()))
    )
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

//app.get source

router.post('/', (req, res) => {
  console.log('req.body is....');
  console.log(req.body);

  const userSuppliedTag = req.body.tag;
  const validTags = ['funny', 'inspirational', 'pop-culture', 'life', 'relationships'];
  const requiredFields = ['quote', 'source', 'tag'];

  let message;
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (!validTags.includes(userSuppliedTag)) {
    message = `'${userSuppliedTag}' is not a valid tag`;
    res.status(400).send(message);
  }

  Quote
    .create({
      quote: req.body.quote,
      source: req.body.source,
      tag: req.body.tag,
      date: req.body.date,
    })
    .then(quote => res.status(201).json(quote.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

//PUT -- the question mark is used for upvotes and other PUTs should work fine
router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  } else {
    let updated = {};
    const updateableFields = ['quote', 'source', 'date', 'tag'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });

    Quote
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .exec()
      .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  }
});

//DELETE
router.delete('/:id', (req, res) => {
  Quote
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({ message: 'the quote was succesfully deleted' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


module.exports = router;