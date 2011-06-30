var mongoose = require('mongoose')

// An example model

var User = new mongoose.Schema(
  { name      : String
  , age       : Number
  , gender    : String
  , location  : String
  , following : [mongoose.Schema.ObjectId]
  }
)

User.methods.follow = function (user) {
  this.following.push(user)
  return this
}

module.exports = function (db) {
  module.exports = db.model('User', User)
}
