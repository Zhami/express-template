// Module dependencies.
var express    = require('express')
  , mongoose   = require('mongoose')
  , path       = require('path')
  , RedisStore = require('connect-redis')
  , net        = require('net')
  , repl       = require('repl')

require('express-mongoose')

var app         = module.exports = express.createServer()
  , VIEWS_PATH  = path.resolve(path.join(__dirname, '..', 'views'))
  , PUBLIC_PATH = path.resolve(path.join(__dirname, '..', 'public'))
  , REPL_PATH   = path.resolve(path.join(__dirname, '..', 'repl'))

// Configuration
app.configure(function(){
  app.set('views', VIEWS_PATH)
  app.set('view engine', 'jade')

  app.use(express.logger())

  app.use(express.bodyParser())
  app.use(express.methodOverride())

  app.use(require('stylus').middleware({ src: PUBLIC_PATH }))

  app.use(express.static(PUBLIC_PATH))

  app.use(app.router)
})

app.configure('development', function(){
  var redis_store = new RedisStore()

  app.use(express.cookieParser())
  app.use(express.session({ secret: 'test', store: redis_store }))

  // Local mongoose server
  mongoose.connect('mongodb://localhost/test')
})

app.configure('production', function(){
  var redis_store = new RedisStore()

  app.use(express.cookieParser())
  app.use(express.session({ secret: 'test', store: redis_store }))

  // Local mongoose server
  mongoose.connect('mongodb://localhost/test')
})

// Routes
require('./routes')(app)

// REPL
var repl_server = net.createServer(function (socket) {
  var r = repl.start('express-' + process.pid + '> ', socket)

  r.context.common   = require('./common')
  r.context.app      = app
  r.context.mongoose = mongoose

}).listen(REPL_PATH + '/' + process.pid + '.sock')
