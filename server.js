process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');

var db = mongoose();
var app = express(db);
var passport = passport();

app.listen(8080);

module.exports = app;

console.log('Server is running @ 8080 ...');