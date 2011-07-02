var express    = require('express')
  , db         = require('../db')
  , RedisStore = require('connect-redis')(express)

// Development settings
module.exports = function (app) {
  var redis_store = new RedisStore()

  app.use(express.cookieParser())
  app.use(express.session({ secret: 'test', store: redis_store }))

  // Local mongoose server
  db.open('mongodb://localhost/test')
}
