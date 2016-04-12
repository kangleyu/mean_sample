var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var config = require('./config');
var flash = require('connect-flash');
var passport = require('passport');

module.exports = function () {
  var app = express();
  
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(compress());
  }
  
  app.use(bodyParser.urlencoded({ extended:true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));
  
  app.set('views', './app/views');
  app.set('view engine' , 'ejs');
  
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  require('../app/routes/index.server.routes')(app);
  require('../app/routes/users.server.routes')(app);
  
  app.use('/users/users.client.module.js', express.static(__dirname + '/public/users/users.client.module.js'));
  app.use(express.static('./public'));
  return app;
};