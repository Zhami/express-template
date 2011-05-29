var Base = require('../common').Base

// Home page
var Home = function Home () {
  Base.call(this, 'home')
}

Home.prototype.__proto__ = Base.prototype

module.exports = Home

Home.prototype.index = function (r) {
  r.render('index')
}
