'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { DATABASE_URL } = require('../config');
const { Quotes } = require('../models');
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

function seedQuotesData() {
  console.info('seeding Quotes data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      source: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      quote: faker.lorem.sentence(),
      //content: faker.lorem.text()
    });
  }
  // this will return a promise
  return Quotes.insertMany(seedData);
}

describe('Quotes', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
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
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['source', 'quote'];
        res.body.forEach(function (item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should create a new item on POST', function () {
    const newItem = { quote: 'Oh, behave!', source: { firstName: 'Austin', lastName: 'Powers' } };
    return chai.request(app)
      .post('/quotes')
      .send(newItem)
      .then(function (res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'quote', 'source');
        res.body.id.should.not.be.null;
        //fail from previous examples (node-shopping-list-inegration-tests)
        //res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });

  it('should update PUT items', function () {
    const updateData = {
      quote: 'The name is Bond, lol',
      source: { firstName: 'James', lastName: 'Bond' }
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