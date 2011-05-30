var c    = require('./common')
  , load = c.load

// Routing
module.exports = function (app) {
  // Homepage
  app.get
    ( '/'
    , load('home')
    )
  app.get
    ( '/home'
    , load('home')
    )
  app.get
    ( '*'
    , load('home', 'notFound')
    )

  var home = c.loadController('home')

  app.error(function (error, request, response, next) {
    var r = home.setupRequest(request, response, next)
    r.error(error)
  })
}
