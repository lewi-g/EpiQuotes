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
// to ensure  ata from one test does not stick
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

describe('blog posts API resource', function () {

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

  describe('* endpoint', function () {
    it('should respond with error message', function () {
      return Quotes
        .then(res => {
          res.should.have.status(204);
        });
    });
  });
});