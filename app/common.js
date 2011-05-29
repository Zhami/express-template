var aid = require('express-aid')

exports.setup = function (app, dirname) {
  aid = aid.createAid(app, dirname)

  exports.Base           = aid.Base
  exports.BaseRequest    = aid.BaseRequest
  exports.load           = aid.load
  exports.loadController = aid.loadController
}

