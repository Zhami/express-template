require('../../common')

var test = microtest.module('app/home/index.js')

test.requires('../common', [{ class: 'Base' }])

var EXPORTS
  , HOME

EXPORTS = test.compile()

test.describe('Home inherits Base', function () {
  assert.equal(EXPORTS.prototype.__proto__, test.required.Base.prototype)
})

test.describe('new Home', function () {
  var base_call

  base_call = test.expect(test.required.Base, 1, 'home')

  HOME = new EXPORTS()

  assert.equal(HOME, base_call.calls[0].context)
})

test.describe('Home#index', function () {
  var REQUEST = test.object('request')

  test.expect(REQUEST, 'render', 1, ['index'])

  HOME.index(REQUEST)
})
