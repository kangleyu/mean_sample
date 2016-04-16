// how to run - $ NODE_ENV=test mocha --reporter spec app/tests

var app = require('../../server.js');
var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Article = mongoose.model('Article');

var user, article;

describe('Article Controller Unit Test:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      article = new Article({
        title: 'Article Title',
        content: 'Article Content',
        user: user
      });
      
      article.save(function (err) {
        done();
      });
    });
  });

  describe('Testing the GET methods', function () {
    it('Should be able to get the list of articles', function (done) {
      request(app).get('/api/articles/').set('Accept', 'application/json')
      .expect('Content-Type',/json/)
      .expect(200)
      .end(function (err, res) {
        res.body.should.be.an.Array().and.have.lengthOf(1);
        res.body[0].should.have.property('title', article.title);
        res.body[0].should.have.property('content', article.content);
        done();
      });
    });

    it('Should be able to get the specific article', function (done) {
      request(app).get('/api/articles/' + article.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.body.should.be.an.Object().and.have.property('title', article.title);
        res.body.should.be.an.Object().and.have.property('content', article.content);
        done();
      })
    });
  });

  afterEach(function (done) {
    Article.remove(function () {
      User.remove(function () {
        done();
      });
    });
  });
});