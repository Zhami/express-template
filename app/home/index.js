var c                = require('../common')
  , e                = require('../errors')
  , HomeRequest      = require('./request')
  , Base             = c.Base
  , BaseRequest      = c.BaseRequest
  , NotFoundError    = e.NotFoundError
  , ApplicationError = e.ApplicationError
  , BadRequestError  = e.BadRequestError

// Home page
var Home = function Home () {
  Base.call(this, 'home')
}

// Inherit from Base and export
Home.prototype.__proto__ = Base.prototype

module.exports = Home
// This gets called on every request to the home controller
// We overwrite the base request handler as we want to use our
// own request object with helpers like setTitle.
Home.prototype.setupRequest = function (request, response, next) {
  return new HomeRequest(this, request, response, next)
}

// The home page
Home.prototype.index = function (r) {
  r.setTitle('It is working!')
  r.render('index')
}

// 404 Page
Home.prototype.notFound = function (r) {
  r.error(new NotFoundError(r.request.url))
}
