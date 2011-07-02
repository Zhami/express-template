var express     = require('express')
  , PageRequest = require('../common').PageRequest

// Common server config for all environments
module.exports = function (app) {
  app.set('views', app.VIEWS_PATH)
  app.set('view engine', 'jade')

  app.use(express.logger())

  app.use(express.bodyParser())
  app.use(express.methodOverride())

  app.use(require('stylus').middleware
    ( { src  : app.VIEWS_PATH
      , dest : app.PUBLIC_PATH
      }
    ))

  app.use(express.static(app.PUBLIC_PATH))
}
PageRequest.DEFAULT_DATA =
  { title      : 'express-template'
  , title_name : ''
  }
