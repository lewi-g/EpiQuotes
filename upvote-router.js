// 'use strict';
// const express = require('express');
// const router = express.Router();

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

// const Quotes = require('./models/quote-model');


// //PUT for upvotes --- works only for one upvote at a time by accident but thats what we want??
// router.put('/:id', (req, res) => {
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {

//     res.status(400).json({
//       error: 'Request path id and request body id values must match'
//     });
//   } else {

//     const updated = {};
//     const updateableFields = ['upvotes'];
//     updateableFields.forEach(field => {
//       if (field in req.body) {
//         updated[field] = (req.body[field] + 1);
//       }
//     });

//     Quotes
//       .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
//       .exec()
//       .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
//       .catch(err => res.status(500).json({ message: 'Something went wrong' }));

//   }
// });



// module.exports = router;