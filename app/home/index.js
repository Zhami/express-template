var c                = require('../common')
  , e                = require('../errors')
  , Base             = c.Base
  , BaseRequest      = c.BaseRequest
  , NotFoundError    = e.NotFoundError
  , ApplicationError = e.ApplicationError
  , BadRequestError  = e.BadRequestError

// Home page
var Home = function Home () {
  Base.call(this, 'home')
}

Home.prototype.__proto__ = Base.prototype

module.exports = Home

Home.prototype.setupRequest = function (request, response, next) {
  return new HomeRequest(this, request, response, next)
}

Home.prototype.index = function (r) {
  r.render('index')
}


// Home requests
var HomeRequest = function HomeRequest (home, request, response, next) {
  BaseRequest.call(this, home, request, response, next)

  this.data =
    { title      : 'Welcome'
    , title_name : ''
    }
}

HomeRequest.prototype.__proto__ = BaseRequest.prototype

Home.HomeRequest = HomeRequest

HomeRequest.prototype.error = function (error) {
  if (  error instanceof NotFoundError
     || error instanceof ApplicationError
     || error instanceof BadRequestError) {
    return this.render('error', { error : error }, true)
  }

  var err   = new ApplicationError(error.message)
  err.stack = error.stack

  this.render('error', { error : err }, true)
}

HomeRequest.prototype.setTitle = function (title) {
  this.data.title      = title + ' - ' + this.data.title
  this.data.title_name = title

  return this
}
