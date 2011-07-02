var aid = require('express-aid')
  , db  = require('./db')

// Get some aid
exports = module.exports = aid.createAid(
  { controllers : __dirname + '/controllers'
  , models      : __dirname + '/models'
  , mongoose    : db
  }
)
