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
}
