var aid              = require('express-aid')
  , e                = require('./errors')
  , NotFoundError    = e.NotFoundError
  , ApplicationError = e.ApplicationError
  , BadRequestError  = e.BadRequestError

// Get some aid
exports = module.exports = aid.createAid(__dirname)

var BaseRequest = exports.BaseRequest
  , Base        = exports.Base


// Page that uses PageRequest for setupRequest
var Page = function Page (name) {
  Base.call(this, name)
}

Page.prototype.__proto__ = Base.prototype

exports.Page = Page

Page.prototype.setupRequest = function (request, response, next) {
  return new PageRequest(this, request, response, next)
}


// Page requests
var PageRequest = function PageRequest (page, request, response, next) {
  BaseRequest.call(this, page, request, response, next)

  this.data =
    { title      : 'Welcome'
    , title_name : ''
    }
}

PageRequest.prototype.__proto__ = BaseRequest.prototype

exports.PageRequest = PageRequest

// The request error handler. Renders the error template
// with a meaningful error object.
PageRequest.prototype.error = function (error) {
  if (  error instanceof NotFoundError
     || error instanceof ApplicationError
     || error instanceof BadRequestError) {
    return this._renderError(error)
  }

  var err   = new ApplicationError(error.message)
  err.stack = error.stack

  this._renderError(err)
}

PageRequest.prototype._renderError = function (error) {
  var r = this

  this.setTitle(error.name || 'Application Error')

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
PageRequest.prototype.setTitle = function (title) {
  this.data.title      = title + ' - ' + this.data.title
  this.data.title_name = title

  return this
}
