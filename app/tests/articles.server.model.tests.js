// how to run - $ NODE_ENV=test mocha --reporter spec app/tests

var app = require('../../server.js');
var should = require('should');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Article = mongoose.model('Article');

var user, article;

describe('Article Model Unit Test:', function () {
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

      done();
    });
  });

  describe('Testing the save method', function () {
    it('Should be able to save without problems', function () {
      article.save(function (err) {
        should.not.exist(err);
      });
    });

    it('Should not be able to save an article without a title', function () {
      article.title = '';
      article.save(function () {
        should.exist(err);
      });
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