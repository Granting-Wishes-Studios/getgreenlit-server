  const express = require('express');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const cors = require('cors');
  const redis = require('redis');
  const path = require('path');
  const connectRedis = require('connect-redis');
  const errorhandler = require('errorhandler');

  const config = require('./config/config')[process.env.NODE_ENV || 'development'];

function getClientIp(req) { 
  var ipAddress;
  // Amazon EC2 / Heroku workaround to get real client IP
  var forwardedIpsStr = req.header('x-forwarded-for');
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // Ensure getting client IP address still works in
    // development environment
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};




var isProduction = process.env.NODE_ENV === 'production';

/*
const RedisStore = connectRedis(session);

//Configure redis client
const redisClient = redis.createClient({
  socket: {
    host: 'localhost',
    port: 6379
  }
})
redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});
*/
// Create global app object
var app = express();
const corsOptions = {
    origin: config.cor_origin,
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
//this is
app.use(cors(corsOptions));

app.use(session({
  //store: new RedisStore({ client: redisClient }),
  secret:  config.secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
      //secure: false, // if true only transmit cookie over https
      httpOnly: true, // if true prevent client side JS from reading the cookie 
      maxAge: 1000 * 60 * 10 // session max age in miliseconds
  }
}))


// temporarly allowList certain IPs while developing to prevent attacks
/* app.use((req, res, next) => {
  const validIps = process.env.IP_ALLOW_LIST.split(",");
  const ip = getClientIp(req);

  if (validIps.includes(ip)) {
    console.log(`${ip} allowed`);
    next();
  } else {
    console.log(`${ip} denied`);
    res.status(401).json({
      msg: 'Unauthorized'
    });
    return;
  }
}) */

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(require('method-override')());
// app.use(express.static(__dirname + '/public'));


if (!isProduction) {
  app.use(errorhandler());
}

//Routes
require('./routes')(app);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});


//sync sequelize models
const db = require('./database/models');
db.sequelize.sync()
    .then( data => {console.log('db sync was successful.')})
    .catch( err => {console.log('db sync failed ', err.message)})

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3001, function () {
  console.log('Listening on port ' + server.address().port);
});