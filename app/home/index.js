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

// The request error handler. Renders the error template
// with a meaningful error object.
HomeRequest.prototype.error = function (error) {
  if (  error instanceof NotFoundError
     || error instanceof ApplicationError
     || error instanceof BadRequestError) {
    return this._renderError(error)
  }

  var err   = new ApplicationError(error.message)
  err.stack = error.stack

  this._renderError(err)
}

HomeRequest.prototype._renderError = function (error) {
  var r = this

  this.setTitle(error.message || 'Application Error')

  return this.render
    ( 'error'
    , { error : error }
    , function (render_error, string) {
        if (render_error) {
          return r.response.send('Error occured during page render.', 500)
        }

        r.response.send(string, error.code || 500)
      }
    , true
    )
}

// Set the page title.
// A common variable that gets used on most templates
HomeRequest.prototype.setTitle = function (title) {
  this.data.title      = title + ' - ' + this.data.title
  this.data.title_name = title

  return this
}
