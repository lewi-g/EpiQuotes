'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { User } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedUserData() {
  console.info('seeding User data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      userName: faker.internet.userName(),
      password: faker.internet.userName(),
      // hashPassword: 
      email: faker.internet.email(),
      myQuotes: []
    });
  }
  return User.insertMany(seedData);
}

describe('User', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedUserData();
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  it('should list all users on GET', function () {
    return chai.request(app)
      .get('/users')
      .then(function (res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['userName', 'email', 'myQuotes'];
        res.body.forEach(function (item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
          item._id.should.not.be.null;
          item.userName.should.be.a('string');
          item.email.should.be.a('string');
          item.myQuotes.should.be.a('array');
          //   item.password.should.be.a('string');
          //   item.hashPassord.should.be.a('string');
        });
      });
  });

  // it('should create a new user on POST', function () {
  //   const newItem = {
  //     userName: faker.internet.userName(),
  //     // password might have to be something I know the hash to
  //     password: faker.internet.userName(),
  //     email: faker.internet.email()
  //     // myQuotes: []
  //   };
  //   return chai.request(app)
  //     .post('/users')
  //     .send(newItem)
  //     .then(function (res) {
  //       console.log("RESPONSE BODY",res.body);
  //       res.should.have.status(201);
  //       res.should.be.json;
  //       res.body.should.be.a('object');
  //       res.body.should.include.keys('userName', 'password', 'email');
  //       res.body.id.should.not.be.null;
  //     });
  // });
  it('should delete items by Id', function () {
    let id;
    return User
      .findOne()
      .then(function (user) {
        id = user._id;
        return chai.request(app)
          .delete(`/users/${id}`)
          .auth(user.userName, user.password);
      })
      .then(function (res) {
        res.should.have.status(204);
      });
  });


});