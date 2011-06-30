var common        = require('../common')
  , Page          = common.Page
  , NotFoundError = common.NotFoundError

// Home page
var Home = function Home () {
  Page.call(this, 'home')
}

// Inherit from Page and export
Home.prototype.__proto__ = Page.prototype

module.exports = Home

// The home page
Home.prototype.index = function (r) {
  r.setTitle('It is working!')
  r.render('index')
}

// 404 Page
Home.prototype.notFound = function (r) {
  r.error(new NotFoundError(r.request.url))
}
