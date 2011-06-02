// Different errors for different causes
var NotFoundError = function NotFoundError (path) {
  Error.call(this)

  this.name  = 'Page Not Found'
  this.code  = 404
  this.stack = Error.captureStackTrace(this, arguments.callee)

  if (path) {
    this.message = '"' + path + '" was not found.'
  } else {
    this.message = 'The page you were looking for was not found.'
  }
}

NotFoundError.prototype.__proto__ = Error.prototype

exports.NotFoundError = NotFoundError


var ApplicationError = function ApplicationError (message) {
  Error.call(this)

  this.name    = 'Application Error'
  this.code    = 500
  this.message = message || 'An application error has occured.'
  this.stack   = Error.captureStackTrace(this, arguments.callee)
}

ApplicationError.prototype.__proto__ = Error.prototype

exports.ApplicationError = ApplicationError


var BadRequestError = function BadRequestError (message) {
  Error.call(this)

  this.name    = 'Bad Request'
  this.code    = 400
  this.message = message || 'You have sent a bad request.'
  this.stack   = Error.captureStackTrace(this, arguments.callee)
}

BadRequestError.prototype.__proto__ = Error.prototype

exports.BadRequestError = BadRequestError
