var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var config = require('./config');
var flash = require('connect-flash');
var passport = require('passport');
var MongoStore = require('connect-mongo')({ session: session });

module.exports = function(db) {
  var app = express();
  // wrapping express with http,
  // then we can listen for socket.io
  var server = http.createServer(app);
  var io = socketio.listen(server);

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // config for using mongodb for persist session data
  var mongoStore = new MongoStore({
    mongooseConnection: db.connection
  });

  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: mongoStore
  }));

  app.set('views', './app/views');
  app.set('view engine', config.viewEngine);

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  require('../app/routes/index.server.routes')(app);
  require('../app/routes/users.server.routes')(app);
  require('../app/routes/articles.server.routes')(app);

  require('./socketio')(server, io, mongoStore);

  app.use(express.static('./public'));

  return server;
};