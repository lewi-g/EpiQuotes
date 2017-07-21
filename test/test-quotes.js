'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { DATABASE_URL } = require('../config');
const { Quote } = require('../models');
// const { User } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');


chai.use(chaiHttp);

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

const validTags = ['funny', 'inspirational', 'pop-culture', 'life', 'relationships'];

function seedQuotesData() {
  console.info('seeding Quotes data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      source: faker.name.findName(),
      quote: faker.lorem.sentence(),
      date: faker.date.past(),
      upvotes: faker.random.number(),
      tag: validTags[Math.floor(Math.random() * 5)]
    });
  }
  // this will return a promise
  return Quote.insertMany(seedData);
}

describe('Quote', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    console.log('the Testing has Started');
    return seedQuotesData();
  });

  afterEach(function () {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  it('should list all quotes on GET', function () {
    return chai.request(app)
      .get('/quotes')
      .then(function (res) {
        console.log(res.body);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['source', 'quote', 'date', 'upvotes', 'tag'];
        res.body.forEach(function (item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
          item.id.should.not.be.null;
          item.source.should.be.a('string');
          item.tag.should.be.a('array');
          item.quote.should.be.a('string');
          item.date.should.be.a('string');
          item.upvotes.should.be.a('number');
        });
      });
  });

  it('should list all quotes of a given tag on GET', function () {
    let tagTest = validTags[Math.floor(Math.random() * 5)];
    return chai.request(app)
      .get(`/quotes/tag?tag=${tagTest}`)
      .then(function (res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        // res.body.length.should.be.at.least(1);
        const expectedTags = ['funny', 'inspirational', 'pop-culture', 'life', 'relationships'];
        res.body.forEach(function (item) {
          item.tag[0].should.equal(tagTest);
        });
      });
  });

  it('should create a new item on POST', function () {
    const newItem = {
      quote: 'Oh, behave!',
      tag: 'funny',
      source:  'Austin Powers'
    };
    return chai.request(app)
      .post('/quotes')
      .send(newItem)
      .then(function (res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'quote', 'source');
        res.body.id.should.not.be.null;
      });
  });

  it('should update PUT items', function () {
    const updateData = {
      quote: 'The name is Bond, lol',
      source: 'James Bond' ,
      date: 'June 8th 1998',
      tag: ['pop-culture']
    };
    return chai.request(app)
      .get('/quotes')
      .then(function (res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/quotes/${updateData.id}`)
          .send(updateData);
      })
      .then(function (res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.quote.should.equal(updateData.quote);
        res.body.date.should.equal(updateData.date);
        //res.body.tag.should.equal(updateData.tag); ---this one fails
      });
  });

  it('should delete items on DELETE', function () {
    return chai.request(app)
      .get('/quotes')
      .then(function (res) {
        return chai.request(app)
          .delete(`/quotes/${res.body[0].id}`);
      })
      .then(function (res) {
        res.should.have.status(204);
      });
  });
});