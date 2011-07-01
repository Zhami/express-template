// Module dependencies.
var express       = require('express')
  , path          = require('path')
  , connect_redis = require('connect-redis')
  , net           = require('net')
  , repl          = require('repl')
  , db            = require('./db')
  , common        = require('./common')

var app         = module.exports = express.createServer()
  , RedisStore  = connect_redis(express)
  , VIEWS_PATH  = path.resolve(path.join(__dirname, 'views'))
  , PUBLIC_PATH = path.resolve(path.join(__dirname, 'public'))
  , REPL_PATH   = path.resolve(path.join(__dirname, '..', 'repl'))

// Configuration
app.configure(function(){
  app.set('views', VIEWS_PATH)
  app.set('view engine', 'jade')

  app.use(express.logger())

  app.use(express.bodyParser())
  app.use(express.methodOverride())

  app.use(require('stylus').middleware
    ( { src  : VIEWS_PATH
      , dest : PUBLIC_PATH
      }
    ))

  app.use(express.static(PUBLIC_PATH))

  app.use(app.router)

  // Routes
  require('./config/routes')(app)
})

app.configure('development', function(){
  var redis_store = new RedisStore()

  app.use(express.cookieParser())
  app.use(express.session({ secret: 'test', store: redis_store }))

  // Local mongoose server
  db.open('mongodb://localhost/test')
})

app.configure('production', function(){
  var redis_store = new RedisStore()

  app.use(express.cookieParser())
  app.use(express.session({ secret: 'test', store: redis_store }))

  // Local mongoose server
  db.open('mongodb://localhost/test')
})

// REPL
var repl_server = net.createServer(function (socket) {
  var r = repl.start('express-' + process.pid + '> ', socket)

  r.context.common = common
  r.context.app    = app
  r.context.db     = db
  r.context.async  = require('async-array').async

}).listen(REPL_PATH + '/' + process.pid + '.sock')
