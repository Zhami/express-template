// Module dependencies.
var express    = require('express')
  , mongoose   = require('mongoose')
  , path       = require('path')
  , RedisStore = require('connect-redis')
  , common     = require('./common')
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

  app.use(app.router)

  app.use(express.static(PUBLIC_PATH))
})

app.configure('development', function(){
  var redis_store = new RedisStore()

  app.use(express.cookieParser())
  app.use(express.session({ secret: 'test', store: redis_store }))

  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })) 

  // Local mongoose server
  mongoose.connect('mongodb://localhost/test')
})

app.configure('production', function(){
  var redis_store = new RedisStore()

  app.use(express.cookieParser())
  app.use(express.session({ secret: 'test', store: redis_store }))

  app.use(express.errorHandler()) 

  // Local mongoose server
  mongoose.connect('mongodb://localhost/test')
})

// Setup common
common.setup(__dirname)

common.app      = common.Base.prototype.app      = app
common.mongoose = common.Base.prototype.mongoose = mongoose

common.BaseRequest.DEFAULT_DATA =
  { title      : 'Welcome'
  , title_name : ''
  }

common.BaseRequest.prototype.setTitle = function (title) {
  this.data.title      = title + ' - ' + this.data.title
  this.data.title_name = title

  return this
}

// Routes
require('./routes')(app)

// REPL
var repl_context =
  { common   : common
  , mongoose : mongoose
  , app      : app
  }

net.createServer(function (socket) {
  var repl_instance = repl.start('express-' + process.pid + '> ', socket)

  repl_instance.context = repl_context
}).listen(REPL_PATH + '/' + process.pid + '.sock')
