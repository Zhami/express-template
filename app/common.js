var aid = require('express-aid')
  , app = require('./')

// Get some aid
module.exports = aid.createAid(app, __dirname)
