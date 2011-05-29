var aid = require('express-aid')

exports.setup = function (app, dirname) {
  aid = aid.createAid(app, dirname)

  exports.Base           = aid.Base
  exports.BaseRequest    = aid.BaseRequest
  exports.load           = aid.load
  exports.loadController = aid.loadController

  aid.BaseRequest.DEFAULT_DATA =
    { title      : 'USO Tools Translate'
    , title_name : ''
    }

  var BaseRequestProto = aid.BaseRequest.prototype
    , BaseProto        = aid.Base.prototype

  BaseRequestProto.setTitle = function (title) {
    this.data.title      = title + ' - ' + this.data.title
    this.data.title_name = title

    return this
  }

  BaseRequestProto.error = function (error) {
    if (  error instanceof NotFoundError
       || error instanceof ApplicationError) {
      return this.render('error', { error : error }, true)
    }

    this.next(error)
  }
}

var NotFoundError = function NotFoundError (path) {
  this.name = 'NotFoundError'
  this.code = 404

  if (path) {
    Error.call(this, '"' + path + '" could not be found.')
  } else {
    Error.call(this, 'Page not found')
  }
  Error.captureStackTrace(this, arguments.callee)
}

NotFoundError.prototype.__proto__ = Error.prototype

exports.NotFoundError = NotFoundError

var ApplicationError = function ApplicationError (message) {
  this.name = 'ApplicationError'
  this.code = 500

  Error.call(this, message || 'An application error has occured.')
  Error.captureStackTrace(this, arguments.callee)
}

ApplicationError.prototype.__proto__ = Error.prototype

exports.ApplicationError = ApplicationError
