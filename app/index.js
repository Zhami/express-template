// Module dependencies.
var express       = require('express')
  , path          = require('path')
  , net           = require('net')
  , repl          = require('repl')
  , common        = require('./common')
  , db            = require('./db')
  , util          = require('util')

var app = module.exports = express.createServer()

app.VIEWS_PATH  = path.resolve(path.join(__dirname, 'views'))
app.PUBLIC_PATH = path.resolve(path.join(__dirname, 'public'))
app.REPL_PATH   = path.resolve(path.join(__dirname, '..', 'repl'))

// Configuration
app.configure(function(){
  // Common
  require('./config/common')(app)
  // Routes
  require('./config/routes')(app)
})

app.configure('development', function(){
  require('./config/development')(app)
})

app.configure('production', function(){
  require('./config/production')(app)
})

// REPL
var repl_server = net.createServer(function (socket) {
  var r = repl.start('express-' + process.pid + '> ', socket)

  r.context.common = common
  r.context.app    = app
  r.context.db     = db
  r.context.async  = require('async-array').async
  r.context.puts   = function () {
    var args = [].slice.call(arguments).map(function (item) {
      return util.inspect(item)
    })
    socket.write(args.join(' ') + '\n')
  }

}).listen(app.REPL_PATH + '/' + process.pid + '.sock')
