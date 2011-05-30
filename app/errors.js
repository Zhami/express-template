// Different errors for different causes
var NotFoundError = function NotFoundError (path) {
  Error.call(this)

  this.name = 'Not Found'
  this.code = 404

  if (path) {
    this.message = '"' + path + '" could not be found.'
  } else {
    this.message = 'Page not found'
  }

  Error.captureStackTrace(this, arguments.callee)
}

NotFoundError.prototype.__proto__ = Error.prototype

exports.NotFoundError = NotFoundError


var ApplicationError = function ApplicationError (message) {
  Error.call(this)

  this.name = 'Application Error'
  this.code = 500

  this.message = message || 'An application error has occured.'

  Error.captureStackTrace(this, arguments.callee)
}

ApplicationError.prototype.__proto__ = Error.prototype

exports.ApplicationError = ApplicationError


var BadRequestError = function BadRequestError (message) {
  Error.call(this)

  this.name = 'Bad Request'
  this.code = 400

  this.message = message || 'You have sent a bad request.'

  Error.captureStackTrace(this, arguments.callee)
}

BadRequestError.prototype.__proto__ = Error.prototype

exports.BadRequestError = BadRequestError
