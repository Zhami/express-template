var aid = require('express-aid')

exports.setup = function (app, dirname) {
  aid = aid.createAid(app, dirname)

  exports.Base           = aid.Base
  exports.BaseRequest    = aid.BaseRequest
  exports.load           = aid.load
  exports.loadController = aid.loadController
}

var NotFoundError = function NotFoundError (message) {
  this.name = 'NotFound'
  this.code = 404

  Error.call(this, message)
  Error.captureStackTrace(this, arguments.callee)
}

NotFoundError.prototype.__proto__ = Error.prototype

exports.NotFoundError = NotFoundError
